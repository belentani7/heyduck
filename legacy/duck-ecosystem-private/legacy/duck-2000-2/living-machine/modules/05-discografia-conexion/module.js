let runtime = null;

const INPUT_EVENTS = ["duck:module:04:output", "duck:lab:output"];

function resolveModule(root) {
  if (!(root instanceof Element)) throw new TypeError("Hume 05 requiere un elemento raíz válido.");
  return root.matches('[data-duck-module="05"]') ? root : root.querySelector('[data-duck-module="05"]');
}

function normalizeFingerprint(value) {
  if (!value) return "huella sin definir";
  if (typeof value === "string") return value.trim() || "huella sin definir";
  if (typeof value === "object") {
    const parts = Object.entries(value)
      .filter(([, item]) => item !== null && item !== undefined && item !== "")
      .map(([key, item]) => `${key}: ${item}`);
    return parts.join(" · ") || "huella sin definir";
  }
  return String(value);
}

function normalizeLayers(value) {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === "string") return value.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

function emit(bus, name, detail) {
  bus.dispatchEvent(new CustomEvent(name, { detail }));
}

function createShader(canvas, container, reducedMotion) {
  const gl = canvas.getContext("webgl", { alpha: false, antialias: false, powerPreference: "low-power" });
  if (!gl) {
    container.classList.add("is-fallback");
    return { update() {}, start() {}, stop() {}, destroy() {} };
  }

  const vertexSource = `
    attribute vec2 p;
    void main(){ gl_Position = vec4(p, 0.0, 1.0); }
  `;
  const fragmentSource = `
    precision mediump float;
    uniform vec2 r;
    uniform float t;
    uniform float e;
    uniform float seed;
    void main(){
      vec2 uv = (gl_FragCoord.xy * 2.0 - r.xy) / min(r.x, r.y);
      float time = t * (0.08 + e * 0.12);
      float a = atan(uv.y, uv.x);
      float d = length(uv);
      float wave = sin(d * (8.0 + e * 5.0) - time * 4.0 + sin(a * 3.0 + seed) * 1.8);
      float vein = sin(uv.x * 7.0 - uv.y * 5.0 + time + seed) * 0.5 + 0.5;
      float ink = smoothstep(0.7, -0.35, wave * 0.34 + d - 0.48 - vein * 0.12);
      vec3 purple = vec3(0.145, 0.067, 0.239);
      vec3 green = vec3(0.722, 1.0, 0.212);
      vec3 blackInk = vec3(0.035, 0.043, 0.035);
      vec3 color = mix(purple, green, ink * (0.58 + e * 0.32));
      color = mix(color, blackInk, smoothstep(0.5, 1.25, d));
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) || "Shader inválido");
    return shader;
  }

  let program;
  try {
    program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, vertexSource));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragmentSource));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || "Programa WebGL inválido");
  } catch (error) {
    container.classList.add("is-fallback");
    return { update() {}, start() {}, stop() {}, destroy() {} };
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, "p");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const resolution = gl.getUniformLocation(program, "r");
  const time = gl.getUniformLocation(program, "t");
  const energy = gl.getUniformLocation(program, "e");
  const seedLocation = gl.getUniformLocation(program, "seed");
  let raf = 0;
  let active = false;
  let energyValue = 0.22;
  let seedValue = 1;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
    gl.uniform2f(resolution, width, height);
  }

  function draw(milliseconds = 0) {
    resize();
    gl.uniform1f(time, milliseconds / 1000);
    gl.uniform1f(energy, energyValue);
    gl.uniform1f(seedLocation, seedValue);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    if (active && !reducedMotion) raf = requestAnimationFrame(draw);
  }

  return {
    update(fingerprint, layers) {
      const text = `${fingerprint}|${layers.join("|")}`;
      seedValue = [...text].reduce((sum, character) => (sum + character.charCodeAt(0)) % 997, 1) / 37;
      energyValue = Math.min(1, 0.18 + layers.length * 0.13 + (text.length % 17) / 45);
      if (reducedMotion || !active) draw(0);
    },
    start() { if (active) return; active = true; draw(0); },
    stop() { active = false; cancelAnimationFrame(raf); },
    destroy() { active = false; cancelAnimationFrame(raf); gl.deleteBuffer(buffer); gl.deleteProgram(program); }
  };
}

export function mount(root, bus = document) {
  destroy();
  const moduleRoot = resolveModule(root);
  if (!moduleRoot) throw new Error("No se encontró [data-duck-module=\"05\"].");
  if (!bus || typeof bus.addEventListener !== "function" || typeof bus.dispatchEvent !== "function") {
    throw new TypeError("El bus de Hume 05 debe implementar EventTarget.");
  }

  const cleanup = [];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const htmlState = document.documentElement.dataset;
  const live = moduleRoot.querySelector("[data-live]");
  const failure = moduleRoot.querySelector("[data-failure]");
  const fingerprintOutput = moduleRoot.querySelector("[data-fingerprint]");
  const layersOutput = moduleRoot.querySelector("[data-layers]");
  const visualDescription = moduleRoot.querySelector("[data-visual-description]");
  const briefingOutput = moduleRoot.querySelector("[data-briefing]");
  const contact = moduleRoot.querySelector("[data-contact]");
  const casePanel = moduleRoot.querySelector(".hume-case");
  const caseCover = moduleRoot.querySelector("[data-case-cover]");
  const caseTitle = moduleRoot.querySelector("[data-case-title]");
  const caseArtist = moduleRoot.querySelector("[data-case-artist]");
  const caseStatus = moduleRoot.querySelector("[data-case-status]");
  const shaderContainer = moduleRoot.querySelector("[data-shader]");
  const canvas = shaderContainer.querySelector("canvas");
  const shader = createShader(canvas, shaderContainer, reducedMotion);

  let selectedWork = moduleRoot.querySelector(".hume-work.is-selected");
  let fingerprint = normalizeFingerprint(htmlState.duckSonicFingerprint);
  let activeLayers = normalizeLayers(htmlState.duckActiveLayers);
  let upstreamPhrase = htmlState.duckBriefingPhrase || "";
  let audio = null;
  let activeListenButton = null;

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    cleanup.push(() => target.removeEventListener(name, handler, options));
  }

  function announce(message) { live.textContent = message; }

  function buildBriefing() {
    const work = selectedWork?.dataset.title || "obra a escolher";
    const base = upstreamPhrase || `Quero desenvolver uma faixa com Duck. Minha direção sonora é ${fingerprint}.`;
    const layerText = activeLayers.length ? ` Camadas ativas: ${activeLayers.join(", ")}.` : "";
    const text = `${base}${layerText} Obra de referência no portfolio: ${work}.`;
    briefingOutput.value = text;
    contact.href = `mailto:duck-beats@hotmail.com?subject=${encodeURIComponent("Novo projeto com Duck")}&body=${encodeURIComponent(text)}`;
    htmlState.duckBriefingReady = "true";
    return text;
  }

  function outputState() {
    return {
      selectedWork: selectedWork?.dataset.workId || null,
      briefingPhrase: buildBriefing(),
      contactChannel: "email"
    };
  }

  function selectWork(card, shouldFocus = false) {
    if (!card) return;
    moduleRoot.querySelectorAll(".hume-work").forEach((work) => {
      const selected = work === card;
      work.classList.toggle("is-selected", selected);
      work.querySelector(".hume-work__select").setAttribute("aria-pressed", String(selected));
    });
    selectedWork = card;
    const image = card.querySelector("img");
    caseCover.src = image.getAttribute("src");
    caseCover.alt = image.alt;
    caseTitle.textContent = card.dataset.title;
    caseArtist.textContent = card.dataset.artist;
    caseStatus.textContent = card.dataset.status;
    casePanel.classList.remove("is-scanning");
    void casePanel.offsetWidth;
    if (!reducedMotion) casePanel.classList.add("is-scanning");
    htmlState.duckSelectedWork = card.dataset.workId;
    buildBriefing();
    announce(`${card.dataset.title} selecionada como referência.`);
    emit(bus, "duck:work:selected", outputState());
    emit(bus, "duck:module:05:output", outputState());
    if (shouldFocus) caseTitle.focus?.();
  }

  function stopAudio() {
    if (audio) {
      audio.pause();
      audio.src = "";
      audio = null;
    }
    if (activeListenButton) {
      activeListenButton.setAttribute("aria-pressed", "false");
      activeListenButton.textContent = "Ouvir 30s";
      activeListenButton = null;
    }
  }

  function togglePreview(button, card) {
    if (activeListenButton === button && audio && !audio.paused) {
      stopAudio();
      announce("Prévia parada.");
      return;
    }
    stopAudio();
    selectWork(card);
    audio = new Audio(card.dataset.preview);
    audio.preload = "none";
    activeListenButton = button;
    button.setAttribute("aria-pressed", "true");
    button.textContent = "Parar";
    audio.addEventListener("ended", stopAudio, { once: true });
    audio.addEventListener("error", () => {
      stopAudio();
      announce("A prévia não está disponível agora. A obra continua acessível.");
    }, { once: true });
    audio.play().then(() => announce(`Reproduzindo prévia de ${card.dataset.title}.`)).catch(() => {
      stopAudio();
      announce("O navegador não conseguiu iniciar a prévia.");
    });
  }

  moduleRoot.querySelectorAll(".hume-work").forEach((card) => {
    const selectButton = card.querySelector(".hume-work__select");
    listen(selectButton, "click", () => selectWork(card));
    const listenButton = card.querySelector(".hume-work__listen");
    if (listenButton) listen(listenButton, "click", () => togglePreview(listenButton, card));
  });

  function applyUpstream(event) {
    const detail = event.detail || {};
    fingerprint = normalizeFingerprint(detail.sonicFingerprint ?? detail.fingerprint);
    activeLayers = normalizeLayers(detail.activeLayers ?? detail.layers);
    upstreamPhrase = String(detail.briefingPhrase || detail.phrase || "").trim();
    fingerprintOutput.textContent = fingerprint;
    layersOutput.textContent = activeLayers.length ? `camadas: ${activeLayers.join(" · ")}` : "camadas: nenhuma selecionada";
    visualDescription.textContent = activeLayers.length
      ? `Fluxo ${activeLayers.length > 3 ? "intenso" : "aberto"}, respondendo a ${activeLayers.join(", ")}.`
      : "Fluxo calmo, sem camadas ativas.";
    moduleRoot.dataset.state = "connected";
    shader.update(fingerprint, activeLayers);
    buildBriefing();
    announce("Huella sonora recebida. O briefing e a síntese visual foram atualizados.");
  }

  INPUT_EVENTS.forEach((name) => listen(bus, name, applyUpstream));

  listen(moduleRoot.querySelector("[data-copy-briefing]"), "click", async () => {
    const text = buildBriefing();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      briefingOutput.focus();
      briefingOutput.select();
      document.execCommand("copy");
      briefingOutput.setSelectionRange(0, 0);
    }
    announce("Briefing copiado. Pode colar no seu canal de contacto preferido.");
    emit(bus, "duck:briefing:copied", outputState());
  });

  listen(contact, "click", () => emit(bus, "duck:contact:intent", outputState()));

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) shader.start(); else shader.stop();
  }, { rootMargin: "100px 0px", threshold: 0.01 });
  observer.observe(shaderContainer);
  cleanup.push(() => observer.disconnect());

  if (!reducedMotion && window.gsap && window.ScrollTrigger) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    if (window.CustomEase) {
      window.gsap.registerPlugin(window.CustomEase);
      window.CustomEase.create("duckHume", "M0,0 C0.18,0.78 0.28,1 1,1");
    }
    const context = window.gsap.context(() => {
      window.gsap.from(moduleRoot.querySelectorAll(".hume-work"), {
        opacity: 0,
        yPercent: 10,
        stagger: 0.07,
        duration: 0.8,
        ease: window.CustomEase ? "duckHume" : "power3.out",
        scrollTrigger: { trigger: moduleRoot.querySelector(".hume-stage"), start: "top 78%", once: true }
      });
    }, moduleRoot);
    cleanup.push(() => context.revert());
  }

  fingerprintOutput.textContent = fingerprint;
  layersOutput.textContent = activeLayers.length ? `camadas: ${activeLayers.join(" · ")}` : "camadas: nenhuma selecionada";
  shader.update(fingerprint, activeLayers);
  buildBriefing();
  moduleRoot.dataset.state = upstreamPhrase || activeLayers.length ? "connected" : "waiting";
  failure.hidden = true;

  runtime = { moduleRoot, cleanup, shader, stopAudio };
  return outputState();
}

export function destroy() {
  if (!runtime) return;
  runtime.stopAudio();
  runtime.cleanup.splice(0).reverse().forEach((dispose) => {
    try { dispose(); } catch { /* cleanup aislado */ }
  });
  runtime.shader.destroy();
  delete document.documentElement.dataset.duckSelectedWork;
  delete document.documentElement.dataset.duckBriefingReady;
  runtime.moduleRoot.dataset.state = "destroyed";
  runtime = null;
}
