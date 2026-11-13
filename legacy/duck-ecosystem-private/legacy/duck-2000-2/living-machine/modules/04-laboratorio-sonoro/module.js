const DEFAULT_STATE = Object.freeze({
  pattern: "drift",
  layers: ["pulse", "body"],
  pressure: 42,
  openness: 64,
  space: 38,
  volume: 56,
  tempo: 96,
  processStage: "construir",
  muted: false,
  powered: false
});

const PATTERN_CODES = { drift: "DRF", bounce: "BNC", drive: "DRV" };
const LAYER_CODES = { pulse: "P", body: "B", air: "A", glitch: "G" };

let activeInstance = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value)));
}

function eventTarget(bus) {
  return bus && typeof bus.dispatchEvent === "function" ? bus : document;
}

function moduleRoot(root) {
  if (!root) return null;
  if (root.matches?.('[data-duck-module="04"]')) return root;
  return root.querySelector?.('[data-duck-module="04"]') ?? null;
}

function formatPhrase(state) {
  const motion = {
    drift: "un pulso elástico",
    bounce: "un ritmo juguetón",
    drive: "un impulso frontal"
  }[state.pattern];
  const weight = state.pressure > 66 ? "con presión física" : state.pressure < 34 ? "con tacto ligero" : "con cuerpo preciso";
  const light = state.openness > 66 ? "brillo abierto" : state.openness < 34 ? "detalle oscuro" : "textura definida";
  const room = state.space > 66 ? "un espacio cinematográfico" : state.space < 34 ? "un espacio íntimo" : "aire para respirar";
  const accent = state.layers.includes("glitch") ? " y un gesto digital inesperado" : state.layers.includes("air") ? " y una capa de aire" : "";
  return `${motion[0].toUpperCase()}${motion.slice(1)} ${weight}, ${light} y ${room}${accent}.`;
}

function fingerprint(state) {
  const layers = ["pulse", "body", "air", "glitch"].filter((layer) => state.layers.includes(layer)).map((layer) => LAYER_CODES[layer]).join("") || "0";
  return `${PATTERN_CODES[state.pattern]}-${layers}-${String(state.pressure).padStart(2, "0")}${String(state.openness).padStart(2, "0")}${String(state.space).padStart(2, "0")}`;
}

function createAudioEngine(onBeat) {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) throw new Error("Web Audio API no disponible");

  const context = new AudioContextClass({ latencyHint: "interactive" });
  const input = context.createGain();
  const dry = context.createGain();
  const delay = context.createDelay(1.2);
  const feedback = context.createGain();
  const wet = context.createGain();
  const master = context.createGain();
  const compressor = context.createDynamicsCompressor();
  const analyser = context.createAnalyser();

  delay.delayTime.value = 0.26;
  feedback.gain.value = 0.22;
  wet.gain.value = 0.18;
  dry.gain.value = 0.9;
  master.gain.value = 0;
  compressor.threshold.value = -18;
  compressor.knee.value = 16;
  compressor.ratio.value = 8;
  compressor.attack.value = 0.004;
  compressor.release.value = 0.18;
  analyser.fftSize = 256;
  analyser.smoothingTimeConstant = 0.82;

  input.connect(dry).connect(master);
  input.connect(delay).connect(wet).connect(master);
  delay.connect(feedback).connect(delay);
  master.connect(compressor).connect(analyser).connect(context.destination);

  let timer = 0;
  let nextStepAt = 0;
  let step = 0;
  let state = { ...DEFAULT_STATE, layers: [...DEFAULT_STATE.layers] };
  let bodyVoice = null;
  let airVoice = null;

  function connectVoice(node) {
    node.connect(input);
    return node;
  }

  function pulse(time, strong) {
    const oscillator = context.createOscillator();
    const gain = connectVoice(context.createGain());
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(strong ? 112 : 82, time);
    oscillator.frequency.exponentialRampToValueAtTime(strong ? 46 : 52, time + 0.11);
    const level = (0.045 + state.pressure * 0.00115) * (strong ? 1 : 0.72);
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(level, time + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.16);
    oscillator.connect(gain);
    oscillator.start(time);
    oscillator.stop(time + 0.18);
  }

  function digitalGesture(time) {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = connectVoice(context.createGain());
    oscillator.type = "square";
    oscillator.frequency.value = state.pattern === "drive" ? 320 : 220;
    filter.type = "bandpass";
    filter.frequency.value = 500 + state.openness * 24;
    filter.Q.value = 7;
    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(0.018 + state.pressure * 0.00025, time + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.055);
    oscillator.connect(filter).connect(gain);
    oscillator.start(time);
    oscillator.stop(time + 0.065);
  }

  function createBody() {
    const oscillator = context.createOscillator();
    const filter = context.createBiquadFilter();
    const gain = connectVoice(context.createGain());
    oscillator.type = "triangle";
    oscillator.frequency.value = state.pattern === "bounce" ? 73.42 : 55;
    filter.type = "lowpass";
    filter.frequency.value = 220 + state.openness * 11;
    filter.Q.value = 1.4;
    gain.gain.value = 0.018 + state.pressure * 0.00018;
    oscillator.connect(filter).connect(gain);
    oscillator.start();
    return { oscillator, filter, gain };
  }

  function createAir() {
    const length = context.sampleRate * 2;
    const buffer = context.createBuffer(1, length, context.sampleRate);
    const channel = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i += 1) {
      last = last * 0.985 + (Math.random() * 2 - 1) * 0.015;
      channel[i] = last;
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = connectVoice(context.createGain());
    source.buffer = buffer;
    source.loop = true;
    filter.type = "highpass";
    filter.frequency.value = 900 + state.openness * 20;
    gain.gain.value = 0.008 + state.openness * 0.00008;
    source.connect(filter).connect(gain);
    source.start();
    return { source, filter, gain };
  }

  function stopVoice(voice) {
    if (!voice) return;
    try { (voice.oscillator || voice.source).stop(); } catch {}
    Object.values(voice).forEach((node) => node?.disconnect?.());
  }

  function syncSustainedLayers() {
    const wantsBody = state.layers.includes("body");
    const wantsAir = state.layers.includes("air");
    if (wantsBody && !bodyVoice) bodyVoice = createBody();
    if (!wantsBody && bodyVoice) { stopVoice(bodyVoice); bodyVoice = null; }
    if (wantsAir && !airVoice) airVoice = createAir();
    if (!wantsAir && airVoice) { stopVoice(airVoice); airVoice = null; }
    if (bodyVoice) {
      bodyVoice.filter.frequency.setTargetAtTime(220 + state.openness * 11, context.currentTime, 0.04);
      bodyVoice.gain.gain.setTargetAtTime(0.018 + state.pressure * 0.00018, context.currentTime, 0.04);
    }
    if (airVoice) {
      airVoice.filter.frequency.setTargetAtTime(900 + state.openness * 20, context.currentTime, 0.04);
      airVoice.gain.gain.setTargetAtTime(0.008 + state.openness * 0.00008, context.currentTime, 0.04);
    }
  }

  function schedule() {
    const secondsPerStep = 60 / state.tempo / 4;
    while (nextStepAt < context.currentTime + 0.12) {
      const pulseMask = state.pattern === "drift" ? [1,0,0,1,0,0,1,0, 1,0,1,0,0,1,0,0] : state.pattern === "bounce" ? [1,0,1,0,0,1,0,1, 1,0,0,1,0,1,1,0] : [1,0,1,0,1,0,1,1, 1,0,1,0,1,1,0,1];
      if (state.layers.includes("pulse") && pulseMask[step]) pulse(nextStepAt, step % 8 === 0);
      if (state.layers.includes("glitch") && (step === 6 || step === 14 || (state.pattern === "drive" && step === 11))) digitalGesture(nextStepAt);
      if (step % 4 === 0) onBeat(step);
      nextStepAt += secondsPerStep;
      step = (step + 1) % 16;
    }
  }

  function setState(nextState) {
    state = { ...nextState, layers: [...nextState.layers] };
    const now = context.currentTime;
    const targetVolume = state.muted ? 0 : (state.volume / 72) * 0.34;
    master.gain.cancelScheduledValues(now);
    master.gain.setTargetAtTime(targetVolume, now, 0.025);
    wet.gain.setTargetAtTime(0.04 + state.space * 0.0032, now, 0.05);
    dry.gain.setTargetAtTime(0.96 - state.space * 0.0035, now, 0.05);
    delay.delayTime.setTargetAtTime(0.12 + state.space * 0.004, now, 0.05);
    feedback.gain.setTargetAtTime(Math.min(0.48, 0.1 + state.space * 0.0035), now, 0.05);
    syncSustainedLayers();
  }

  function start(initialState) {
    state = { ...initialState, layers: [...initialState.layers] };
    nextStepAt = context.currentTime + 0.05;
    setState(state);
    if (!timer) timer = window.setInterval(schedule, 25);
  }

  async function resume() {
    if (context.state === "suspended") await context.resume();
  }

  async function close() {
    window.clearInterval(timer);
    timer = 0;
    stopVoice(bodyVoice);
    stopVoice(airVoice);
    bodyVoice = null;
    airVoice = null;
    master.gain.value = 0;
    [input, dry, delay, feedback, wet, master, compressor, analyser].forEach((node) => node.disconnect());
    if (context.state !== "closed") await context.close();
  }

  return { analyser, context, start, setState, resume, close };
}

export function mount(root, bus) {
  destroy();
  const element = moduleRoot(root);
  if (!element) throw new Error('DUCK 04: falta [data-duck-module="04"]');

  const machine = element.querySelector("[data-duck04-machine]");
  const controls = element.querySelector("[data-duck04-controls]");
  const power = element.querySelector('[data-duck04-action="power"]');
  const mute = element.querySelector('[data-duck04-action="mute"]');
  const reset = element.querySelector('[data-duck04-action="reset"]');
  const failure = element.querySelector("[data-duck04-failure]");
  const canvas = element.querySelector("[data-duck04-scope]");
  const context2d = canvas?.getContext("2d");
  const target = eventTarget(bus);
  const removers = [];
  let audio = null;
  let frame = 0;
  let inViewport = true;
  let beat = 0;
  let state = { ...DEFAULT_STATE, layers: [...DEFAULT_STATE.layers] };
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  const required = [machine, controls, power, mute, reset, failure, canvas, context2d];
  if (required.some((item) => !item)) {
    element.dataset.moduleState = "error";
    if (failure) { failure.hidden = false; failure.textContent = "El laboratorio está incompleto: faltan controles esenciales."; }
    throw new Error("DUCK 04: artefacto incompleto");
  }

  function listen(node, type, handler, options) {
    node.addEventListener(type, handler, options);
    removers.push(() => node.removeEventListener(type, handler, options));
  }

  function emit(name, detail) {
    target.dispatchEvent(new CustomEvent(name, { detail }));
  }

  function outputState(announce = false) {
    const phrase = formatPhrase(state);
    const sonicFingerprint = fingerprint(state);
    const activeLayers = [...state.layers];
    element.querySelector("[data-duck04-phrase]").textContent = phrase;
    element.querySelector("[data-duck04-fingerprint]").textContent = sonicFingerprint;
    element.querySelector("[data-duck04-tempo]").textContent = String(state.tempo);
    element.querySelector("[data-duck04-stage]").textContent = state.processStage.toUpperCase();
    document.documentElement.dataset.duckSonicFingerprint = sonicFingerprint;
    document.documentElement.dataset.duckActiveLayers = String(activeLayers.length);
    emit("duck:sonic-output", {
      module: "04",
      owner: "Sartre",
      sonicFingerprint,
      activeLayers,
      briefingPhrase: phrase
    });
    if (announce) element.querySelector("[data-duck04-live]").textContent = `${phrase} Huella ${sonicFingerprint}.`;
  }

  function syncUI(announce = false) {
    controls.elements["duck04-pattern"].value = state.pattern;
    controls.querySelectorAll('.duck04-layers input[type="checkbox"]').forEach((input) => { input.checked = state.layers.includes(input.value); });
    ["pressure", "openness", "space", "volume"].forEach((name) => {
      controls.elements[name].value = String(state[name]);
      element.querySelector(`[data-duck04-output="${name}"]`).textContent = String(state[name]);
    });
    mute.setAttribute("aria-pressed", String(state.muted));
    mute.textContent = state.muted ? "Recuperar sonido" : "Silenciar";
    machine.dataset.state = state.powered && !state.muted ? "playing" : state.powered ? "muted" : "sleeping";
    element.querySelector("[data-duck04-core-value]").textContent = state.muted ? "MUTE" : state.powered ? `${state.tempo}` : "OFF";
    element.querySelector("[data-duck04-scope-caption]").textContent = state.powered ? `${state.layers.length} capas · ${state.pattern} · sin clipping` : "Audio en espera de un gesto";
    audio?.setState(state);
    outputState(announce);
  }

  async function powerOn() {
    try {
      if (!audio) audio = createAudioEngine((nextBeat) => { beat = nextBeat; });
      await audio.resume();
      state.powered = true;
      power.setAttribute("aria-pressed", "true");
      power.querySelector("[data-duck04-power-label]").textContent = "Laboratorio activo";
      audio.start(state);
      failure.hidden = true;
      document.documentElement.dataset.duckAudio = "active";
      syncUI(true);
    } catch (error) {
      failure.hidden = false;
      element.dataset.moduleState = "degraded";
      document.documentElement.dataset.duckAudio = "unavailable";
      element.querySelector("[data-duck04-live]").textContent = "Audio no disponible. La composición visual continúa funcionando.";
      console.error("DUCK 04 audio:", error);
    }
  }

  function processInput(event) {
    const detail = event.detail || {};
    if (Number.isFinite(Number(detail.tempoHint))) state.tempo = Math.round(clamp(detail.tempoHint, 64, 148));
    if (Number.isFinite(Number(detail.textureHint))) state.openness = Math.round(clamp(detail.textureHint, 0, 100));
    if (Number.isFinite(Number(detail.spaceHint))) state.space = Math.round(clamp(detail.spaceHint, 0, 100));
    if (typeof detail.processStage === "string" && detail.processStage.trim()) state.processStage = detail.processStage.trim().slice(0, 24);
    syncUI(true);
  }

  function draw() {
    frame = window.requestAnimationFrame(draw);
    if (!inViewport) return;
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.round(rect.width * dpr));
    const height = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
    context2d.clearRect(0, 0, width, height);
    context2d.lineWidth = Math.max(1, dpr);
    context2d.strokeStyle = state.powered ? "rgba(184,255,54,.72)" : "rgba(243,237,221,.16)";
    context2d.beginPath();
    const samples = 96;
    let waveform = null;
    if (audio && state.powered && !state.muted) {
      waveform = new Uint8Array(audio.analyser.frequencyBinCount);
      audio.analyser.getByteTimeDomainData(waveform);
    }
    for (let index = 0; index < samples; index += 1) {
      const x = (index / (samples - 1)) * width;
      const source = waveform ? waveform[Math.floor(index / samples * waveform.length)] / 128 - 1 : 0;
      const idle = reducedMotion.matches ? 0 : Math.sin(index * .31 + performance.now() * .0015 + beat) * .025;
      const y = height * (.5 + (source * .33 + idle) * (state.powered ? 1 : .22));
      if (index === 0) context2d.moveTo(x, y); else context2d.lineTo(x, y);
    }
    context2d.stroke();
  }

  listen(power, "click", powerOn);
  listen(mute, "click", () => {
    state.muted = !state.muted;
    document.documentElement.dataset.duckAudio = state.muted ? "muted" : state.powered ? "active" : "idle";
    syncUI(true);
  });
  listen(reset, "click", () => {
    const powered = state.powered;
    state = { ...DEFAULT_STATE, layers: [...DEFAULT_STATE.layers], powered };
    syncUI(true);
  });
  listen(controls, "input", (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) return;
    if (input.name === "duck04-pattern") state.pattern = input.value;
    if (["pressure", "openness", "space", "volume"].includes(input.name)) state[input.name] = Number(input.value);
    if (input.closest(".duck04-layers")) state.layers = [...controls.querySelectorAll('.duck04-layers input:checked')].map((item) => item.value);
    syncUI(false);
  });
  listen(controls, "change", () => syncUI(true));
  listen(target, "duck:process-output", processInput);

  const observer = "IntersectionObserver" in window ? new IntersectionObserver(([entry]) => { inViewport = entry.isIntersecting; }, { rootMargin: "120px" }) : null;
  observer?.observe(element);
  draw();
  document.documentElement.dataset.duckAudio = "idle";
  element.dataset.moduleState = "ready";
  syncUI(false);

  activeInstance = {
    async destroy() {
      removers.splice(0).forEach((remove) => remove());
      observer?.disconnect();
      window.cancelAnimationFrame(frame);
      delete document.documentElement.dataset.duckAudio;
      delete document.documentElement.dataset.duckSonicFingerprint;
      delete document.documentElement.dataset.duckActiveLayers;
      delete element.dataset.moduleState;
      if (audio) await audio.close();
      audio = null;
    }
  };

  return activeInstance;
}

export function destroy() {
  if (!activeInstance) return;
  const instance = activeInstance;
  activeInstance = null;
  void instance.destroy();
}
