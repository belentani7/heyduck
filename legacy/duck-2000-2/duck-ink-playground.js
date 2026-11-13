(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = { audio: null, master: null, filter: null, playing: false, step: 0, timer: 0, bpm: 104, gains: [0.8, 0.62, 0.38, 0.3] };

  function setupSmoothScroll() {
    if (!window.Lenis || reducedMotion) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", () => window.ScrollTrigger?.update());
    const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }

  function setupScrollStory() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) {
      gsap.registerPlugin(window.CustomEase);
      window.CustomEase.create("duckInk", "M0,0 C0.16,0.72 0.12,1 1,1");
    }
    const inkEase = window.CustomEase ? "duckInk" : "power3.out";
    gsap.from(".hero-copy>*", { y: 50, opacity: 0, stagger: 0.1, duration: 1.2, ease: inkEase });
    gsap.from(".hero-mark", { rotate: 8, scale: 0.8, opacity: 0, duration: 1.4, ease: inkEase });

    const shift = gsap.timeline({
      scrollTrigger: { trigger: ".ink-shift", start: "top top", end: "bottom bottom", scrub: 1.2 }
    });
    shift
      .fromTo(".paint-bucket", { y: "-55vh", rotate: -12 }, { y: "36vh", rotate: 8, duration: 1.2, ease: "power2.in" })
      .to(".duck-leg--kick", { rotate: -72, transformOrigin: "185px 181px", duration: 0.25, ease: "power3.in" })
      .to(".paint-bucket", { x: "25vw", y: "48vh", rotate: 118, duration: 0.42, ease: "power3.out" }, "<")
      .to(".impact-word", { opacity: 1, scale: 1.08, duration: 0.12 }, "<.08")
      .to(".impact-word", { opacity: 0, scale: 1.35, duration: 0.35 })
      .to(".duck-leg--kick", { rotate: 0, duration: 0.3 })
      .to(".shift-copy--before", { opacity: 0, x: -80, duration: 0.35 }, "<")
      .to("body", { backgroundColor: "#172b20", duration: 0.7 }, "<")
      .to(".ink-shift", { backgroundColor: "#b7cc49", color: "#09130d", duration: 0.7 }, "<")
      .to(".shift-copy--after", { opacity: 1, y: -25, duration: 0.55 }, "<.1");

    $$(".story-steps article").forEach((card, index) => {
      gsap.from(card, { y: 70, opacity: 0, duration: 0.9, delay: index * 0.08, scrollTrigger: { trigger: card, start: "top 85%" } });
    });
    const track = $(".singles-track");
    if (track) {
      const distance = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: () => -distance(), ease: "none", scrollTrigger: { trigger: ".singles-viewport", start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true } });
    }
    gsap.from(".finale-copy", { scale: 0.7, opacity: 0, scrollTrigger: { trigger: ".finale", start: "top 65%", end: "center center", scrub: 1 } });
  }

  function setupInk() {
    const canvas = $("#inkCanvas");
    const ctx = canvas.getContext("2d");
    const drops = [];
    const resize = () => { canvas.width = innerWidth * devicePixelRatio; canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0); };
    resize(); addEventListener("resize", resize);
    const spawn = (count = 16) => {
      for (let i = 0; i < count; i++) drops.push({ x: innerWidth * (0.62 + Math.random() * 0.18), y: innerHeight * (0.25 + Math.random() * 0.28), vx: (Math.random() - .15) * 12, vy: Math.random() * 7 + 5, r: Math.random() * 20 + 5, life: 1 });
    };
    let fired = false;
    addEventListener("scroll", () => {
      const rect = $("#inkShift").getBoundingClientRect();
      const progress = -rect.top / Math.max(1, rect.height - innerHeight);
      if (progress > .34 && !fired) { fired = true; spawn(42); }
      if (progress < .22) fired = false;
    }, { passive: true });
    function frame() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      ctx.fillStyle = "#b7cc49";
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.x += d.vx; d.y += d.vy; d.vy += .38; d.r *= .992; d.life -= .012;
        ctx.globalAlpha = Math.max(0, d.life); ctx.beginPath(); ctx.arc(d.x, d.y, Math.max(1, d.r), 0, Math.PI * 2); ctx.fill();
        if (d.life <= 0 || d.y > innerHeight + 50) drops.splice(i, 1);
      }
      ctx.globalAlpha = 1; requestAnimationFrame(frame);
    }
    frame();
  }

  function ensureAudio() {
    if (state.audio) return state.audio;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    state.audio = new AudioContext();
    state.master = state.audio.createGain(); state.master.gain.value = .48;
    state.filter = state.audio.createBiquadFilter(); state.filter.type = "lowpass"; state.filter.frequency.value = 2200;
    state.filter.connect(state.master).connect(state.audio.destination);
    $("#soundState").setAttribute("aria-pressed", "true"); $("#soundState span:last-child").textContent = "Som ligado";
    return state.audio;
  }

  const rows = ["Kick", "Clap", "Hat", "Texture"];
  const patterns = [new Set([0, 8]), new Set([4, 12]), new Set([2, 6, 10, 14]), new Set()];
  function buildSequencer() {
    const root = $("#sequencer");
    rows.forEach((name, row) => {
      const label = document.createElement("span"); label.className = "track-name"; label.textContent = name; root.append(label);
      for (let step = 0; step < 16; step++) {
        const button = document.createElement("button"); button.type = "button"; button.className = "step"; button.dataset.row = row; button.dataset.step = step; button.setAttribute("aria-label", `${name}, passo ${step + 1}`);
        button.classList.toggle("active", patterns[row].has(step));
        button.addEventListener("click", () => { ensureAudio(); patterns[row].has(step) ? patterns[row].delete(step) : patterns[row].add(step); button.classList.toggle("active"); updateRhythmFeedback(); });
        root.append(button);
      }
    });
  }
  function hit(row, time) {
    const ctx = ensureAudio(); if (!ctx) return;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(state.gains[row] * .45, time); gain.gain.exponentialRampToValueAtTime(.001, time + (row === 0 ? .32 : .12));
    if (row === 0) { const osc = ctx.createOscillator(); osc.frequency.setValueAtTime(145, time); osc.frequency.exponentialRampToValueAtTime(46, time + .14); osc.connect(gain).connect(state.filter); osc.start(time); osc.stop(time + .33); }
    else { const length = ctx.sampleRate * .15, buffer = ctx.createBuffer(1, length, ctx.sampleRate), data = buffer.getChannelData(0); for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1; const noise = ctx.createBufferSource(); noise.buffer = buffer; const color = ctx.createBiquadFilter(); color.type = row === 2 ? "highpass" : "bandpass"; color.frequency.value = row === 2 ? 6200 : row === 1 ? 1600 : 600; noise.connect(color).connect(gain).connect(state.filter); noise.start(time); }
  }
  function tick() {
    $$(".step").forEach(step => step.classList.toggle("playing", Number(step.dataset.step) === state.step));
    patterns.forEach((pattern, row) => { if (pattern.has(state.step)) hit(row, state.audio.currentTime); });
    state.step = (state.step + 1) % 16;
  }
  function schedule() { clearInterval(state.timer); state.timer = setInterval(tick, 60000 / state.bpm / 4); }
  function updateRhythmFeedback() { const count = patterns.reduce((sum, set) => sum + set.size, 0); $("#rhythmFeedback").textContent = count < 5 ? "Há espaço. Acrescenta uma resposta ao kick." : count < 14 ? "O groove respira. Experimenta retirar um passo antes de adicionar outro." : "A grelha está densa. Silêncio também é produção."; }

  function setupTransport() {
    $("#playBeat").addEventListener("click", () => { ensureAudio()?.resume(); state.playing = !state.playing; $("#playBeat").textContent = state.playing ? "■ Parar" : "▶ Iniciar"; if (state.playing) { tick(); schedule(); } else { clearInterval(state.timer); $$(".step").forEach(s => s.classList.remove("playing")); } });
    $("#bpm").addEventListener("input", event => { state.bpm = Number(event.target.value); $("#bpmValue").textContent = state.bpm; if (state.playing) schedule(); });
    $("#clearBeat").addEventListener("click", () => { patterns.forEach(set => set.clear()); $$(".step").forEach(s => s.classList.remove("active")); updateRhythmFeedback(); });
    $("#soundState").addEventListener("click", () => { const ctx = ensureAudio(); if (!ctx) return; const on = $("#soundState").getAttribute("aria-pressed") === "true"; if (on) { ctx.suspend(); $("#soundState").setAttribute("aria-pressed", "false"); $("#soundState span:last-child").textContent = "Som desligado"; } else { ctx.resume(); $("#soundState").setAttribute("aria-pressed", "true"); $("#soundState span:last-child").textContent = "Som ligado"; } });
  }

  const notes = [{ n: "C4", f: 261.63, key: "A" }, { n: "C#4", f: 277.18, key: "W", black: true }, { n: "D4", f: 293.66, key: "S" }, { n: "D#4", f: 311.13, key: "E", black: true }, { n: "E4", f: 329.63, key: "D" }, { n: "F4", f: 349.23, key: "F" }, { n: "F#4", f: 369.99, key: "T", black: true }, { n: "G4", f: 392, key: "G" }, { n: "G#4", f: 415.3, key: "Y", black: true }, { n: "A4", f: 440, key: "H" }, { n: "A#4", f: 466.16, key: "U", black: true }, { n: "B4", f: 493.88, key: "J" }, { n: "C5", f: 523.25, key: "K" }];
  function playNote(note, key) { const ctx = ensureAudio(); if (!ctx) return; const osc = ctx.createOscillator(), gain = ctx.createGain(), now = ctx.currentTime, release = Number($("#release").value) / 100; osc.type = $("#waveform").value; osc.frequency.value = note.f; state.filter.frequency.setTargetAtTime(Number($("#filter").value), now, .03); gain.gain.setValueAtTime(.001, now); gain.gain.exponentialRampToValueAtTime(.18, now + .025); gain.gain.exponentialRampToValueAtTime(.001, now + .12 + release); osc.connect(gain).connect(state.filter); osc.start(now); osc.stop(now + .2 + release); key.classList.add("pressed"); setTimeout(() => key.classList.remove("pressed"), 150); $("#synthFeedback").textContent = `${note.n}: ${$("#waveform").selectedOptions[0].text.toLowerCase()}, filtro em ${$("#filter").value} Hz.`; }
  function buildKeyboard() { const root = $("#keyboard"); notes.forEach(note => { const key = document.createElement("button"); key.type = "button"; key.className = `key${note.black ? " black" : ""}`; key.dataset.key = note.key; key.setAttribute("aria-label", `Tocar nota ${note.n}`); key.addEventListener("pointerdown", () => playNote(note, key)); root.append(key); }); addEventListener("keydown", event => { if (event.repeat) return; const index = notes.findIndex(note => note.key === event.key.toUpperCase()); if (index >= 0) playNote(notes[index], root.children[index]); }); }

  function buildMixer() { const root = $("#mixerChannels"); rows.forEach((name, index) => { const channel = document.createElement("div"); channel.className = "channel"; channel.innerHTML = `<label for="gain${index}">${name}</label><input id="gain${index}" type="range" min="0" max="100" value="${Math.round(state.gains[index] * 100)}" aria-label="Volume de ${name}"><output>${Math.round(state.gains[index] * 100)}</output>`; const input = $("input", channel), output = $("output", channel); input.addEventListener("input", () => { state.gains[index] = Number(input.value) / 100; output.textContent = input.value; const total = state.gains.reduce((sum, value) => sum + value, 0) / 4; $("#masterMeter").style.width = `${Math.min(100, total * 105)}%`; $("#mixFeedback").textContent = total > .8 ? "A soma está no vermelho. Reduz duas pistas para recuperar profundidade." : total < .35 ? "Muito espaço, pouca presença. Escolhe uma pista protagonista." : "Boa margem. A hierarquia está legível."; }); root.append(channel); }); }

  function setupPreviews() { const audio = $("#previewAudio"); $$(".preview").forEach(button => button.addEventListener("click", () => { $$(".preview").forEach(b => { b.classList.remove("playing"); b.textContent = "Ouvir preview"; }); if (audio.src === button.dataset.preview && !audio.paused) { audio.pause(); return; } audio.src = button.dataset.preview; audio.play().then(() => { button.classList.add("playing"); button.textContent = "Pausar preview"; }).catch(() => { button.textContent = "Preview indisponível"; }); })); audio.addEventListener("ended", () => $$(".preview").forEach(b => { b.classList.remove("playing"); b.textContent = "Ouvir preview"; })); }

  function setupShader() {
    const canvas = $("#shaderCanvas"), gl = canvas.getContext("webgl", { alpha: false, antialias: false }); if (!gl) return;
    const vertex = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
    const fragment = `precision highp float;uniform vec2 r;uniform float t;void main(){vec2 uv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);float d=length(uv);float a=atan(uv.y,uv.x);float waves=sin(d*18.-t*1.4+sin(a*5.+t*.3)*2.);float spill=smoothstep(.03,.0,abs(waves)*.055+d-.72);vec3 green=vec3(.035,.075,.05);vec3 acid=vec3(.55,.72,.18);vec3 purple=vec3(.18,.055,.28);float residue=smoothstep(.82,.2,d)*smoothstep(.76,.82,d+sin(a*7.+t)*.06);vec3 col=mix(green,acid,spill*.34);col=mix(col,purple,residue*.18+pow(max(0.,sin(a*9.+d*13.-t)),18.)*.28);gl_FragColor=vec4(col,1.);}`;
    const compile = (type, source) => { const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader); return shader; };
    const program = gl.createProgram(); gl.attachShader(program, compile(gl.VERTEX_SHADER, vertex)); gl.attachShader(program, compile(gl.FRAGMENT_SHADER, fragment)); gl.linkProgram(program); gl.useProgram(program);
    const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW); const position = gl.getAttribLocation(program, "p"); gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0); const resolution = gl.getUniformLocation(program, "r"), time = gl.getUniformLocation(program, "t");
    function render(ms) { const scale = Math.min(devicePixelRatio, 1.5); const width = canvas.clientWidth * scale, height = canvas.clientHeight * scale; if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; gl.viewport(0, 0, width, height); } gl.uniform2f(resolution, width, height); gl.uniform1f(time, ms * .001); gl.drawArrays(gl.TRIANGLES, 0, 6); requestAnimationFrame(render); } requestAnimationFrame(render);
  }

  document.addEventListener("DOMContentLoaded", () => { setupSmoothScroll(); setupScrollStory(); setupInk(); buildSequencer(); setupTransport(); buildKeyboard(); buildMixer(); setupPreviews(); setupShader(); $$(".single-card").forEach(card => card.style.setProperty("--tone", card.dataset.tone)); });
})();
