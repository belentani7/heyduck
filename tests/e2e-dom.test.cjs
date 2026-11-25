"use strict";

/**
 * Prueba end-to-end del camino feliz en un DOM real (jsdom).
 *
 * No hay navegador disponible en el entorno de integración (la descarga de
 * Chromium está bloqueada), así que se carga el propio `index.html` con
 * `runScripts: "dangerously"` y `resources: "usable"`: jsdom resuelve y ejecuta
 * los `<script src>` del repositorio en el orden del documento, igual que un
 * navegador con `defer`. No se evalúa código a mano: se ejecuta el HTML real.
 *
 * Las dos APIs de plataforma que el DOM no implementa se sustituyen en
 * `beforeParse`: Web Audio y Canvas/WebGL.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const fs = require("node:fs");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");
const PAGE = path.join(ROOT, "index.html");

/** AudioContext mínimo con la superficie que usa js/studio.js. */
function fakeAudioContext(log) {
  const param = (value = 0) => ({
    value,
    setValueAtTime: () => {},
    setTargetAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
    cancelScheduledValues: () => {}
  });

  const makeNode = (kind) => ({
    kind,
    type: kind,
    gain: param(),
    frequency: param(),
    Q: param(),
    connect: (target) => {
      log.connections.push(kind + "->" + (target && target.kind ? target.kind : "destino"));
      return target;
    },
    disconnect: () => {},
    start: () => log.started.push(kind),
    stop: () => log.stopped.push(kind)
  });

  return class FakeAudioContext {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = { kind: "destination", connect: () => {} };
    }
    createGain() {
      return makeNode("gain");
    }
    createOscillator() {
      return makeNode("oscillator");
    }
    createBiquadFilter() {
      return makeNode("filter");
    }
    createAnalyser() {
      const analyser = makeNode("analyser");
      analyser.fftSize = 2048;
      analyser.frequencyBinCount = 1024;
      analyser.smoothingTimeConstant = 0.8;
      analyser.getByteFrequencyData = (array) => array.fill(0);
      analyser.getByteTimeDomainData = (array) => array.fill(128);
      return analyser;
    }
    resume() {
      this.state = "running";
      return Promise.resolve();
    }
    suspend() {
      this.state = "suspended";
      return Promise.resolve();
    }
  };
}

/** Canvas 2D mínimo: registra los rectángulos pintados. */
function fakeCanvasContext(log) {
  return {
    setTransform: () => {},
    clearRect: () => {},
    fillRect: (x, y, w, h) => log.rects.push({ x, y, w, h }),
    createLinearGradient: () => ({ addColorStop: () => {} }),
    set fillStyle(value) {
      log.fills.push(value);
    },
    get fillStyle() {
      return "";
    }
  };
}

async function loadSite(options = {}) {
  const audio = { connections: [], started: [], stopped: [] };
  const canvas = { rects: [], fills: [] };
  const consoleErrors = [];
  const virtualConsole = new VirtualConsole();
  virtualConsole.on("jsdomError", (error) => consoleErrors.push(error.message));
  virtualConsole.on("error", (message) => consoleErrors.push(String(message)));

  const dom = await JSDOM.fromFile(PAGE, {
    runScripts: "dangerously",
    resources: "usable",
    pretendToBeVisual: true,
    virtualConsole,
    beforeParse(window) {
      window.matchMedia = (query) => ({
        media: query,
        matches: Boolean(options.reducedMotion),
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false
      });

      window.HTMLCanvasElement.prototype.getContext = function getContext(kind) {
        if (kind === "2d") return fakeCanvasContext(canvas);
        return null; // sin WebGL: el hero debe degradar, no lanzar
      };

      window.AudioContext = fakeAudioContext(audio);

      window.IntersectionObserver = class {
        constructor(callback) {
          this.callback = callback;
        }
        observe(target) {
          this.callback([{ isIntersecting: true, target }], this);
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      };
    }
  });

  const { window } = dom;
  await new Promise((resolve) => {
    if (window.document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });

  return { window, document: window.document, audio, canvas, consoleErrors };
}

test("la portada se hidrata desde data.js sin errores de consola", async () => {
  const { window, consoleErrors } = await loadSite();
  assert.deepEqual(consoleErrors, [], "la carga no debe registrar errores");
  assert.ok(window.DUCK_DATA, "data.js debe exponer el catálogo en window");
  // El array viene del reino de jsdom: se copia al de Node antes de comparar.
  assert.deepEqual([...window.HeyduckSite.warnings], [], "site.js no debe reportar contenedores vacíos");
});

test("el catálogo pinta las ocho referencias con su estado honesto", async () => {
  const { document, window } = await loadSite();
  const cards = document.querySelectorAll("[data-releases] .release");
  assert.equal(cards.length, window.DUCK_DATA.singles.length);
  assert.equal(cards.length, 8);

  const linked = [...document.querySelectorAll("[data-releases] a.release-link")];
  const pending = [...document.querySelectorAll("[data-releases] .release-pending")];
  assert.equal(linked.length + pending.length, 8, "cada referencia declara enlace o estado pendiente");

  for (const anchor of linked) {
    assert.match(anchor.getAttribute("href"), /^https:\/\//);
    assert.equal(anchor.getAttribute("target"), "_blank");
    assert.match(anchor.getAttribute("rel"), /noopener/);
    assert.ok(anchor.getAttribute("aria-label"), "el enlace necesita nombre accesible");
  }
  assert.ok(pending.length > 0, "hay referencias sin enlace verificado y deben decirlo");
  for (const status of pending) {
    assert.equal(status.getAttribute("role"), "note");
    assert.doesNotMatch(status.outerHTML, /href=/, "un pendiente no puede ser un enlace");
  }

  const sources = document.querySelectorAll("[data-releases] picture source[type='image/webp']");
  assert.equal(sources.length, 7, "siete portadas raster tienen variante WebP");
  for (const image of document.querySelectorAll("[data-releases] img")) {
    assert.ok(image.getAttribute("alt"));
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("decoding"), "async");
    assert.ok(image.getAttribute("width") && image.getAttribute("height"), "dimensiones para evitar CLS");
  }
});

test("servicios, estaciones y cifras se rellenan sin dejar huecos", async () => {
  const { document, window } = await loadSite();
  assert.equal(
    document.querySelectorAll("[data-services] .service").length,
    window.DUCK_DATA.services.length
  );
  assert.equal(document.querySelectorAll("[data-stations] .station").length, 4);
  assert.equal(document.querySelector("[data-stat-streams]").textContent, "36M");
  assert.equal(document.querySelector("[data-stat-releases]").textContent, "40");
  assert.equal(document.querySelector("[data-stat-years]").textContent, "12");
});

test("la estación crea el grafo de audio solo tras el gesto y lo refleja en ARIA", async () => {
  const { document, audio } = await loadSite();
  const toggle = document.querySelector("#synth-toggle");
  const status = document.querySelector("#studio-status");

  assert.equal(toggle.getAttribute("aria-pressed"), "false");
  assert.equal(audio.started.length, 0, "sin gesto no debe crearse audio");

  toggle.click();
  assert.equal(toggle.getAttribute("aria-pressed"), "true");
  assert.equal(toggle.textContent, "Detener sintetizador");
  assert.deepEqual(audio.started, ["oscillator", "oscillator", "oscillator"], "principal, sub y LFO");
  assert.ok(audio.connections.includes("gain->gain"), "la envolvente va al maestro");
  assert.match(status.textContent, /Sintetizador activo/);

  toggle.click();
  assert.equal(toggle.getAttribute("aria-pressed"), "false");
  assert.ok(audio.stopped.length >= 3, "los osciladores deben detenerse");
});

test("el metrónomo programa clics y se puede detener", async () => {
  const { document, audio } = await loadSite();
  const metronome = document.querySelector("#metro-toggle");

  metronome.click();
  assert.equal(metronome.getAttribute("aria-pressed"), "true");
  assert.match(document.querySelector("#studio-status").textContent, /Metrónomo activo/);
  assert.ok(audio.started.includes("oscillator"), "el clic usa un oscilador");

  metronome.click();
  assert.equal(metronome.getAttribute("aria-pressed"), "false");
  assert.match(document.querySelector("#studio-status").textContent, /Metrónomo detenido/);
});

test("los controles actualizan su lectura y respetan ARIA", async () => {
  const { document, window } = await loadSite();
  const frequency = document.querySelector("#synth-freq");
  const volume = document.querySelector("#synth-volume");
  const bpm = document.querySelector("#metro-bpm");

  frequency.value = "440";
  frequency.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.match(document.querySelector("#synth-freq-out").textContent, /440 Hz · A4/);

  volume.value = "0.4";
  volume.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.equal(document.querySelector("#synth-volume-out").textContent, "40 %");

  bpm.value = "120";
  bpm.dispatchEvent(new window.Event("input", { bubbles: true }));
  assert.match(document.querySelector("#metro-bpm-out").textContent, /120 BPM · 500 ms/);
});

test("la afinación de 432 Hz se aplica a la frecuencia real", async () => {
  const { document, window } = await loadSite();
  const tuning = document.querySelector("#synth-tuning");
  const frequency = document.querySelector("#synth-freq");

  frequency.value = "440";
  frequency.dispatchEvent(new window.Event("input", { bubbles: true }));
  tuning.value = "432";
  tuning.dispatchEvent(new window.Event("change", { bubbles: true }));

  // 440 escrita con referencia 432 → 432 Hz reales; la nota sigue siendo A4.
  assert.match(document.querySelector("#synth-freq-out").textContent, /432 Hz · A4/);
  assert.match(document.querySelector("#studio-status").textContent, /432 Hz/);
});

test("sin WebGL el hero degrada a CSS en lugar de fallar", async () => {
  const { document, consoleErrors } = await loadSite();
  assert.ok(document.querySelector(".hero").classList.contains("hero--fallback"));
  assert.equal(document.querySelector("#hero-gl").getAttribute("aria-hidden"), "true");
  assert.ok(
    consoleErrors.every((message) => !/WebGL/.test(message)),
    "un navegador sin WebGL no es un error de página"
  );
});

test("con movimiento reducido el analizador no entra en bucle", async () => {
  const { window } = await loadSite({ reducedMotion: true });
  const studio = window.HeyduckStudio;
  assert.ok(studio, "la estación debe existir");
  studio.startVisualizer();
  assert.equal(studio.raf, 0, "no debe programarse ningún frame");
});

test("la página declara un único landmark principal y un salto válido", async () => {
  const { document } = await loadSite();
  assert.equal(document.querySelectorAll("main").length, 1);
  assert.equal(document.querySelectorAll("h1").length, 1);
  assert.equal(document.querySelectorAll("a.skip").length, 1);
  const skip = document.querySelector("a.skip");
  assert.ok(document.querySelector(skip.getAttribute("href")), "el salto apunta a un elemento existente");
});

test("el documento real carga los módulos por <script src>", () => {
  const html = fs.readFileSync(PAGE, "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.deepEqual(scripts, [
    "js/audio-core.js",
    "data.js",
    "js/site.js",
    "js/studio.js",
    "js/hero-gl.js"
  ]);
});
