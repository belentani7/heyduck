(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const state = {
    manualPause: false,
    inkFired: false,
    audio: null,
    oscillator: null,
    gain: null,
    filter: null,
    audioEnabled: false,
    scopeVisible: false,
    pointer: 0.5,
    activePads: new Set()
  };

  function setupMotionToggle() {
    const button = $("#motionToggle");
    if (!button) return;
    button.addEventListener("click", () => {
      state.manualPause = !state.manualPause;
      document.body.classList.toggle("motion-paused", state.manualPause);
      button.setAttribute("aria-pressed", String(state.manualPause));
      button.textContent = state.manualPause ? "Retomar movimento" : "Pausar movimento";
    });
  }

  function setupSmoothScroll() {
    if (reducedMotion || !window.Lenis) return;
    const lenis = new Lenis({ lerp: 0.075, smoothWheel: true, wheelMultiplier: 0.88 });
    lenis.on("scroll", () => window.ScrollTrigger?.update());
    function frame(time) {
      if (!state.manualPause) lenis.raf(time);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function setupScrollStory() {
    if (!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) {
      gsap.registerPlugin(CustomEase);
      CustomEase.create("duckGlide", "M0,0 C0.14,0.82 0.16,1 1,1");
      CustomEase.create("duckImpact", "M0,0 C0.6,0 0.82,0.02 1,1");
    }
    const glide = window.CustomEase ? "duckGlide" : "power3.out";
    const impact = window.CustomEase ? "duckImpact" : "power3.in";

    if (!reducedMotion) {
      gsap.timeline({ defaults: { ease: glide } })
        .from(".hero-photo", { scale: 1.16, duration: 2.2 })
        .from(".hero-vignette", { opacity: 0, duration: 1.1 }, 0)
        .from(".showcase-frame", { scale: 0.97, opacity: 0, duration: 1.35 }, 0.08)
        .from(".showcase-frame i", { scale: 0, stagger: 0.07, duration: 0.55 }, 0.25)
        .from(".gestalt-mark span", { scale: 0.3, opacity: 0, rotate: -28, stagger: 0.08, duration: 0.9 }, 0.32)
        .from(".reveal-line", { yPercent: 90, opacity: 0, stagger: 0.11, duration: 1.15 }, 0.18)
        .from(".hero-index", { opacity: 0, x: 30, duration: 0.8 }, 0.9);

      gsap.to(".hero-photo", {
        yPercent: 12,
        scale: 1.05,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.2 }
      });
      gsap.to(".gestalt-mark", { rotate: 18, yPercent: 18, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.1 } });
    }

    const shiftTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".ink-shift",
        start: "top top",
        end: "bottom bottom",
        scrub: reducedMotion ? 0 : 1.05,
        onUpdate(self) {
          const progress = self.progress;
          const bar = $(".ink-progress span");
          if (bar) bar.style.transform = `scaleY(${progress})`;
          if (progress > 0.39 && !state.inkFired) {
            state.inkFired = true;
            spawnInk(64);
          }
          if (progress < 0.25) state.inkFired = false;
        }
      }
    });

    shiftTimeline
      .fromTo(".duck-kicker", { x: "-64vw", rotate: -5 }, { x: "0vw", rotate: 0, duration: 1.15, ease: glide }, 0.02)
      .fromTo(".duck-shadow", { scaleX: 0.45, opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.7 }, 0.28)
      .to(".duck-tail", { rotate: -13, duration: 0.2, yoyo: true, repeat: 3 }, 0.45)
      .to(".duck-wing", { rotate: 10, duration: 0.22, yoyo: true, repeat: 3 }, 0.46)
      .fromTo(".paint-bucket", { y: "-36vh", rotate: -16 }, { y: "66vh", rotate: 7, duration: 1.05, ease: impact }, 0.45)
      .fromTo(".bucket-shadow", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7 }, 0.72)
      .to(".duck-character", { x: -15, scaleX: 0.96, scaleY: 1.035, transformOrigin: "bottom center", duration: 0.18 }, 1.34)
      .to(".duck-leg--kick", { rotate: 36, transformOrigin: "214px 213px", duration: 0.2, ease: impact }, 1.35)
      .to(".duck-leg--kick", { rotate: -84, duration: 0.13, ease: glide }, 1.55)
      .to(".duck-character", { x: 8, scaleX: 1.035, scaleY: 0.97, duration: 0.13 }, 1.55)
      .to(".paint-bucket", { x: "32vw", y: "79vh", rotate: 148, duration: 0.48, ease: glide }, 1.56)
      .to(".bucket-shadow", { x: "22vw", scaleX: 1.45, opacity: 0.1, duration: 0.42 }, 1.56)
      .to(".impact-word", { opacity: 1, scale: 1.07, duration: 0.08 }, 1.58)
      .fromTo(".impact-ring--one", { opacity: 0.9, scale: 0.1 }, { opacity: 0, scale: 2.8, duration: 0.45 }, 1.58)
      .fromTo(".impact-ring--two", { opacity: 0.6, scale: 0.1 }, { opacity: 0, scale: 4.1, duration: 0.62 }, 1.65)
      .to(".impact-word", { opacity: 0, scale: 1.5, rotate: 5, duration: 0.35 }, 1.72)
      .to(".duck-leg--kick", { rotate: 0, duration: 0.42, ease: glide }, 1.78)
      .to(".duck-character", { x: 0, scaleX: 1, scaleY: 1, duration: 0.35 }, 1.78)
      .to(".shift-copy--before", { opacity: 0, x: -90, filter: "blur(8px)", duration: 0.45 }, 1.58)
      .to(".green-wash", { scale: 22, duration: 1.08, ease: glide }, 1.62)
      .to(".duck-kicker", { x: "-18vw", opacity: 0.22, duration: 0.8 }, 1.9)
      .fromTo(".shift-copy--after", { opacity: 0, y: 90 }, { opacity: 1, y: 0, duration: 0.72, ease: glide }, 2.12)
      .to(".ink-residue", { opacity: 0.22, duration: 0.55 }, 2.2)
      .to(".ink-residue--one", { x: "5vw", y: "2vh", rotate: 24, duration: 0.75 }, 2.25)
      .to(".ink-residue--two", { x: "-4vw", y: "-3vh", rotate: 9, duration: 0.75 }, 2.25);

    if (!reducedMotion) {
      $$(".motion-heading").forEach(heading => {
        gsap.from(heading, { y: 90, opacity: 0, duration: 1.05, ease: glide, scrollTrigger: { trigger: heading, start: "top 84%" } });
      });
      gsap.from(".manifesto-copy > *", { y: 35, opacity: 0, stagger: 0.14, duration: 0.8, scrollTrigger: { trigger: ".manifesto-copy", start: "top 80%" } });
      const identityStrip = $(".identity-strip");
      if (identityStrip) {
        gsap.fromTo(identityStrip, { xPercent: -10 }, { xPercent: -38, ease: "none", scrollTrigger: { trigger: identityStrip, start: "top bottom", end: "bottom top", scrub: 1.2 } });
      }
      $$(".parallax-photo").forEach((figure, index) => {
        gsap.from(figure, { y: 100, opacity: 0, rotate: index ? 2 : -2, duration: 1.1, ease: glide, scrollTrigger: { trigger: figure, start: "top 88%" } });
        gsap.to($("img", figure), { yPercent: -15, ease: "none", scrollTrigger: { trigger: figure, start: "top bottom", end: "bottom top", scrub: 1.1 } });
      });
      $$(".process-item").forEach((item, index) => {
        gsap.from(item.children, { y: 38, opacity: 0, stagger: 0.06, duration: 0.75, delay: index * 0.03, scrollTrigger: { trigger: item, start: "top 88%" } });
        gsap.to($("i", item), { x: "102%", duration: 1.2, ease: glide, scrollTrigger: { trigger: item, start: "top 82%" } });
      });
      const processPath = $(".process-continuity path");
      if (processPath) {
        const length = processPath.getTotalLength();
        gsap.fromTo(processPath, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: ".process", start: "top 70%", end: "center 30%", scrub: 1 } });
      }
      gsap.from(".play-panel", { y: 100, opacity: 0, rotateX: 8, transformPerspective: 900, duration: 1.2, ease: glide, scrollTrigger: { trigger: ".play-panel", start: "top 88%" } });
    }

    const recordTrack = $(".records-track");
    if (recordTrack && !reducedMotion) {
      const distance = () => Math.max(0, recordTrack.scrollWidth - innerWidth);
      gsap.to(recordTrack, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: ".records-viewport", start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 1, invalidateOnRefresh: true }
      });
      $$(".record").forEach((card, index) => {
        gsap.from(card, { y: index % 2 ? 80 : -60, rotate: index % 2 ? 2 : -2, opacity: 0.3, scrollTrigger: { trigger: ".records-viewport", start: "top 70%", end: "top 15%", scrub: 1 } });
      });
    }

    if (!reducedMotion) {
      gsap.from(".finale-copy", { scale: 0.72, opacity: 0, scrollTrigger: { trigger: ".finale", start: "top 75%", end: "center center", scrub: 1.1 } });
      gsap.to(".closure-mark i:nth-child(1)", { rotate: 145, ease: "none", scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.to(".closure-mark i:nth-child(2)", { rotate: -180, ease: "none", scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.to(".closure-mark i:nth-child(3)", { rotate: 230, scale: 1.16, ease: "none", scrollTrigger: { trigger: ".finale", start: "top bottom", end: "bottom top", scrub: 1.2 } });
      gsap.from(".contact-content > *", { y: 60, opacity: 0, stagger: 0.12, duration: 0.9, ease: glide, scrollTrigger: { trigger: ".contact", start: "top 68%" } });
      gsap.to(".contact-bg", { yPercent: 10, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom bottom", scrub: 1.1 } });
    }
  }

  const inkDrops = [];
  let inkContext = null;

  function setupInkCanvas() {
    const canvas = $("#inkCanvas");
    if (!canvas) return;
    inkContext = canvas.getContext("2d");
    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(innerWidth * dpr);
      canvas.height = Math.round(innerHeight * dpr);
      canvas.style.width = `${innerWidth}px`;
      canvas.style.height = `${innerHeight}px`;
      inkContext.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener("resize", resize, { passive: true });
    requestAnimationFrame(drawInk);
  }

  function spawnInk(count = 48) {
    const bucket = $(".paint-bucket");
    const rect = bucket?.getBoundingClientRect();
    const originX = rect ? rect.left + rect.width * 0.45 : innerWidth * 0.64;
    const originY = rect ? rect.top + rect.height * 0.65 : innerHeight * 0.52;
    for (let index = 0; index < count; index++) {
      const angle = (-1.1 + Math.random() * 2.05);
      const speed = 5 + Math.random() * 18;
      inkDrops.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + 4,
        vy: Math.sin(angle) * speed - 4,
        radius: 4 + Math.random() * 24,
        stretch: 0.65 + Math.random() * 1.8,
        rotation: Math.random() * Math.PI,
        gravity: 0.34 + Math.random() * 0.2,
        life: 1,
        decay: 0.006 + Math.random() * 0.009,
        purple: index % 11 === 0
      });
    }
  }

  function drawInk() {
    if (inkContext && !state.manualPause) {
      inkContext.clearRect(0, 0, innerWidth, innerHeight);
      for (let index = inkDrops.length - 1; index >= 0; index--) {
        const drop = inkDrops[index];
        drop.x += drop.vx;
        drop.y += drop.vy;
        drop.vy += drop.gravity;
        drop.vx *= 0.994;
        drop.rotation += 0.025;
        drop.life -= drop.decay;
        const alpha = Math.max(0, drop.life);
        inkContext.save();
        inkContext.translate(drop.x, drop.y);
        inkContext.rotate(drop.rotation);
        inkContext.scale(drop.stretch, 1 / drop.stretch);
        inkContext.globalAlpha = alpha;
        inkContext.fillStyle = drop.purple ? "#6e35a5" : "#6bf178";
        inkContext.beginPath();
        inkContext.arc(0, 0, Math.max(1, drop.radius * (0.45 + alpha * 0.55)), 0, Math.PI * 2);
        inkContext.fill();
        inkContext.restore();
        if (drop.life <= 0 || drop.y > innerHeight + 100 || drop.x > innerWidth + 150) inkDrops.splice(index, 1);
      }
      inkContext.globalAlpha = 1;
    }
    requestAnimationFrame(drawInk);
  }

  function setupSignalToy() {
    const canvas = $("#scope");
    const toggle = $("#scopeToggle");
    const tone = $("#tone");
    const pressure = $("#pressure");
    const toneOut = $("#toneOut");
    const pressureOut = $("#pressureOut");
    const feedback = $("#feedback");
    const padRoot = $("#pads");
    if (!canvas || !toggle || !tone || !pressure || !padRoot) return;
    const context = canvas.getContext("2d");
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    tone.addEventListener("input", () => { toneOut.value = tone.value; });
    pressure.addEventListener("input", () => { pressureOut.value = pressure.value; });
    canvas.parentElement.addEventListener("pointermove", event => {
      const rect = canvas.getBoundingClientRect();
      state.pointer = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    });

    function ensureAudio() {
      if (!AudioContextClass) {
        feedback.textContent = "Este navegador não oferece Web Audio. A experiência visual continua disponível.";
        return null;
      }
      if (state.audio) return state.audio;
      state.audio = new AudioContextClass();
      state.oscillator = state.audio.createOscillator();
      state.gain = state.audio.createGain();
      state.filter = state.audio.createBiquadFilter();
      state.oscillator.type = "sawtooth";
      state.filter.type = "lowpass";
      state.gain.gain.value = 0.0001;
      state.oscillator.connect(state.filter).connect(state.gain).connect(state.audio.destination);
      state.oscillator.start();
      return state.audio;
    }

    toggle.addEventListener("click", async () => {
      const audio = ensureAudio();
      if (!audio) return;
      if (audio.state === "suspended") await audio.resume();
      state.audioEnabled = !state.audioEnabled;
      const now = audio.currentTime;
      state.gain.gain.cancelScheduledValues(now);
      state.gain.gain.setTargetAtTime(state.audioEnabled ? 0.018 + Number(pressure.value) / 4500 : 0.0001, now, 0.04);
      toggle.setAttribute("aria-pressed", String(state.audioEnabled));
      toggle.textContent = state.audioEnabled ? "Desligar sinal" : "Ligar sinal";
      feedback.textContent = state.audioEnabled ? "Sinal aberto. Move o ponteiro e procura uma tensão que respire." : "Sinal desligado. A composição visual permanece ativa.";
    });

    const padNames = ["KICK", "CLAP", "GRAIN", "AIR", "BASS", "VOICE", "ROOM", "TAPE"];
    padNames.forEach((name, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "pad";
      button.textContent = name;
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", () => {
        const audio = ensureAudio();
        if (!audio) return;
        const active = !state.activePads.has(index);
        active ? state.activePads.add(index) : state.activePads.delete(index);
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
        const oscillator = audio.createOscillator();
        const gain = audio.createGain();
        oscillator.type = index % 3 === 0 ? "sine" : index % 3 === 1 ? "triangle" : "square";
        oscillator.frequency.value = 62 + index * 42;
        gain.gain.setValueAtTime(0.07, audio.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.28);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start();
        oscillator.stop(audio.currentTime + 0.3);
        const count = state.activePads.size;
        feedback.textContent = count === 0 ? "Começa com um pad. A identidade aparece por contraste, não por excesso." : count < 4 ? `${count} camadas. Ainda existe ar entre os elementos.` : `${count} camadas. Retira uma e decide quem conduz.`;
      });
      padRoot.append(button);
    });

    new IntersectionObserver(entries => { state.scopeVisible = entries[0].isIntersecting; }, { threshold: 0.05 }).observe(canvas);

    function drawScope(time) {
      if (state.scopeVisible && !state.manualPause) {
        const dpr = Math.min(devicePixelRatio || 1, 2);
        const width = Math.round(canvas.clientWidth * dpr);
        const height = Math.round(canvas.clientHeight * dpr);
        if (canvas.width !== width || canvas.height !== height) { canvas.width = width; canvas.height = height; }
        context.clearRect(0, 0, width, height);
        context.save();
        context.scale(dpr, dpr);
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        const pressureValue = Number(pressure.value);
        const toneValue = Number(tone.value);
        const layers = state.activePads.size;
        const glow = 10 + pressureValue * 0.17;
        context.strokeStyle = "#6bf178";
        context.lineWidth = 1.5 + pressureValue / 70;
        context.shadowColor = "#6bf178";
        context.shadowBlur = glow;
        context.beginPath();
        for (let x = 0; x <= w; x += 2) {
          const phase = x / w * (7 + toneValue / 16);
          const amplitude = h * (0.055 + pressureValue / 800);
          const detail = Math.sin(phase * (8 + layers) - time * 0.0022) * h * (0.012 + layers * 0.003);
          const y = h * 0.56 + Math.sin(phase * 3.7 + time * 0.0033) * amplitude + detail;
          x ? context.lineTo(x, y) : context.moveTo(x, y);
        }
        context.stroke();
        context.shadowBlur = 0;
        context.globalAlpha = 0.18;
        context.strokeStyle = "#6e35a5";
        context.beginPath();
        for (let x = 0; x <= w; x += 3) {
          const y = h * 0.57 + Math.cos(x / w * 27 - time * 0.0016) * h * 0.035;
          x ? context.lineTo(x, y) : context.moveTo(x, y);
        }
        context.stroke();
        context.restore();

        if (state.audio && state.filter && state.oscillator && state.gain) {
          state.filter.frequency.setTargetAtTime(300 + toneValue * 48, state.audio.currentTime, 0.035);
          state.oscillator.frequency.setTargetAtTime(72 + (1 - state.pointer) * 260, state.audio.currentTime, 0.035);
          if (state.audioEnabled) state.gain.gain.setTargetAtTime(0.018 + pressureValue / 4500, state.audio.currentTime, 0.05);
        }
      }
      requestAnimationFrame(drawScope);
    }
    requestAnimationFrame(drawScope);
  }

  function setupShader() {
    const canvas = $("#shaderCanvas");
    if (!canvas || !window.THREE) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: false, antialias: false, powerPreference: "high-performance" });
    } catch {
      canvas.style.background = "radial-gradient(circle at 55% 45%,#6e35a5,#173c22 42%,#080c09 75%)";
      return;
    }
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2() },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uScroll: { value: 0 }
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: "void main(){gl_Position=vec4(position,1.0);}",
      fragmentShader: `
        precision highp float;
        uniform float uTime;
        uniform float uScroll;
        uniform vec2 uResolution;
        uniform vec2 uPointer;
        float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453123);}
        float noise(vec2 p){vec2 i=floor(p);vec2 f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
        float fbm(vec2 p){float v=0.;float a=.5;mat2 r=mat2(.8,-.6,.6,.8);for(int i=0;i<6;i++){v+=a*noise(p);p=r*p*2.03+8.1;a*=.5;}return v;}
        void main(){
          vec2 uv=gl_FragCoord.xy/uResolution.xy;
          vec2 p=(gl_FragCoord.xy-.5*uResolution.xy)/min(uResolution.x,uResolution.y);
          float t=uTime*.095;
          vec2 warp=vec2(fbm(p*2.2+t),fbm(p*2.2-t+4.7));
          float field=fbm(p*3.1+warp*1.65+vec2(t,-t*.72));
          float vein=smoothstep(.42,.78,field+.12*sin((p.x+p.y)*8.+t*2.));
          float pointerGlow=.16/max(.12,distance(uv,uPointer));
          vec3 black=vec3(.031,.047,.035);
          vec3 green=vec3(.106,.235,.133);
          vec3 acid=vec3(.42,.945,.47);
          vec3 purple=vec3(.431,.208,.647);
          vec3 color=mix(black,green,smoothstep(.2,.8,field));
          color=mix(color,acid,vein*.42);
          float residue=smoothstep(.58,.82,fbm(p*4.6-warp*1.2+6.));
          color=mix(color,purple,residue*(.22+.18*sin(t+uScroll*3.)));
          color+=pointerGlow*mix(acid,purple,uv.y)*.055;
          color*=.72+.34*smoothstep(1.1,.15,length(p));
          gl_FragColor=vec4(color,1.);
        }`
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    let visible = false;
    const pointerTarget = new THREE.Vector2(0.5, 0.5);
    const finale = $(".finale");
    finale.addEventListener("pointermove", event => {
      const rect = finale.getBoundingClientRect();
      pointerTarget.set((event.clientX - rect.left) / rect.width, 1 - (event.clientY - rect.top) / rect.height);
    });
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: 0.02 }).observe(finale);
    function resize() {
      const width = finale.clientWidth;
      const height = finale.clientHeight;
      renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
      renderer.setSize(width, height, false);
      uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height);
    }
    resize();
    addEventListener("resize", resize, { passive: true });
    function render(time) {
      if (visible && !state.manualPause) {
        uniforms.uTime.value = reducedMotion ? 0 : time * 0.001;
        uniforms.uPointer.value.lerp(pointerTarget, 0.07);
        const rect = finale.getBoundingClientRect();
        uniforms.uScroll.value = Math.max(0, Math.min(1, -rect.top / Math.max(1, rect.height - innerHeight)));
        renderer.render(scene, camera);
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
  }

  function setupContinuityRail() {
    const rail = $(".continuity-rail");
    if (!rail) return;
    let scheduled = false;
    function update() {
      scheduled = false;
      const maximum = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      rail.style.setProperty("--page-progress", Math.max(0, Math.min(1, scrollY / maximum)).toFixed(4));
    }
    function requestUpdate() {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }
    update();
    addEventListener("scroll", requestUpdate, { passive: true });
    addEventListener("resize", requestUpdate, { passive: true });
  }

  setupMotionToggle();
  setupContinuityRail();
  setupSmoothScroll();
  setupInkCanvas();
  setupScrollStory();
  setupSignalToy();
  setupShader();
})();
