/**
 * studio.js — Estación de síntesis y metrónomo de heyduck.
 *
 * Web Audio API real, sin librerías. Reglas de diseño:
 *   1. El AudioContext solo se crea tras un gesto del usuario (política de
 *      autoplay de los navegadores). Nunca en carga de página.
 *   2. Todo el estado se refleja en el DOM con atributos ARIA (`aria-pressed`,
 *      `aria-valuetext`) y se anuncia por `aria-live`, para que la estación sea
 *      operable con teclado y lector de pantalla.
 *   3. El bucle de dibujo se detiene cuando la pestaña no es visible y se
 *      sustituye por un fotograma estático con `prefers-reduced-motion`.
 *   4. El grafo es mínimo: 2 osciladores + 1 filtro + 2 ganancias + 1 analizador.
 *      Sin reverbs ni convoluciones: presupuesto de CPU acotado.
 *
 * Si `HeyduckAudio` (audio-core.js) no está presente, este archivo no hace
 * nada y la página conserva su contenido estático.
 */
(function () {
  "use strict";

  var CORE = window.HeyduckAudio;
  var bus = (window.HeyduckBus = window.HeyduckBus || { level: 0, playing: false });

  if (!CORE) {
    if (window.console && console.warn) {
      console.warn("studio.js: falta audio-core.js; estación desactivada");
    }
    return;
  }

  var AC = window.AudioContext || window.webkitAudioContext;

  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function announce(node, message) {
    if (node) node.textContent = message;
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function safeStorage(key, value) {
    try {
      if (typeof value === "undefined") return window.localStorage.getItem(key);
      window.localStorage.setItem(key, value);
    } catch (error) {
      /* modo privado o almacenamiento bloqueado: no es un fallo funcional */
    }
    return null;
  }

  function Studio(root) {
    this.root = root;
    this.audio = null;
    this.master = null;
    this.analyser = null;
    this.synth = null;
    this.metronome = null;
    this.raf = 0;
    this.playing = false;
    this.clicking = false;
    this.level = 0;
    this.freqData = null;

    this.ui = {
      toggle: $("#synth-toggle", root),
      wave: $("#synth-wave", root),
      tuning: $("#synth-tuning", root),
      freq: $("#synth-freq", root),
      volume: $("#synth-volume", root),
      freqOut: $("#synth-freq-out", root),
      volumeOut: $("#synth-volume-out", root),
      metro: $("#metro-toggle", root),
      bpm: $("#metro-bpm", root),
      bpmOut: $("#metro-bpm-out", root),
      spectrum: $("#spectrum", root),
      status: $("#studio-status", root),
      notice: $("#studio-notice", root)
    };
  }

  Studio.prototype.init = function () {
    if (!AC) {
      if (this.ui.notice) {
        this.ui.notice.hidden = false;
        this.ui.notice.textContent =
          "Este navegador no expone Web Audio API: la estación muestra solo sus controles informativos.";
      }
      [this.ui.toggle, this.ui.metro].forEach(function (node) {
        if (node) node.disabled = true;
      });
      return;
    }

    this.bindControls();
    this.restorePreferences();
    this.paintStatic();
    this.bindVisibility();

    if (this.ui.notice) this.ui.notice.hidden = true;
    this.root.setAttribute("data-studio-ready", "true");
  };

  /** Crea el contexto y el grafo una sola vez, siempre por gesto del usuario. */
  Studio.prototype.ensureAudio = function () {
    if (this.audio) {
      if (this.audio.state === "suspended") this.audio.resume();
      return this.audio;
    }

    var ctx = new AC();
    var master = ctx.createGain();
    master.gain.value = CORE.volumeCurve(this.readVolume(), 2);

    var analyser = ctx.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.78;

    master.connect(analyser);
    analyser.connect(ctx.destination);

    this.audio = ctx;
    this.master = master;
    this.analyser = analyser;
    this.freqData = new Uint8Array(analyser.frequencyBinCount);
    return ctx;
  };

  Studio.prototype.readVolume = function () {
    var node = this.ui.volume;
    return node ? CORE.clamp(parseFloat(node.value), 0, 1) : 0.7;
  };

  /** Frecuencia escrita en el control (Hz), sin aplicar afinación. */
  Studio.prototype.readFrequency = function () {
    var node = this.ui.freq;
    return node ? CORE.clamp(parseFloat(node.value), 20, 2000) : 220;
  };

  /** Referencia de A4 en Hz: 440 (ISO 16) o 432 (afinación alternativa). */
  Studio.prototype.reference = function () {
    var node = this.ui.tuning;
    var value = node ? parseFloat(node.value) : 440;
    return value === 432 ? 432 : 440;
  };

  /** Frecuencia real emitida tras aplicar la referencia de afinación. */
  Studio.prototype.tunedFrequency = function () {
    return (this.readFrequency() * this.reference()) / 440;
  };

  Studio.prototype.readBpm = function () {
    var node = this.ui.bpm;
    return node ? CORE.clamp(parseFloat(node.value), 40, 240) : 96;
  };

  /** Arranca o detiene el drone del sintetizador. */
  Studio.prototype.toggleSynth = function () {
    var ctx = this.ensureAudio();

    if (this.playing) {
      this.stopSynth();
      return;
    }

    var now = ctx.currentTime;
    var freq = this.tunedFrequency();
    var wave = this.ui.wave ? this.ui.wave.value : "sawtooth";

    var filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = CORE.clamp(freq * 6, 200, 8000);
    filter.Q.value = 6;

    var envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(0.5, now + 0.06);

    var main = ctx.createOscillator();
    main.type = wave;
    main.frequency.setValueAtTime(freq, now);

    // Suboscilador una octava abajo: da cuerpo sin subir el nivel percibido.
    var sub = ctx.createOscillator();
    sub.type = "triangle";
    sub.frequency.setValueAtTime(freq / 2, now);

    var subGain = ctx.createGain();
    subGain.gain.value = 0.35;

    // Vibrato lento sobre el filtro: movimiento orgánico, no un LFO audible.
    var lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.18;
    var lfoGain = ctx.createGain();
    lfoGain.gain.value = CORE.clamp(freq * 1.2, 60, 1800);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    main.connect(filter);
    sub.connect(subGain);
    subGain.connect(filter);
    filter.connect(envelope);
    envelope.connect(this.master);

    main.start(now);
    sub.start(now);
    lfo.start(now);

    this.synth = { main: main, sub: sub, lfo: lfo, filter: filter, envelope: envelope, wave: wave };
    this.playing = true;
    bus.playing = true;

    if (this.ui.toggle) {
      this.ui.toggle.setAttribute("aria-pressed", "true");
      this.ui.toggle.textContent = "Detener sintetizador";
    }
    this.announceState("Sintetizador activo");
    this.startVisualizer();
  };

  Studio.prototype.stopSynth = function () {
    var ctx = this.audio;
    if (this.synth && ctx) {
      var now = ctx.currentTime;
      var env = this.synth.envelope;
      var nodes = [this.synth.main, this.synth.sub, this.synth.lfo];
      try {
        env.gain.cancelScheduledValues(now);
        env.gain.setValueAtTime(Math.max(env.gain.value, 0.0001), now);
        env.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
      } catch (error) {
        /* algunos navegadores rechazan rampas sobre valores ya expirados */
      }
      nodes.forEach(function (node) {
        try {
          node.stop(now + 0.14);
        } catch (error) {
          /* ya detenido */
        }
      });
    }
    this.synth = null;
    this.playing = false;
    bus.playing = false;

    if (this.ui.toggle) {
      this.ui.toggle.setAttribute("aria-pressed", "false");
      this.ui.toggle.textContent = "Reproducir sintetizador";
    }
    this.announceState("Sintetizador detenido");
    if (!this.clicking) this.stopVisualizer();
  };

  Studio.prototype.applyVolume = function () {
    var value = this.readVolume();
    if (this.master && this.audio) {
      this.master.gain.setTargetAtTime(CORE.volumeCurve(value, 2), this.audio.currentTime, 0.02);
    }
    if (this.ui.volumeOut) this.ui.volumeOut.textContent = Math.round(value * 100) + " %";
    safeStorage("heyduck.volume", String(CORE.round(value, 2)));
  };

  Studio.prototype.applyFrequency = function () {
    var written = this.readFrequency();
    var value = this.tunedFrequency();
    var reference = this.reference();

    if (this.synth && this.audio) {
      var now = this.audio.currentTime;
      this.synth.main.frequency.setTargetAtTime(value, now, 0.03);
      this.synth.sub.frequency.setTargetAtTime(value / 2, now, 0.03);
      this.synth.filter.frequency.setTargetAtTime(CORE.clamp(value * 6, 200, 8000), now, 0.05);
    }
    if (this.ui.freqOut) {
      var note = CORE.noteName(CORE.freqToMidi(value, reference));
      this.ui.freqOut.textContent = CORE.round(value, 1) + " Hz · " + note;
    }
    safeStorage("heyduck.freq", String(CORE.round(written, 1)));
  };

  Studio.prototype.applyWave = function () {
    var wave = this.ui.wave ? this.ui.wave.value : "sawtooth";
    if (this.synth && this.audio) {
      this.synth.main.type = wave;
    }
    safeStorage("heyduck.wave", wave);
    if (this.playing) {
      var labels = {
        sine: "senoidal",
        triangle: "triangular",
        square: "cuadrada",
        sawtooth: "diente de sierra"
      };
      this.announceState("Onda " + (labels[wave] || wave));
    }
  };

  Studio.prototype.applyBpm = function () {
    var bpm = this.readBpm();
    if (this.ui.bpmOut) {
      this.ui.bpmOut.textContent = Math.round(bpm) + " BPM · " + Math.round(CORE.bpmToMs(bpm)) + " ms";
    }
    safeStorage("heyduck.bpm", String(Math.round(bpm)));
  };

  /** Metrónomo con planificación anticipada (look-ahead) para no desviarse. */
  Studio.prototype.toggleMetronome = function () {
    var ctx = this.ensureAudio();

    if (this.clicking) {
      this.stopMetronome();
      return;
    }

    this.clicking = true;
    this.nextClickAt = ctx.currentTime + 0.06;
    this.clickIndex = 0;

    var self = this;
    var schedule = window.setInterval(function () {
      self.scheduleClicks();
    }, 25);

    this.metronome = { timer: schedule };
    if (this.ui.metro) {
      this.ui.metro.setAttribute("aria-pressed", "true");
      this.ui.metro.textContent = "Detener metrónomo";
    }
    this.announceState("Metrónomo activo a " + Math.round(this.readBpm()) + " BPM");
    this.startVisualizer();
    this.scheduleClicks();
  };

  Studio.prototype.scheduleClicks = function () {
    if (!this.clicking || !this.audio) return;
    var ctx = this.audio;

    while (this.nextClickAt < ctx.currentTime + 0.15) {
      var accent = this.clickIndex % 4 === 0;
      this.click(this.nextClickAt, accent);
      this.nextClickAt += CORE.bpmToMs(this.readBpm()) / 1000;
      this.clickIndex++;
    }
  };

  Studio.prototype.click = function (when, accent) {
    var ctx = this.audio;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(accent ? 1760 : 1174.66, when);

    var peak = accent ? 0.28 : 0.14;
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.exponentialRampToValueAtTime(peak, when + 0.004);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05);

    osc.connect(gain);
    gain.connect(this.master);
    osc.start(when);
    osc.stop(when + 0.07);
  };

  Studio.prototype.stopMetronome = function () {
    if (this.metronome) window.clearInterval(this.metronome.timer);
    this.metronome = null;
    this.clicking = false;
    if (this.ui.metro) {
      this.ui.metro.setAttribute("aria-pressed", "false");
      this.ui.metro.textContent = "Activar metrónomo";
    }
    this.announceState("Metrónomo detenido");
    if (!this.playing) this.stopVisualizer();
  };

  Studio.prototype.announceState = function (message) {
    announce(this.ui.status, message);
  };

  Studio.prototype.bindControls = function () {
    var self = this;

    if (this.ui.toggle) {
      this.ui.toggle.addEventListener("click", function () {
        self.toggleSynth();
      });
    }
    if (this.ui.metro) {
      this.ui.metro.addEventListener("click", function () {
        self.toggleMetronome();
      });
    }
    if (this.ui.volume) {
      this.ui.volume.addEventListener("input", function () {
        self.applyVolume();
      });
    }
    if (this.ui.freq) {
      this.ui.freq.addEventListener("input", function () {
        self.applyFrequency();
      });
    }
    if (this.ui.wave) {
      this.ui.wave.addEventListener("change", function () {
        self.applyWave();
      });
    }
    if (this.ui.tuning) {
      this.ui.tuning.addEventListener("change", function () {
        self.applyFrequency();
        safeStorage("heyduck.tuning", String(self.reference()));
        self.announceState("Afinación de referencia A4 = " + self.reference() + " Hz");
      });
    }
    if (this.ui.bpm) {
      this.ui.bpm.addEventListener("input", function () {
        self.applyBpm();
        safeStorage("heyduck.bpm", String(Math.round(self.readBpm())));
      });
    }

    this.applyVolume();
    this.applyFrequency();
    this.applyBpm();

    // Pausa la síntesis al ocultar la pestaña: ni CPU ni audio fantasma.
    document.addEventListener("visibilitychange", function () {
      if (!self.audio) return;
      if (document.hidden) {
        if (self.audio.state === "running") self.audio.suspend();
        self.stopVisualizer();
      } else if (self.playing || self.clicking) {
        self.audio.resume();
        self.startVisualizer();
      }
    });
  };

  Studio.prototype.restorePreferences = function () {
    var volume = safeStorage("heyduck.volume");
    var freq = safeStorage("heyduck.freq");
    var wave = safeStorage("heyduck.wave");
    var bpm = safeStorage("heyduck.bpm");
    var tuning = safeStorage("heyduck.tuning");

    if (volume !== null && this.ui.volume) this.ui.volume.value = volume;
    if (freq !== null && this.ui.freq) this.ui.freq.value = freq;
    if (wave !== null && this.ui.wave) {
      for (var i = 0; i < this.ui.wave.options.length; i++) {
        if (this.ui.wave.options[i].value === wave) this.ui.wave.selectedIndex = i;
      }
    }
    if (bpm !== null && this.ui.bpm) this.ui.bpm.value = bpm;
    if (tuning === "432" && this.ui.tuning) this.ui.tuning.value = "432";
  };

  Studio.prototype.bindVisibility = function () {
    var self = this;
    window.addEventListener("resize", function () {
      if (!self.raf) self.paintStatic();
    });
  };

  Studio.prototype.planeCanvas = function () {
    var canvas = this.ui.spectrum;
    if (!canvas) return null;
    var ctx = canvas.getContext("2d");
    if (!ctx) return null;

    var ratio = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    var width = Math.max(1, Math.round(rect.width));
    var height = Math.max(1, Math.round(rect.height));
    var pixelWidth = Math.round(width * ratio);
    var pixelHeight = Math.round(height * ratio);

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth;
      canvas.height = pixelHeight;
    }
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    return { ctx: ctx, width: width, height: height };
  };

  Studio.prototype.draw = function (bands) {
    var plane = this.planeCanvas();
    if (!plane) return;
    var ctx = plane.ctx;
    var width = plane.width;
    var height = plane.height;

    ctx.clearRect(0, 0, width, height);

    var background = ctx.createLinearGradient(0, 0, 0, height);
    background.addColorStop(0, "rgba(19,17,16,0.9)");
    background.addColorStop(1, "rgba(11,10,9,0.95)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    var gap = 2;
    var barWidth = Math.max(1, width / bands.length - gap);

    for (var i = 0; i < bands.length; i++) {
      var value = bands[i];
      var barHeight = Math.max(1, value * (height - 6));
      var x = i * (barWidth + gap);
      var hue = 168 + (i / bands.length) * 28;
      ctx.fillStyle = "hsl(" + hue + " 78% " + (46 + value * 24) + "%)";
      ctx.fillRect(x, height - barHeight, barWidth, barHeight);
    }
  };

  Studio.prototype.paintStatic = function () {
    var bands = new Array(32).fill(0);
    for (var i = 0; i < bands.length; i++) {
      bands[i] = 0.04 + 0.16 * Math.abs(Math.sin(i * 1.7)) ;
    }
    this.draw(bands);
  };

  Studio.prototype.startVisualizer = function () {
    if (this.raf) return;
    if (!this.analyser || !this.ui.spectrum) return;

    var self = this;

    if (prefersReducedMotion()) {
      // Sin animación: un fotograma representativo y una lectura ARIA del nivel.
      this.sampleLevel();
      this.paintStatic();
      return;
    }

    var loop = function () {
      self.raf = window.requestAnimationFrame(loop);
      self.sampleLevel();

      if (!self.analyser) return;
      self.analyser.getByteFrequencyData(self.freqData);

      var bands = CORE.spectrumBands(self.freqData, {
        bars: self.ui.spectrum.clientWidth > 640 ? 48 : 28,
        sampleRate: self.audio.sampleRate,
        fftSize: self.analyser.fftSize
      });
      self.draw(bands);
    };

    this.raf = window.requestAnimationFrame(loop);
  };

  Studio.prototype.sampleLevel = function () {
    if (!this.analyser) return 0;
    this.analyser.getByteTimeDomainData(this.freqData);
    var peak = 0;
    for (var i = 0; i < this.freqData.length; i += 8) {
      var deviation = Math.abs(this.freqData[i] - 128) / 128;
      if (deviation > peak) peak = deviation;
    }
    this.level = peak;
    bus.level = peak;
    return peak;
  };

  Studio.prototype.stopVisualizer = function () {
    if (this.raf) {
      window.cancelAnimationFrame(this.raf);
      this.raf = 0;
    }
    bus.level = 0;
    this.paintStatic();
  };

  function boot() {
    var root = $("[data-studio]");
    if (!root) return;
    var studio = new Studio(root);
    studio.init();
    window.HeyduckStudio = studio;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
