"use strict";

/**
 * Pruebas del núcleo de audio (js/audio-core.js).
 * Es el único lugar del proyecto con matemática propia; por eso es el que más
 * necesita pruebas: un error aquí se oye.
 */
const { test } = require("node:test");
const assert = require("node:assert/strict");
const core = require("../js/audio-core.js");

test("midiToFreq cumple las referencias estándar", () => {
  assert.equal(core.midiToFreq(69), 440);
  assert.equal(core.midiToFreq(60), 261.6255653005986);
  assert.equal(core.midiToFreq(81), 880);
  // Afinación alternativa: A4 = 432 Hz, una quinta justa sigue siendo 1.5×.
  assert.equal(core.midiToFreq(69, 432), 432);
  // La relación entre notas es independiente de la referencia: E5 está una
  // quinta justa (2^(7/12)) por encima de A4, sea 440 o 432.
  const ratio = core.midiToFreq(76, 432) / core.midiToFreq(69, 432);
  assert.ok(Math.abs(ratio - Math.pow(2, 7 / 12)) < 1e-12);
});

test("freqToMidi es la inversa de midiToFreq", () => {
  for (const midi of [21, 45, 60, 69, 88, 108]) {
    for (const reference of [440, 432]) {
      assert.ok(Math.abs(core.freqToMidi(core.midiToFreq(midi, reference), reference) - midi) < 1e-9);
    }
  }
  assert.ok(Number.isNaN(core.freqToMidi(0)));
  assert.ok(Number.isNaN(core.freqToMidi(-10)));
});

test("noteName usa la notación científica con A4 como 69", () => {
  assert.equal(core.noteName(69), "A4");
  assert.equal(core.noteName(60), "C4");
  assert.equal(core.noteName(61), "C#4");
  assert.equal(core.noteName(21), "A0");
});

test("bpmToMs convierte tempo a periodo y acota el rango", () => {
  assert.equal(core.bpmToMs(120), 500);
  assert.equal(core.bpmToMs(60), 1000);
  assert.equal(Math.round(core.bpmToMs(96)), 625);
  // Valores absurdos no producen divisiones por cero ni periodos negativos.
  assert.ok(core.bpmToMs(0) > 0);
  assert.ok(core.bpmToMs(-5) > 0);
  assert.ok(core.bpmToMs(10000) >= 60000 / 320 - 1e-9);
});

test("adsrGain traza ataque, sostenido, release y silencio", () => {
  const env = { attack: 0.1, decay: 0.1, sustain: 0.6, release: 0.2, duration: 1 };
  assert.equal(core.adsrGain(0, env), 0);
  assert.ok(Math.abs(core.adsrGain(0.05, env) - 0.5) < 1e-9, "mitad del ataque");
  assert.ok(Math.abs(core.adsrGain(0.1, env) - 1) < 1e-9, "fin del ataque");
  assert.ok(Math.abs(core.adsrGain(0.2, env) - 0.6) < 1e-9, "fin del decay");
  assert.ok(Math.abs(core.adsrGain(0.5, env) - 0.6) < 1e-9, "sostenido");
  assert.ok(core.adsrGain(1.0001, env) === 0, "fuera de duración");
  assert.ok(core.adsrGain(-0.1, env) === 0, "tiempo negativo");
});

test("adsrGain nunca sale del rango 0..1", () => {
  const env = { attack: 0.01, decay: 0.01, sustain: 3, release: 0.01, duration: 0.5 };
  for (let t = 0; t <= 0.6; t += 0.005) {
    const value = core.adsrGain(t, env);
    assert.ok(value >= 0 && value <= 1, `t=${t} → ${value}`);
  }
});

test("volumeCurve es monótona y respeta los extremos", () => {
  assert.equal(core.volumeCurve(0), 0);
  assert.equal(core.volumeCurve(1), 1);
  let previous = -1;
  for (let p = 0; p <= 1.0001; p += 0.05) {
    const value = core.volumeCurve(p, 2);
    assert.ok(value >= previous);
    previous = value;
  }
  // Un 50 % de recorrido no debe sonar a la mitad de nivel: la curva lo baja.
  assert.ok(core.volumeCurve(0.5, 2) < 0.5);
  assert.equal(core.volumeCurve(2), 1, "satura por encima de 1");
  assert.equal(core.volumeCurve(-1), 0, "satura por debajo de 0");
});

test("spectrumBands reparte la FFT en bandas logarítmicas normalizadas", () => {
  const freqData = new Uint8Array(1024).fill(0);
  freqData[10] = 255;
  freqData[500] = 128;

  const bands = core.spectrumBands(freqData, { bars: 16, sampleRate: 44100, fftSize: 2048 });
  assert.equal(bands.length, 16);
  for (const value of bands) {
    assert.ok(value >= 0 && value <= 1, "cada banda se normaliza a 0..1");
  }
  assert.ok(Math.max(...bands) > 0, "una señal presente produce al menos una banda no nula");
  const peak = bands.indexOf(Math.max(...bands));
  assert.ok(peak < bands.length / 2, `un pico a 215 Hz debe caer en la mitad grave (cayó en ${peak})`);

  const high = new Uint8Array(1024).fill(0);
  high[400] = 255; // ~8.6 kHz
  const highBands = core.spectrumBands(high, { bars: 16, sampleRate: 44100, fftSize: 2048 });
  const highPeak = highBands.indexOf(Math.max(...highBands));
  assert.ok(highPeak > highBands.length / 2, `un pico agudo debe caer en la mitad aguda (cayó en ${highPeak})`);
});

test("spectrumBands es robusta ante entradas degeneradas", () => {
  assert.deepEqual(core.spectrumBands(null, { bars: 4 }), [0, 0, 0, 0]);
  assert.deepEqual(core.spectrumBands(new Uint8Array(0), { bars: 3 }), [0, 0, 0]);
  const silent = core.spectrumBands(new Uint8Array(512), { bars: 8, sampleRate: 48000, fftSize: 1024 });
  assert.equal(silent.length, 8);
  assert.equal(Math.max(...silent), 0);
  // Rangos imposibles no lanzan: devuelven silencio.
  const impossible = core.spectrumBands(new Uint8Array(512), { bars: 4, minHz: 20000, maxHz: 100 });
  assert.deepEqual(impossible, [0, 0, 0, 0]);
});

test("metronomePattern acentúa el primer pulso de cada compás", () => {
  const pattern = core.metronomePattern(8, 4);
  assert.equal(pattern.length, 8);
  assert.deepEqual(
    pattern.map((step) => step.accent),
    [true, false, false, false, true, false, false, false]
  );
  assert.deepEqual(core.metronomePattern(0, 4).length, 1, "siempre hay al menos un paso");
});

test("scaleNote produce notas de la pentatónica menor en varias octavas", () => {
  const degrees = [0, 1, 2, 3, 4, 5, 6];
  const notes = degrees.map((degree) => core.scaleNote(60, degree));
  assert.deepEqual(notes, [60, 63, 65, 67, 70, 72, 75]);
  // Grados negativos siguen siendo musicales, no errores.
  assert.equal(core.scaleNote(60, -1), 58);
});

test("formatCompact abrevia cifras grandes sin inventar precisión", () => {
  assert.equal(core.formatCompact(36000000), "36M");
  assert.equal(core.formatCompact(1200000), "1.2M");
  assert.equal(core.formatCompact(950000), "950K");
  assert.equal(core.formatCompact(40), "40");
  assert.equal(core.formatCompact(NaN), "—");
});

test("isPublishableLink distingue enlaces reales de marcadores", () => {
  assert.equal(core.isPublishableLink("https://music.apple.com/us/album/x/1"), true);
  assert.equal(core.isPublishableLink("http://example.com"), true);
  assert.equal(core.isPublishableLink("#"), false);
  assert.equal(core.isPublishableLink(""), false);
  assert.equal(core.isPublishableLink("javascript:alert(1)"), false);
  assert.equal(core.isPublishableLink("ftp://example.com"), false);
  assert.equal(core.isPublishableLink(null), false);
});

test("clamp y lerp se comportan como sus contratos", () => {
  assert.equal(core.clamp(5, 0, 1), 1);
  assert.equal(core.clamp(-5, 0, 1), 0);
  assert.equal(core.clamp(NaN, 2, 8), 2);
  assert.equal(core.clamp(3, 10, 0), 3, "acepta un rango invertido");
  assert.equal(core.lerp(0, 10, 0.5), 5);
  assert.equal(core.lerp(0, 10, 2), 10, "el factor se acota");
});
