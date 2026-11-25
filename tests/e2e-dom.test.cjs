"use strict";

/**
 * Prueba end-to-end del camino feliz, ejecutada en un DOM real (jsdom).
 *
 * No hay navegador disponible en el entorno de integración (la descarga de
 * Chromium está bloqueada), así que se simula el DOM y las dos APIs de
 * plataforma que usa el sitio: Web Audio y WebGL/Canvas. Todo lo demás —el
 * HTML, el CSS referenciado, los módulos y el orden de carga— es el del
 * repositorio, sin dobles.
 *
 * Se verifica lo que un visitante obtiene de verdad: la página se hidrata desde
 * data.js, el catálogo se pinta, los enlaces pendientes no se convierten en
 * botones falsos y la estación responde a los gestos.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { JSDOM, VirtualConsole } = require("jsdom");

const ROOT = path.resolve(__dirname, "..");

/** AudioContext mínimo con la superficie que usa js/studio.js. */
function fakeAudioContext(log) {
  const param = () => ({
    value: 0,
    setValueAtTime: () => {},
    setTargetAtTime: () => {},
    exponentialRampToValueAtTime: () => {},
    cancelScheduledValues: () => {}
  });

  const node = (type) => ({
    type,
    gain: param(),
    frequency: param(),
    Q: param(),
    connect: (target) => {
      log.connections.push(type + "->" + (target && target.kind ? target.kind : "destino"));
      return target;
    },
    disconnect: () => {},
    start: () => log.started.push(type),
    stop: () => log.stopped.push(type)
  });

  return class FakeAudioContext {
    constructor() {
      this.state = "running";
      this.currentTime = 0;
      this.sampleRate = 44100;
      this.destination = { kind: "destination", connect: () => {} };
    }
    createGain() {
      const g = node("gain");
      g.kind = "gain";
      return g;
    }
    createOscillator() {
      const o = node("oscillator");
      o.kind = "oscillator";
      return o;
    }
    createBiquadFilter() {
      const f = node("filter");
      f.kind = "filter";
      return f;
    }
    createAnalyser() {
      const a = node("analyser");
      a.kind = "analyser";
      a.fftSize = 2048;
      a.frequencyBinCount = 1024;
      a.smoothingTimeConstant = 0.8;
      a.getByteFrequencyData = (array) => array.fill(0);
      a.getByteTimeDomainData = (array) => array.fill(128);
      return a;
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

/** Canvas 2D mínimo: registra los rectángulos que se pintan. */
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

function loadSite() {
  const audio = { connections: [], started: [], stopped: [] };
  const canvas = { rects: [], fills: [] };
  const virtualConsole = new VirtualConsole();
  const consoleErrors = [];
  virtualConsole.on("jsdomError", (error) => consoleErrors.push(error.message));
  virtualConsole.on("error", (message) => consoleErrors.push(String(message)));

  const html = require("node:fs").readFileSync(path.join(ROOT, "index.html"), "utf8");
  const scripts = [...html.matchAll(/<script[^>]+src="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(scripts.length >= 5, "la portada debe cargar sus módulos");

  // `runScripts: "outside-only"` permite evaluar los módulos en el contexto del
  // documento (con `document`, `window` y los prototipos reales) sin ejecutar
  // nada del HTML.
  const dom = new JSDOM(html.replace(/<script[^>]+src="[^"]+"[^>]*><\/script>/g, ""), {
    url: "https://heyduck.vercel.app/",
    runScripts: "outside-only",
    pretendToBeVisual: true,
    virtualConsole
  });
  const { window } = dom;

  window.matchMedia = window.matchMedia || (() => ({ matches: false, addListener() {}, removeListener() {} }));

  // Canvas: el de la estación (2D) y el del hero (WebGL, que aquí no existe).
  window.HTMLCanvasElement.prototype.getContext = function getContext(kind) {
    if (kind === "2d") return fakeCanvasContext(canvas);
    return null; // sin WebGL: el hero debe degradar, no lanzar
  };

  window.AudioContext = fakeAudioContext(audio);
  window.requestAnimationFrame = (callback) => {
    window.setTimeout(() => callback(window.performance.now()), 0);
    return 1;
  };
  window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  window.IntersectionObserver = class {
    constructor(callback) {
      this.callback = callback;
    }
    observe(target) {
      this.callback([{ isIntersecting: true, target }]);
    }
    unobserve() {}
    disconnect() {}
  };

  // Se evalúan los módulos en orden de dependencia, como haría `defer`.
  const document = window.document;
  const fs = require("node:fs");
  for (const script of scripts) {
    const source = fs.readFileSync(path.join(ROOT, script), "utf8");
    window.eval(source);
  }
  window.document.dispatchEvent(new window.Event("DOMContentLoaded"));
  window.document.dispatchEvent(new window.Event("load"));

  return { window, document, audio, canvas, consoleErrors };
}

test("la portada se hidrata desde data.js sin errores de consola", () => {
  const { document, window, consoleErrors } = loadSite();
  assert.deepEqual(consoleErrors, [], "la carga no debe registrar errores");
  assert.ok(window.DUCK_DATA, "data.js debe exponer el catálogo en window");
  assert.equal(window.HeyduckSite.warnings.length, 0, "site.js no debe reportar contenedores vacíos: " + window.HeyduckSite.warnings);
});

test("el catálogo pinta las ocho referencias con su estado honesto", () => {
  const { document, window } = loadSite();
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

  // Las portadas usan <picture> con WebP y respaldo raster.
  const sources = document.querySelectorAll("[data-releases] picture source[type='image/webp']");
  assert.equal(sources.length, 7, "siete portadas raster tienen variante WebP");
  for (const image of document.querySelectorAll("[data-releases] img")) {
    assert.ok(image.getAttribute("alt"));
    assert.equal(image.getAttribute("loading"), "lazy");
    assert.equal(image.getAttribute("decoding"), "async");
    assert.ok(image.getAttribute("width") && image.getAttribute("height"), "dimensiones para evitar CLS");
  }
});

test("servicios, estaciones y cifras se rellenan sin dejar huecos", () => {
  const { document, window } = loadSite();
  assert.equal(document.querySelectorAll("[data-services] .service").length, window.DUCK_DATA.services.length);
  assert.equal(document.querySelectorAll("[data-stations] .station").length, 4);
  assert.equal(document.querySelector("[data-stat-streams]").textContent, "36M");
  assert.equal(document.querySelector("[data-stat-releases]").textContent, "40");
  assert.equal(document.querySelector("[data-stat-years]").textContent, "12");
});

test("la estación crea el grafo de audio solo tras el gesto y lo refleja en ARIA", () => {
  const { document, audio } = loadSite();
  const toggle = document.querySelector("#synth-toggle");
  const status = document.querySelector("#studio-status");

  assert.equal(toggle.getAttribute("aria-pressed"), "false");
  assert.equal(audio.started.length, 0, "sin clic no debe sonar ni crearse audio");

  toggle.click();
  assert.equal(toggle.getAttribute("aria-pressed"), "true");
  assert.equal(toggle.textContent, "Detener sintetizador");
  assert.deepEqual(audio.started, ["oscillator", "oscillator", "oscillator"], "principal, sub y LFO");
  assert.ok(audio.connections.some((link) => link === "gain->gain"), "la envolvente va al maestro");
  assert.match(status.textContent, /Sintetizador activo/);

  toggle.click();
  assert.equal(toggle.getAttribute("aria-pressed"), "false");
  assert.ok(audio.stopped.length >= 3, "los osciladores deben detenerse");
});

test("el metrónomo programa clics y se puede detener", () => {
  const { document, audio, window } = loadSite();
  const metronome = document.querySelector("#metro-toggle");
  metronome.click();
  assert.equal(metronome.getAttribute("aria-pressed"), "true");
  assert.match(document.querySelector("#studio-status").textContent, /Metrónomo activo/);
  assert.ok(audio.started.includes("oscillator"), "el clic usa un oscilador");

  metronome.click();
  assert.equal(metronome.getAttribute("aria-pressed"), "false");
  assert.match(document.querySelector("#studio-status").textContent, /Metrónomo detenido/);
  window.close();
});

test("los controles actualizan su lectura y el estado activo sin romperse", () => {
  const { document, window } = loadSite();
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

test("sin WebGL el hero degrada a CSS en lugar de fallar", () => {
  const { document, consoleErrors } = loadSite();
  const hero = document.querySelector(".hero");
  assert.ok(hero.classList.contains("hero--fallback"), "debe aplicarse la clase de respaldo");
  assert.equal(document.querySelector("#hero-gl").getAttribute("aria-hidden"), "true");
  assert.ok(consoleErrors.every((message) => !/WebGL/.test(message)), "el fallo de WebGL no es un error de página");
});

test("con movimiento reducido no se anima el analizador", () => {
  const original = JSDOM.prototype.constructor;
  const { window, document } = loadSite();
  window.matchMedia = () => ({ matches: true, addListener() {}, removeListener() {} });
  const studio = window.HeyduckStudio;
  assert.ok(studio, "la estación debe existir");
  // Con reduced motion, el visualizador no arranca un bucle: pinta un frame.
  studio.startVisualizer();
  assert.equal(studio.raf, 0);
  assert.ok(original);
});

test("la página declara un único landmark principal y un salto válido", () => {
  const { document } = loadSite();
  assert.equal(document.querySelectorAll("main").length, 1);
  assert.equal(document.querySelectorAll("h1").length, 1);
  const skip = document.querySelector("a.skip");
  assert.equal(document.querySelectorAll("a.skip").length, 1);
  assert.ok(document.querySelector(skip.getAttribute("href")), "el salto apunta a un elemento existente");
});
