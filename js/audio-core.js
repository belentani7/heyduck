/**
 * audio-core.js — Núcleo matemático y DSP de heyduck.
 *
 * Todo lo que ocurre aquí es determinista y libre de efectos secundarios:
 * no toca el DOM, no instancia nodos de Web Audio y no depende de `window`.
 * Eso permite verificarlo en Node con `node --test` y, a la vez, usarlo en
 * el navegador como script clásico (`globalThis.HeyduckAudio`).
 *
 * Convenciones:
 *   - Frecuencias en Hz, tiempos en segundos salvo que el nombre diga `Ms`.
 *   - Índices MIDI: 69 = A4 = 440 Hz. El modo 432 Hz usa 60 = C4 = 256 Hz-ish
 *     mediante un desplazamiento de referencia, no una afinación inventada.
 *   - Ninguna función muta sus argumentos.
 */
(function (root, factory) {
  "use strict";
  var api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }
  if (root) {
    root.HeyduckAudio = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var MIN_GAIN = 0;
  var MAX_GAIN = 1;

  /** Limita `value` al intervalo cerrado [min, max]. */
  function clamp(value, min, max) {
    if (max < min) {
      var swap = min;
      min = max;
      max = swap;
    }
    if (value !== value) return min; // NaN
    return value < min ? min : value > max ? max : value;
  }

  /** Interpolación lineal entre `a` y `b` con factor `t` acotado a [0, 1]. */
  function lerp(a, b, t) {
    var k = clamp(t, 0, 1);
    return a + (b - a) * k;
  }

  /**
   * Convierte una nota MIDI a frecuencia (Hz).
   * `reference` es la frecuencia de A4: 440 (estándar ISO 16) o 432 (afinación
   * alternativa empleada por el estudio). No es una "frecuencia sagrada":
   * es una referencia configurable y así se documenta.
   */
  function midiToFreq(midi, reference) {
    var a4 = typeof reference === "number" ? reference : 440;
    return a4 * Math.pow(2, (midi - 69) / 12);
  }

  /** Inversa de `midiToFreq`. */
  function freqToMidi(freq, reference) {
    var a4 = typeof reference === "number" ? reference : 440;
    if (!(freq > 0)) return NaN;
    return 69 + 12 * Math.log2(freq / a4);
  }

  var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

  /** Nombre científico de una nota MIDI (A4 = "A4"). */
  function noteName(midi) {
    var rounded = Math.round(midi);
    var index = ((rounded % 12) + 12) % 12;
    var octave = Math.floor(rounded / 12) - 1;
    return NOTE_NAMES[index] + octave;
  }

  /** Milisegundos por negra a partir de BPM. */
  function bpmToMs(bpm) {
    var b = clamp(Number(bpm) || 0, 20, 320);
    return 60000 / b;
  }

  /**
   * Envolvente ADSR muestreada.
   * `t` es el tiempo desde el ataque. `dur` es la duración total (incluye
   * release). Devuelve una ganancia en [0, 1]; 0 fuera del intervalo.
   */
  function adsrGain(t, envelope) {
    var env = envelope || {};
    var attack = Math.max(0.001, Number(env.attack) || 0.01);
    var decay = Math.max(0.001, Number(env.decay) || 0.1);
    var sustain = clamp(Number(env.sustain) === 0 ? 0 : Number(env.sustain) || 0.7, 0, 1);
    var release = Math.max(0.001, Number(env.release) || 0.2);
    var duration = Number(env.duration) || attack + decay + release;
    if (!(t >= 0) || t > duration) return 0;
    if (t < attack) return clamp(t / attack, 0, 1);
    if (t < attack + decay) {
      var k = (t - attack) / decay;
      return clamp(lerp(1, sustain, k), 0, 1);
    }
    var releaseStart = Math.max(attack + decay, duration - release);
    if (t < releaseStart) return sustain;
    var rk = (t - releaseStart) / release;
    return clamp(lerp(sustain, 0, rk), 0, 1);
  }

  /**
   * Curva perceptual de volumen. Los sliders de audio no deben ser lineales:
   * un `curve` de 2 aproxima la respuesta del oído y evita que el 50 % suene
   * casi tan alto como el 100 %.
   */
  function volumeCurve(position, curve) {
    var p = clamp(position, MIN_GAIN, MAX_GAIN);
    var c = typeof curve === "number" && curve > 0 ? curve : 2;
    return Math.pow(p, c);
  }

  /** Redondeo a `decimals` cifras sin arrastrar errores binarios visibles. */
  function round(value, decimals) {
    var d = typeof decimals === "number" ? decimals : 2;
    var factor = Math.pow(10, d);
    return Math.round(value * factor) / factor;
  }

  /**
   * Reparte bins FFT en `bars` bandas logarítmicas entre `minHz` y `maxHz`.
   * Devuelve un array de valores 0..1 (media de cada banda) listo para pintar.
   * Si un rango es inválido devuelve un array de ceros de longitud `bars`.
   */
  function spectrumBands(freqData, options) {
    var opts = options || {};
    var bars = Math.max(1, Math.round(Number(opts.bars) || 32));
    var sampleRate = Number(opts.sampleRate) || 44100;
    var fftSize = Number(opts.fftSize) || 2048;
    var minHz = Math.max(20, Number(opts.minHz) || 40);
    var maxHz = Math.max(minHz + 1, Number(opts.maxHz) || 16000);
    var out = new Array(bars).fill(0);
    if (!freqData || typeof freqData.length !== "number" || freqData.length === 0) return out;

    var binHz = sampleRate / fftSize;
    var nyquist = sampleRate / 2;
    var top = Math.min(maxHz, nyquist);
    if (!(top > minHz) || !(binHz > 0)) return out;

    var minBin = Math.max(1, Math.floor(minHz / binHz));
    var maxBin = Math.min(freqData.length - 1, Math.ceil(top / binHz));
    if (maxBin < minBin) return out;

    var logMin = Math.log(minBin);
    var logMax = Math.log(maxBin + 1);

    for (var i = 0; i < bars; i++) {
      var from = Math.exp(logMin + ((logMax - logMin) * i) / bars);
      var to = Math.exp(logMin + ((logMax - logMin) * (i + 1)) / bars);
      var start = Math.floor(from);
      var end = Math.max(start + 1, Math.ceil(to));
      var sum = 0;
      var count = 0;
      for (var b = start; b < end && b < freqData.length; b++) {
        sum += freqData[b];
        count++;
      }
      out[i] = count ? clamp(sum / count / 255, 0, 1) : 0;
    }
    return out;
  }

  /**
   * Secuencia de pasos del metrónomo para `beats` pulsos y `beatsPerBar`
   * negras por compás. El primer pulso de cada compás es acentuado.
   */
  function metronomePattern(beats, beatsPerBar) {
    // Ojo: `Number(beats) || 4` convertía un 0 explícito en 4. Se distingue
    // "sin argumento" (4 por defecto) de "cero pulsos" (1 mínimo).
    var rawBeats = Number(beats);
    var total = Number.isFinite(rawBeats) && beats !== null && beats !== undefined
      ? Math.max(1, Math.round(rawBeats))
      : 4;
    var rawPerBar = Number(beatsPerBar);
    var perBar = Number.isFinite(rawPerBar) && beatsPerBar !== null && beatsPerBar !== undefined
      ? Math.max(1, Math.round(rawPerBar))
      : 4;
    var steps = [];
    for (var i = 0; i < total; i++) {
      steps.push({ index: i, accent: i % perBar === 0 });
    }
    return steps;
  }

  /**
   * Escala pentatónica menor en semitonos desde la tónica.
   * Se usa para que cualquier combinación del secuenciador suene musical.
   */
  var PENTATONIC_MINOR = [0, 3, 5, 7, 10];

  /** Nota MIDI resultante de aplicar el grado `degree` de una escala. */
  function scaleNote(rootMidi, degree, scale) {
    var pattern = scale && scale.length ? scale : PENTATONIC_MINOR;
    var root = Math.round(Number(rootMidi) || 60);
    var d = Math.trunc(Number(degree) || 0);
    var octave = Math.floor(d / pattern.length);
    var step = ((d % pattern.length) + pattern.length) % pattern.length;
    return root + pattern[step] + 12 * octave;
  }

  /** Formatea contadores grandes: 1200000 -> "1.2M". */
  function formatCompact(value) {
    var n = Number(value);
    if (!isFinite(n)) return "—";
    var abs = Math.abs(n);
    if (abs >= 1e9) return round(n / 1e9, 1) + "B";
    if (abs >= 1e6) return round(n / 1e6, 1) + "M";
    if (abs >= 1e3) return round(n / 1e3, 1) + "K";
    return String(Math.round(n));
  }

  /**
   * Un enlace de streaming solo es publicable si es http(s) verificado.
   * `"#"` u otros marcadores significan "pendiente de verificación" y la UI
   * debe mostrarlos como texto, nunca como botón que no lleva a ninguna parte.
   */
  function isPublishableLink(url) {
    return typeof url === "string" && /^https?:\/\/[^\s]+$/i.test(url);
  }

  return {
    MAX_GAIN: MAX_GAIN,
    MIN_GAIN: MIN_GAIN,
    PENTATONIC_MINOR: PENTATONIC_MINOR,
    clamp: clamp,
    lerp: lerp,
    midiToFreq: midiToFreq,
    freqToMidi: freqToMidi,
    noteName: noteName,
    bpmToMs: bpmToMs,
    adsrGain: adsrGain,
    volumeCurve: volumeCurve,
    round: round,
    spectrumBands: spectrumBands,
    metronomePattern: metronomePattern,
    scaleNote: scaleNote,
    formatCompact: formatCompact,
    isPublishableLink: isPublishableLink
  };
});
