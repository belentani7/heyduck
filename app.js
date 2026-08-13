(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const select = (selector, scope = document) => scope.querySelector(selector);
  const selectAll = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  class ScopeRenderer {
    constructor(canvases) {
      this.canvases = canvases.filter(Boolean);
      this.contexts = this.canvases.map((canvas) => canvas.getContext("2d"));
      this.analyser = null;
      this.waveform = null;
      this.frame = 0;
      this.startedAt = performance.now();
      this.visible = !document.hidden;
      this.handleResize = () => {
        this.canvases.forEach((canvas) => this.fit(canvas));
        this.draw(performance.now());
      };
      if ("ResizeObserver" in window) {
        this.resizeObserver = new ResizeObserver((entries) => {
          entries.forEach(({ target }) => this.fit(target));
          this.draw(performance.now());
        });
        this.canvases.forEach((canvas) => this.resizeObserver.observe(canvas));
      } else {
        this.resizeObserver = null;
        window.addEventListener("resize", this.handleResize, { passive: true });
        this.handleResize();
      }
      document.addEventListener("visibilitychange", () => {
        this.visible = !document.hidden;
        if (this.visible) this.start();
      });
      this.start();
    }

    fit(canvas) {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width * ratio));
      const height = Math.max(1, Math.round(rect.height * ratio));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    }

    connect(analyser) {
      this.analyser = analyser;
      this.waveform = new Uint8Array(analyser.fftSize);
      this.start();
    }

    start() {
      if (this.frame || !this.visible) return;
      const tick = (time) => {
        this.frame = 0;
        this.draw(time);
        if (this.visible && !reducedMotion.matches) this.frame = requestAnimationFrame(tick);
      };
      this.frame = requestAnimationFrame(tick);
    }

    draw(time) {
      if (this.analyser && this.waveform) this.analyser.getByteTimeDomainData(this.waveform);
      this.contexts.forEach((context, index) => {
        const canvas = this.canvases[index];
        if (!context || !canvas.width || !canvas.height) return;
        const { width, height } = canvas;
        context.clearRect(0, 0, width, height);
        context.fillStyle = index === 0 ? "rgba(9, 12, 7, .22)" : "#080a07";
        context.fillRect(0, 0, width, height);
        context.strokeStyle = "rgba(200, 255, 53, .1)";
        context.lineWidth = 1;
        for (let x = 0; x <= width; x += width / 8) {
          context.beginPath();
          context.moveTo(x, 0);
          context.lineTo(x, height);
          context.stroke();
        }
        for (let y = 0; y <= height; y += height / 4) {
          context.beginPath();
          context.moveTo(0, y);
          context.lineTo(width, y);
          context.stroke();
        }
        context.beginPath();
        context.strokeStyle = "#c8ff35";
        context.lineWidth = Math.max(1.5, width / 500);
        context.shadowBlur = 14;
        context.shadowColor = "rgba(200, 255, 53, .55)";
        const points = this.waveform?.length || 180;
        for (let point = 0; point < points; point += 1) {
          const x = (point / (points - 1)) * width;
          let normalized;
          if (this.waveform) {
            normalized = (this.waveform[point] - 128) / 128;
          } else {
            const elapsed = (time - this.startedAt) / 1000;
            normalized = Math.sin(point * 0.14 + elapsed * 2.2) * 0.1;
            normalized += Math.sin(point * 0.037 - elapsed) * 0.035;
          }
          const y = height * 0.5 + normalized * height * 0.34;
          if (point === 0) context.moveTo(x, y);
          else context.lineTo(x, y);
        }
        context.stroke();
        context.shadowBlur = 0;
      });
    }

    destroy() {
      cancelAnimationFrame(this.frame);
      this.resizeObserver?.disconnect();
      window.removeEventListener("resize", this.handleResize);
    }
  }

  class DuckStudio {
    constructor(scopeRenderer) {
      this.scopeRenderer = scopeRenderer;
      this.context = null;
      this.masterInput = null;
      this.toneFilter = null;
      this.delay = null;
      this.delayFeedback = null;
      this.delayWet = null;
      this.compressor = null;
      this.output = null;
      this.analyser = null;
      this.streamDestination = null;
      this.noiseBuffer = null;
      this.mediaRecorder = null;
      this.recordingChunks = [];
      this.recordingUrl = "";
      this.schedulerTimer = 0;
      this.uiTimers = new Set();
      this.playing = false;
      this.currentStep = 0;
      this.nextNoteTime = 0;
      this.bpm = 128;
      this.swing = 0.12;
      this.volume = 0.72;
      this.attack = 0.08;
      this.release = 0.58;
      this.xy = { x: 0.5, y: 0.5 };
      this.channels = ["kick", "snare", "hat"];
      this.pattern = this.clonePattern(DuckStudio.patterns.trap);
      this.keyboardNotes = [
        ["C3", 130.81, "A"], ["C#3", 138.59, "W"], ["D3", 146.83, "S"],
        ["D#3", 155.56, "E"], ["E3", 164.81, "D"], ["F3", 174.61, "F"],
        ["F#3", 185.00, "T"], ["G3", 196.00, "G"], ["G#3", 207.65, "Y"],
        ["A3", 220.00, "H"], ["A#3", 233.08, "U"], ["B3", 246.94, "J"]
      ];
      this.keyMap = new Map(this.keyboardNotes.map((note) => [`Key${note[2]}`, note]));
    }

    static patterns = {
      trap: {
        kick: [1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        hat: [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0]
      },
      soul: {
        kick: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        hat: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1]
      },
      broken: {
        kick: [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0],
        snare: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0],
        hat: [1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1]
      },
      clear: {
        kick: Array(16).fill(0),
        snare: Array(16).fill(0),
        hat: Array(16).fill(0)
      }
    };

    clonePattern(pattern) {
      return Object.fromEntries(Object.entries(pattern).map(([channel, steps]) => [channel, [...steps]]));
    }

    mount() {
      this.status = select("[data-status]");
      this.engineState = select("[data-engine-state]");
      this.stepDisplay = select("[data-step-display]");
      this.noteDisplay = select("[data-note-display]");
      this.recordButton = select("[data-record]");
      this.downloadLink = select("[data-download]");
      this.buildSequencer();
      this.buildKeyboard();
      this.bindTransport();
      this.bindPatterns();
      this.bindControls();
      this.bindXYPad();
      this.bindRecording();
      this.bindComputerKeyboard();
      this.applyXY();
      if (!("MediaRecorder" in window)) {
        this.recordButton.disabled = true;
        this.recordButton.title = "MediaRecorder não está disponível neste navegador";
      }
    }

    buildSequencer() {
      const sequencer = select("[data-sequencer]");
      const names = { kick: "Kick", snare: "Snare", hat: "Hi-hat" };
      this.channels.forEach((channel, rowIndex) => {
        const row = document.createElement("div");
        row.className = "sequence-row";
        const label = document.createElement("span");
        label.className = "sequence-label";
        label.textContent = names[channel];
        row.append(label);
        for (let step = 0; step < 16; step += 1) {
          const button = document.createElement("button");
          button.type = "button";
          button.className = "step-button";
          button.dataset.channel = channel;
          button.dataset.step = String(step);
          button.setAttribute("aria-label", `${names[channel]}, passo ${step + 1}`);
          button.setAttribute("aria-pressed", String(Boolean(this.pattern[channel][step])));
          button.addEventListener("click", () => this.toggleStep(button));
          button.addEventListener("keydown", (event) => this.moveStepFocus(event, rowIndex, step));
          row.append(button);
        }
        sequencer.append(row);
      });
    }

    buildKeyboard() {
      const keyboard = select("[data-keyboard]");
      this.keyboardNotes.forEach(([label, frequency, key]) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = `piano-key${label.includes("#") ? " is-sharp" : ""}`;
        button.dataset.note = label;
        button.dataset.frequency = String(frequency);
        button.innerHTML = `<span>${label}</span><small>${key}</small>`;
        button.setAttribute("aria-label", `Tocar nota ${label}; tecla ${key}`);
        button.addEventListener("click", async () => {
          await this.ensureAudio();
          this.playNote(frequency, label);
          this.flashKey(label);
        });
        keyboard.append(button);
      });
    }

    bindTransport() {
      select("[data-transport='start']").addEventListener("click", () => this.start());
      select("[data-transport='stop']").addEventListener("click", () => this.stop());
    }

    bindPatterns() {
      selectAll("[data-pattern]").forEach((button) => {
        button.addEventListener("click", () => {
          const name = button.dataset.pattern;
          this.pattern = this.clonePattern(DuckStudio.patterns[name]);
          this.refreshSteps();
          selectAll("[data-pattern]").forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
          this.announce(name === "clear" ? "Sequenciador limpo." : `Padrão ${button.textContent.trim()} carregado.`);
        });
      });
    }

    bindControls() {
      this.bindRange("[data-bpm]", (value, input) => {
        this.bpm = Number(value);
        input.nextElementSibling.value = String(this.bpm);
        input.nextElementSibling.textContent = String(this.bpm);
        select("[data-bpm-display]").textContent = `${this.bpm} BPM`;
      });
      this.bindRange("[data-swing]", (value, input) => {
        this.swing = Number(value) / 100;
        input.nextElementSibling.value = `${value}%`;
        input.nextElementSibling.textContent = `${value}%`;
      });
      this.bindRange("[data-volume]", (value, input) => {
        this.volume = Number(value) / 100;
        if (this.output && this.context) this.output.gain.setTargetAtTime(this.volume, this.context.currentTime, 0.02);
        input.nextElementSibling.value = `${value}%`;
        input.nextElementSibling.textContent = `${value}%`;
      });
      this.bindRange("[data-attack]", (value, input) => {
        this.attack = Number(value) / 100;
        const label = `${this.attack.toFixed(2)}s`;
        input.nextElementSibling.value = label;
        input.nextElementSibling.textContent = label;
      });
      this.bindRange("[data-release]", (value, input) => {
        this.release = Number(value) / 100;
        const label = `${this.release.toFixed(2)}s`;
        input.nextElementSibling.value = label;
        input.nextElementSibling.textContent = label;
      });
    }

    bindRange(selector, handler) {
      const input = select(selector);
      input.addEventListener("input", () => handler(input.value, input));
      handler(input.value, input);
    }

    bindXYPad() {
      const pad = select("[data-xy-pad]");
      let dragging = false;
      const updateFromPointer = (event) => {
        const rect = pad.getBoundingClientRect();
        this.xy.x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
        this.xy.y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
        this.applyXY();
      };
      pad.addEventListener("pointerdown", (event) => {
        dragging = true;
        pad.setPointerCapture(event.pointerId);
        updateFromPointer(event);
      });
      pad.addEventListener("pointermove", (event) => {
        if (dragging) updateFromPointer(event);
      });
      const endPointer = () => { dragging = false; };
      pad.addEventListener("pointerup", endPointer);
      pad.addEventListener("pointercancel", endPointer);
      pad.addEventListener("keydown", (event) => {
        const increment = event.shiftKey ? 0.1 : 0.04;
        if (event.key === "ArrowLeft") this.xy.x -= increment;
        else if (event.key === "ArrowRight") this.xy.x += increment;
        else if (event.key === "ArrowUp") this.xy.y -= increment;
        else if (event.key === "ArrowDown") this.xy.y += increment;
        else if (event.key === "Home") this.xy = { x: 0, y: 1 };
        else if (event.key === "End") this.xy = { x: 1, y: 0 };
        else return;
        event.preventDefault();
        this.xy.x = clamp(this.xy.x, 0, 1);
        this.xy.y = clamp(this.xy.y, 0, 1);
        this.applyXY();
      });
    }

    bindRecording() {
      this.recordButton.addEventListener("click", async () => {
        await this.ensureAudio();
        if (!this.mediaRecorder || this.mediaRecorder.state === "inactive") this.startRecording();
        else this.mediaRecorder.stop();
      });
    }

    bindComputerKeyboard() {
      document.addEventListener("keydown", async (event) => {
        if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
        if (event.target.closest("input, textarea, select, button, a, [contenteditable='true']")) return;
        const note = this.keyMap.get(event.code);
        if (!note) return;
        event.preventDefault();
        await this.ensureAudio();
        this.playNote(note[1], note[0]);
        this.flashKey(note[0]);
      });
    }

    async ensureAudio() {
      if (!this.context) this.createAudioGraph();
      if (this.context.state === "suspended") await this.context.resume();
      this.engineState.textContent = "ONLINE";
      this.engineState.dataset.engineState = "ONLINE";
      return this.context;
    }

    createAudioGraph() {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        this.announce("Web Audio não está disponível neste navegador.");
        throw new Error("Web Audio API unavailable");
      }
      this.context = new AudioContextClass();
      this.masterInput = this.context.createGain();
      this.toneFilter = this.context.createBiquadFilter();
      this.toneFilter.type = "lowpass";
      this.toneFilter.Q.value = 3.5;
      this.delay = this.context.createDelay(1);
      this.delay.delayTime.value = 0.24;
      this.delayFeedback = this.context.createGain();
      this.delayFeedback.gain.value = 0.28;
      this.delayWet = this.context.createGain();
      this.compressor = this.context.createDynamicsCompressor();
      this.compressor.threshold.value = -18;
      this.compressor.knee.value = 18;
      this.compressor.ratio.value = 5;
      this.output = this.context.createGain();
      this.output.gain.value = this.volume;
      this.analyser = this.context.createAnalyser();
      this.analyser.fftSize = 1024;
      this.analyser.smoothingTimeConstant = 0.78;
      this.streamDestination = this.context.createMediaStreamDestination();
      this.masterInput.connect(this.toneFilter);
      this.toneFilter.connect(this.compressor);
      this.toneFilter.connect(this.delay);
      this.delay.connect(this.delayFeedback);
      this.delayFeedback.connect(this.delay);
      this.delay.connect(this.delayWet);
      this.delayWet.connect(this.compressor);
      this.compressor.connect(this.output);
      this.output.connect(this.analyser);
      this.analyser.connect(this.context.destination);
      this.analyser.connect(this.streamDestination);
      this.noiseBuffer = this.createNoiseBuffer();
      this.applyXY();
      this.scopeRenderer.connect(this.analyser);
      this.setupRecorder();
    }

    createNoiseBuffer() {
      const length = this.context.sampleRate;
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < length; index += 1) data[index] = Math.random() * 2 - 1;
      return buffer;
    }

    setupRecorder() {
      if (!("MediaRecorder" in window) || !this.streamDestination) return;
      const preferred = ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus"]
        .find((type) => MediaRecorder.isTypeSupported(type));
      this.mediaRecorder = preferred
        ? new MediaRecorder(this.streamDestination.stream, { mimeType: preferred })
        : new MediaRecorder(this.streamDestination.stream);
      this.mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size) this.recordingChunks.push(event.data);
      });
      this.mediaRecorder.addEventListener("stop", () => this.finishRecording());
    }

    startRecording() {
      if (!this.mediaRecorder) {
        this.announce("Gravação não suportada neste navegador.");
        return;
      }
      this.recordingChunks = [];
      this.mediaRecorder.start();
      this.recordButton.setAttribute("aria-pressed", "true");
      this.recordButton.lastChild.textContent = " Parar take";
      this.downloadLink.hidden = true;
      this.announce("Gravação iniciada. O áudio permanece local no navegador.");
    }

    finishRecording() {
      const type = this.mediaRecorder.mimeType || "audio/webm";
      const blob = new Blob(this.recordingChunks, { type });
      if (this.recordingUrl) URL.revokeObjectURL(this.recordingUrl);
      this.recordingUrl = URL.createObjectURL(blob);
      this.downloadLink.href = this.recordingUrl;
      const extension = type.includes("ogg") ? "ogg" : "webm";
      this.downloadLink.download = `duck-session-${new Date().toISOString().replace(/[:.]/g, "-")}.${extension}`;
      this.downloadLink.hidden = false;
      this.recordButton.setAttribute("aria-pressed", "false");
      this.recordButton.lastChild.textContent = " Gravar";
      this.announce("Take concluído. Link de download disponível.");
    }

    async start() {
      await this.ensureAudio();
      if (this.playing) return;
      this.playing = true;
      this.currentStep = 0;
      this.nextNoteTime = this.context.currentTime + 0.06;
      this.schedulerTimer = window.setInterval(() => this.scheduler(), 25);
      select("[data-transport='start']").classList.add("is-active");
      this.announce(`Sequenciador iniciado em ${this.bpm} BPM.`);
    }

    stop() {
      this.playing = false;
      window.clearInterval(this.schedulerTimer);
      this.schedulerTimer = 0;
      this.uiTimers.forEach((timer) => window.clearTimeout(timer));
      this.uiTimers.clear();
      selectAll(".step-button.is-current").forEach((button) => button.classList.remove("is-current"));
      select("[data-transport='start']").classList.remove("is-active");
      this.stepDisplay.textContent = "STEP 01";
      this.announce("Sequenciador parado.");
    }

    scheduler() {
      while (this.playing && this.nextNoteTime < this.context.currentTime + 0.1) {
        this.scheduleStep(this.currentStep, this.nextNoteTime);
        const baseDuration = 60 / this.bpm / 4;
        const swingFactor = this.currentStep % 2 === 0 ? 1 + this.swing : 1 - this.swing;
        this.nextNoteTime += baseDuration * swingFactor;
        this.currentStep = (this.currentStep + 1) % 16;
      }
    }

    scheduleStep(step, time) {
      if (this.pattern.kick[step]) this.triggerKick(time);
      if (this.pattern.snare[step]) this.triggerSnare(time);
      if (this.pattern.hat[step]) this.triggerHat(time);
      const delay = Math.max(0, (time - this.context.currentTime) * 1000);
      const timer = window.setTimeout(() => {
        this.uiTimers.delete(timer);
        this.paintCurrentStep(step);
      }, delay);
      this.uiTimers.add(timer);
    }

    triggerKick(time) {
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(150, time);
      oscillator.frequency.exponentialRampToValueAtTime(45, time + 0.13);
      gain.gain.setValueAtTime(0.8, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.42);
      oscillator.connect(gain).connect(this.masterInput);
      oscillator.start(time);
      oscillator.stop(time + 0.45);
    }

    triggerSnare(time) {
      const noise = this.context.createBufferSource();
      const noiseFilter = this.context.createBiquadFilter();
      const noiseGain = this.context.createGain();
      noise.buffer = this.noiseBuffer;
      noiseFilter.type = "highpass";
      noiseFilter.frequency.value = 1050;
      noiseGain.gain.setValueAtTime(0.42, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.19);
      noise.connect(noiseFilter).connect(noiseGain).connect(this.masterInput);
      const tone = this.context.createOscillator();
      const toneGain = this.context.createGain();
      tone.type = "triangle";
      tone.frequency.value = 185;
      toneGain.gain.setValueAtTime(0.2, time);
      toneGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);
      tone.connect(toneGain).connect(this.masterInput);
      noise.start(time);
      noise.stop(time + 0.2);
      tone.start(time);
      tone.stop(time + 0.12);
    }

    triggerHat(time) {
      const noise = this.context.createBufferSource();
      const highpass = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      noise.buffer = this.noiseBuffer;
      highpass.type = "highpass";
      highpass.frequency.value = 6800;
      gain.gain.setValueAtTime(0.16, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.055);
      noise.connect(highpass).connect(gain).connect(this.masterInput);
      noise.start(time);
      noise.stop(time + 0.06);
    }

    playNote(frequency, label) {
      const now = this.context.currentTime;
      const filter = this.context.createBiquadFilter();
      const gain = this.context.createGain();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(Math.min(9000, frequency * 18), now);
      filter.frequency.exponentialRampToValueAtTime(Math.max(500, frequency * 4), now + this.attack + this.release);
      filter.Q.value = 5;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.13, now + Math.max(0.01, this.attack));
      gain.gain.exponentialRampToValueAtTime(0.001, now + this.attack + this.release);
      [-7, 7].forEach((detune, index) => {
        const oscillator = this.context.createOscillator();
        oscillator.type = index ? "sine" : "sawtooth";
        oscillator.frequency.value = frequency;
        oscillator.detune.value = detune;
        oscillator.connect(filter);
        oscillator.start(now);
        oscillator.stop(now + this.attack + this.release + 0.08);
      });
      filter.connect(gain).connect(this.masterInput);
      this.noteDisplay.textContent = label;
      this.announce(`Nota ${label}.`, false);
    }

    toggleStep(button) {
      const channel = button.dataset.channel;
      const step = Number(button.dataset.step);
      this.pattern[channel][step] = this.pattern[channel][step] ? 0 : 1;
      button.setAttribute("aria-pressed", String(Boolean(this.pattern[channel][step])));
    }

    refreshSteps() {
      selectAll(".step-button").forEach((button) => {
        const channel = button.dataset.channel;
        const step = Number(button.dataset.step);
        button.setAttribute("aria-pressed", String(Boolean(this.pattern[channel][step])));
      });
    }

    moveStepFocus(event, row, step) {
      const keys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
      if (!keys.includes(event.key)) return;
      event.preventDefault();
      let targetRow = row;
      let targetStep = step;
      if (event.key === "ArrowLeft") targetStep = (step + 15) % 16;
      if (event.key === "ArrowRight") targetStep = (step + 1) % 16;
      if (event.key === "ArrowUp") targetRow = (row + this.channels.length - 1) % this.channels.length;
      if (event.key === "ArrowDown") targetRow = (row + 1) % this.channels.length;
      if (event.key === "Home") targetStep = 0;
      if (event.key === "End") targetStep = 15;
      select(`.step-button[data-channel='${this.channels[targetRow]}'][data-step='${targetStep}']`)?.focus();
    }

    paintCurrentStep(step) {
      selectAll(".step-button.is-current").forEach((button) => button.classList.remove("is-current"));
      selectAll(`.step-button[data-step='${step}']`).forEach((button) => button.classList.add("is-current"));
      this.stepDisplay.textContent = `STEP ${String(step + 1).padStart(2, "0")}`;
    }

    flashKey(label) {
      const key = select(`.piano-key[data-note='${label}']`);
      if (!key) return;
      key.classList.add("is-active");
      window.setTimeout(() => key.classList.remove("is-active"), Math.max(150, this.release * 600));
    }

    applyXY() {
      const pad = select("[data-xy-pad]");
      const cutoff = Math.round(120 * Math.pow(100, this.xy.x));
      const space = 1 - this.xy.y;
      const wet = 0.03 + space * 0.48;
      pad.style.setProperty("--x", `${this.xy.x * 100}%`);
      pad.style.setProperty("--y", `${this.xy.y * 100}%`);
      pad.setAttribute("aria-valuenow", String(Math.round(this.xy.x * 100)));
      pad.setAttribute("aria-valuetext", `Filtro ${Math.round(this.xy.x * 100)}%, delay ${Math.round(space * 100)}%`);
      select("[data-cutoff]").textContent = cutoff >= 1000 ? `${(cutoff / 1000).toFixed(1)} kHz` : `${cutoff} Hz`;
      select("[data-delay]").textContent = `${Math.round(space * 100)}%`;
      if (this.context && this.toneFilter && this.delayWet) {
        this.toneFilter.frequency.setTargetAtTime(cutoff, this.context.currentTime, 0.025);
        this.delayWet.gain.setTargetAtTime(wet, this.context.currentTime, 0.025);
      }
    }

    announce(message, visible = true) {
      if (!this.status) return;
      this.status.textContent = message;
      if (!visible) this.status.dataset.transient = "true";
    }

    destroy() {
      this.stop();
      if (this.mediaRecorder?.state === "recording") this.mediaRecorder.stop();
      if (this.recordingUrl) URL.revokeObjectURL(this.recordingUrl);
      this.context?.close();
    }
  }

  function initNavigation() {
    const header = select("[data-header]");
    const toggle = select(".menu-toggle");
    const nav = select(".primary-nav");
    const closeMenu = (restoreFocus = false) => {
      const wasOpen = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", "false");
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      if (restoreFocus && wasOpen) toggle.focus();
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") !== "true";
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });
    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu(true);
    });
    const hero = select(".hero");
    const headerObserver = new IntersectionObserver(([entry]) => {
      header.classList.toggle("is-scrolled", !entry.isIntersecting);
    }, { rootMargin: "-80px 0px 0px" });
    headerObserver.observe(hero);
    const navLinks = selectAll(".primary-nav a");
    const sectionMap = new Map(navLinks.map((link) => [link.getAttribute("href").slice(1), link]));
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.filter((entry) => entry.isIntersecting).forEach((entry) => {
        navLinks.forEach((link) => link.removeAttribute("aria-current"));
        sectionMap.get(entry.target.id)?.setAttribute("aria-current", "true");
      });
    }, { rootMargin: "-35% 0px -55%", threshold: 0 });
    sectionMap.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) sectionObserver.observe(section);
    });
    return () => {
      headerObserver.disconnect();
      sectionObserver.disconnect();
    };
  }

  function initClock() {
    const clock = select("[data-clock]");
    const update = () => {
      const date = new Date();
      clock.textContent = [date.getHours(), date.getMinutes(), date.getSeconds()]
        .map((value) => String(value).padStart(2, "0"))
        .join(":");
    };
    update();
    return window.setInterval(update, 1000);
  }

  function initMotion() {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger || reducedMotion.matches) return () => {};
    gsap.registerPlugin(ScrollTrigger);
    if (window.CustomEase) {
      gsap.registerPlugin(window.CustomEase);
      window.CustomEase.create("duckSignal", "M0,0 C0.16,1 0.3,1 1,1");
    }
    let lenis = null;
    let lenisTicker = null;
    if (window.Lenis) {
      lenis = new window.Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.92, touchMultiplier: 1.1 });
      lenis.on("scroll", ScrollTrigger.update);
      lenisTicker = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(lenisTicker);
      gsap.ticker.lagSmoothing(0);
    }
    const context = gsap.context(() => {
      const heroTargets = selectAll(".hero h1 span, .hero .eyebrow, .hero-intro, .hero-actions, .hero-console");
      gsap.from(heroTargets, {
        y: 54,
        opacity: 0,
        duration: 1.15,
        stagger: 0.08,
        ease: window.CustomEase ? "duckSignal" : "power4.out",
        onStart: () => heroTargets.forEach((target) => target.classList.add("is-animating")),
        onComplete: () => heroTargets.forEach((target) => target.classList.remove("is-animating"))
      });
      gsap.to(".scroll-progress span", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 }
      });
      gsap.to(".hero-orbit", {
        yPercent: 28,
        rotate: 14,
        ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 }
      });
      selectAll("[data-reveal]").forEach((card) => {
        gsap.from(card, {
          y: 70,
          opacity: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 86%", once: true },
          onStart: () => card.classList.add("is-animating"),
          onComplete: () => card.classList.remove("is-animating")
        });
      });
      selectAll(".statement h2, .section-head h2, .services h2, .process h2, .archive h2, .contact h2").forEach((heading) => {
        gsap.from(heading, {
          yPercent: 16,
          opacity: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: heading, start: "top 88%", once: true }
        });
      });
    }, document.body);
    return () => {
      context.revert();
      if (lenis) {
        gsap.ticker.remove(lenisTicker);
        lenis.destroy();
      }
    };
  }

  const scopeRenderer = new ScopeRenderer([select("#hero-scope"), select("#studio-scope")]);
  const studio = new DuckStudio(scopeRenderer);
  const destroyNavigation = initNavigation();
  const clockTimer = initClock();
  const destroyMotion = initMotion();
  studio.mount();
  select("[data-year]").textContent = String(new Date().getFullYear());

  window.addEventListener("pagehide", () => {
    studio.destroy();
    scopeRenderer.destroy();
    destroyNavigation();
    destroyMotion();
    window.clearInterval(clockTimer);
  }, { once: true });
})();
