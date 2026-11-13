/**
 * DUCK - Instruments & Interactive Modules v2.0
 * Piano, Xylophone, Drums, Recording, Synth, Metronome, Lyrics
 */

// ─── AUDIO CONTEXT ──────────────────────────────────────
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// ─── SINGLES ────────────────────────────────────────────
function renderSingles() {
  const grid = document.getElementById("singlesGrid");
  if (!grid || typeof DUCK_SINGLES === "undefined") return;
  DUCK_SINGLES.forEach((s) => {
    const card = document.createElement("a");
    card.href = s.url;
    card.target = "_blank";
    card.rel = "noopener";
    card.className = "single-card rv";
    card.innerHTML = `<img src="${s.cover}" alt="${s.name}" loading="lazy"><div class="single-info"><h4>${s.name}</h4><p>${s.ft} · ${s.year}</p></div>`;
    grid.appendChild(card);
  });
}

// ─── PIANO ──────────────────────────────────────────────
const pianoNotes = [
  { note: "C4", freq: 261.63, key: "a", black: false },
  { note: "C#4", freq: 277.18, key: "w", black: true },
  { note: "D4", freq: 293.66, key: "s", black: false },
  { note: "D#4", freq: 311.13, key: "e", black: true },
  { note: "E4", freq: 329.63, key: "d", black: false },
  { note: "F4", freq: 349.23, key: "f", black: false },
  { note: "F#4", freq: 369.99, key: "t", black: true },
  { note: "G4", freq: 392.0, key: "g", black: false },
  { note: "G#4", freq: 415.3, key: "y", black: true },
  { note: "A4", freq: 440.0, key: "h", black: false },
  { note: "A#4", freq: 466.16, key: "u", black: true },
  { note: "B4", freq: 493.88, key: "j", black: false },
  { note: "C5", freq: 523.25, key: "k", black: false },
];

function initPiano() {
  const el = document.getElementById("pianoKeys");
  if (!el) return;
  pianoNotes.forEach((n) => {
    const btn = document.createElement("button");
    btn.className = "p-key" + (n.black ? " black" : "");
    btn.setAttribute("aria-label", "Piano " + n.note);
    btn.textContent = n.key.toUpperCase();
    btn.addEventListener("mousedown", () => playNote(n.freq, "piano"));
    btn.addEventListener("mouseup", () => btn.classList.remove("active"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("active"));
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      playNote(n.freq, "piano");
      btn.classList.add("active");
    });
    btn.addEventListener("touchend", () => btn.classList.remove("active"));
    el.appendChild(btn);
  });
  document.addEventListener("keydown", (e) => {
    if (e.repeat) return;
    const n = pianoNotes.find((p) => p.key === e.key);
    if (n) {
      playNote(n.freq, "piano");
      const btn = el.children[pianoNotes.indexOf(n)];
      if (btn) btn.classList.add("active");
    }
  });
  document.addEventListener("keyup", (e) => {
    const n = pianoNotes.find((p) => p.key === e.key);
    if (n) {
      const btn = el.children[pianoNotes.indexOf(n)];
      if (btn) btn.classList.remove("active");
    }
  });
}

function playNote(freq, type) {
  if (audioCtx.state === "suspended") audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const waveType = document.getElementById("pianoSound")?.value || "sine";
  osc.type = type === "piano" ? waveType : "sine";
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.8);
}

// ─── XYLOPHONE ──────────────────────────────────────────
const xyloFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
const xyloColors = [
  "#ff6b6b",
  "#ffa94d",
  "#ffd43b",
  "#69db7c",
  "#4dabf7",
  "#9775fa",
  "#f783ac",
  "#e599f7",
];

function initXylo() {
  const el = document.getElementById("xyloKeys");
  if (!el) return;
  xyloFreqs.forEach((freq, i) => {
    const btn = document.createElement("button");
    btn.className = "x-key";
    btn.style.height = 50 + i * 8 + "px";
    btn.style.background = xyloColors[i];
    btn.setAttribute("aria-label", "Xilofono " + (i + 1));
    btn.addEventListener("mousedown", () => {
      playNote(freq, "xylo");
      btn.classList.add("active");
    });
    btn.addEventListener("mouseup", () => btn.classList.remove("active"));
    btn.addEventListener("mouseleave", () => btn.classList.remove("active"));
    btn.addEventListener("touchstart", (e) => {
      e.preventDefault();
      playNote(freq, "xylo");
      btn.classList.add("active");
    });
    btn.addEventListener("touchend", () => btn.classList.remove("active"));
    el.appendChild(btn);
  });
}

// ─── DRUMS ──────────────────────────────────────────────
const drumSounds = {
  kick: { freq: 80, type: "sine", dur: 0.3 },
  snare: { freq: 200, type: "triangle", dur: 0.15 },
  hihat: { freq: 800, type: "square", dur: 0.05 },
  clap: { freq: 400, type: "sawtooth", dur: 0.1 },
  tom1: { freq: 150, type: "sine", dur: 0.2 },
  rim: { freq: 600, type: "triangle", dur: 0.03 },
};

function initDrums() {
  document.querySelectorAll(".drum-pad").forEach((pad) => {
    const play = () => {
      if (audioCtx.state === "suspended") audioCtx.resume();
      const s = drumSounds[pad.dataset.sound];
      if (!s) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = s.type;
      osc.frequency.setValueAtTime(s.freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + s.dur,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + s.dur);
      pad.classList.add("active");
      setTimeout(() => pad.classList.remove("active"), 100);
    };
    pad.addEventListener("click", play);
    pad.addEventListener("touchstart", (e) => {
      e.preventDefault();
      play();
    });
  });
  const keyMap = {
    1: "kick",
    2: "snare",
    3: "hihat",
    4: "clap",
    5: "tom1",
    6: "rim",
  };
  document.addEventListener("keydown", (e) => {
    if (e.repeat || !keyMap[e.key]) return;
    const pad = document.querySelector(
      `.drum-pad[data-sound="${keyMap[e.key]}"]`,
    );
    if (pad) pad.click();
  });
}

// ─── RECORDER ───────────────────────────────────────────
let mediaRecorder = null,
  recStream = null,
  recBlob = null,
  recFrame = null;

function initRecorder() {
  const startBtn = document.getElementById("recStartBtn");
  const stopBtn = document.getElementById("recStopBtn");
  const playBtn = document.getElementById("recPlayBtn");
  const downloadBtn = document.getElementById("recDownloadBtn");
  const canvas = document.getElementById("recCanvas");
  if (!startBtn || !canvas) return;
  const ctx = canvas.getContext("2d");

  startBtn.addEventListener("click", async () => {
    try {
      recStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder = new MediaRecorder(recStream);
      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        recBlob = new Blob(chunks, { type: "audio/webm" });
        playBtn.disabled = false;
        downloadBtn.disabled = false;
      };
      mediaRecorder.start();
      startBtn.classList.add("recording");
      startBtn.textContent = "GRABANDO...";
      startBtn.disabled = true;
      stopBtn.disabled = false;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      const src = audioCtx.createMediaStreamSource(recStream);
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      function drawWave() {
        analyser.getByteFrequencyData(data);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const barW = canvas.width / data.length;
        for (let i = 0; i < data.length; i++) {
          const h = (data[i] / 255) * canvas.height;
          ctx.fillStyle = `rgba(154,203,107,${data[i] / 255})`;
          ctx.fillRect(i * barW, canvas.height - h, barW - 1, h);
        }
        recFrame = requestAnimationFrame(drawWave);
      }
      drawWave();
    } catch (e) {
      startBtn.textContent = "ERROR";
      setTimeout(() => {
        startBtn.textContent = "GRABAR";
      }, 2000);
    }
  });

  stopBtn.addEventListener("click", () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      recStream.getTracks().forEach((t) => t.stop());
      if (recFrame) cancelAnimationFrame(recFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      startBtn.classList.remove("recording");
      startBtn.textContent = "GRABAR";
      startBtn.disabled = false;
      stopBtn.disabled = true;
    }
  });

  playBtn.addEventListener("click", () => {
    if (!recBlob) return;
    const audio = new Audio(URL.createObjectURL(recBlob));
    audio.play().catch(() => {});
  });

  downloadBtn.addEventListener("click", () => {
    if (!recBlob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(recBlob);
    a.download = "duck-recording.webm";
    a.click();
  });
}

// ─── STATIONS ───────────────────────────────────────────
const stations = [
  {
    num: "01",
    name: "Vocal Booth",
    desc: "Grabación vocal con tratamiento acústico. Micrófono Neumann U87, preamp Avalon VT-737.",
    gear: "Neumann U87 · Avalon VT-737 · Auralex Acoustics",
  },
  {
    num: "02",
    name: "Production Desk",
    desc: "Estación principal de producción. Ableton Live Suite, 3 monitores, MIDI controller.",
    gear: "Ableton Live · Push 3 · Adam Audio A7V",
  },
  {
    num: "03",
    name: "Mix Station",
    desc: "Estación de mezcla con monitores de referencia. EQ dinámico, compresión paralela.",
    gear: "Logic Pro · Yamaha HS8 · SubPac",
  },
  {
    num: "04",
    name: "Mastering Suite",
    desc: "Masterización profesional. Loudness competitivo para Spotify y plataformas.",
    gear: "Ozone 11 · FabFilter Pro-L 2 · Sonarworks",
  },
  {
    num: "05",
    name: "Live Room",
    desc: "Sala de grabación en vivo. Batería acústica, amplificadores, instrumentos.",
    gear: "Pearl Export · Fender Twin · Shure SM57",
  },
  {
    num: "06",
    name: "Control Room",
    desc: "Sala de control y escucha. Referencia de mezcla en diferentes sistemas.",
    gear: "Avantone MixCubes · KRK Rokit · AirPods Check",
  },
];

function initStations() {
  const grid = document.getElementById("stationsGrid");
  if (!grid) return;
  stations.forEach((s) => {
    const card = document.createElement("div");
    card.className = "station-card rv";
    card.innerHTML = `<div class="station-num">${s.num}</div><div class="station-name">${s.name}</div><p class="station-desc">${s.desc}</p><p style="font-size:.5rem;color:var(--a);opacity:.6;margin-top:.5rem;">${s.gear}</p>`;
    grid.appendChild(card);
  });
}

// ─── CAROUSEL ───────────────────────────────────────────
function initCarousel() {
  const track = document.getElementById("carouselTrack");
  if (!track) return;
  const images = [
    "images/capa-1920x1080.jpg",
    "images/capa-3-1920x1080.jpg",
    "images/capa-4-1920x1080.jpg",
    "images/studio/setup-2-1920x1280.jpg",
    "images/studio/setup-3-1920x1280.jpg",
    "images/studio/setup-4-1920x1280.jpg",
    "images/studio/mix-3-1920x1280.jpg",
  ];
  images.forEach((src) => {
    const item = document.createElement("div");
    item.className = "c-item";
    item.innerHTML = `<img src="${src}" alt="Duck Studio" loading="lazy">`;
    track.appendChild(item);
  });
  // Duplicate for seamless loop
  images.forEach((src) => {
    const item = document.createElement("div");
    item.className = "c-item";
    item.innerHTML = `<img src="${src}" alt="Duck Studio" loading="lazy">`;
    track.appendChild(item);
  });
}

// ─── SYNTHESIZER ────────────────────────────────────────
let synthOsc = null,
  synthGain = null;

function initSynth() {
  const keys = document.getElementById("synthKeys");
  if (!keys) return;
  const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C5"];
  const freqs = {
    C4: 261.63,
    D4: 293.66,
    E4: 329.63,
    F4: 349.23,
    G4: 392,
    A4: 440,
    B4: 493.88,
    C5: 523.25,
  };
  notes.forEach((n) => {
    const key = document.createElement("div");
    key.className = "synth-key";
    key.textContent = n;
    key.addEventListener("mousedown", () => {
      if (audioCtx.state === "suspended") audioCtx.resume();
      synthOsc = audioCtx.createOscillator();
      synthGain = audioCtx.createGain();
      synthOsc.type = document.getElementById("synthWave")?.value || "sine";
      synthOsc.frequency.setValueAtTime(freqs[n], audioCtx.currentTime);
      synthGain.gain.setValueAtTime(
        ((document.getElementById("synthVol")?.value || 50) / 100) * 0.5,
        audioCtx.currentTime,
      );
      synthOsc.connect(synthGain);
      synthGain.connect(audioCtx.destination);
      synthOsc.start();
      key.classList.add("active");
    });
    const endNote = () => {
      if (synthOsc) {
        synthGain.gain.exponentialRampToValueAtTime(
          0.001,
          audioCtx.currentTime + 0.1,
        );
        synthOsc.stop(audioCtx.currentTime + 0.1);
        synthOsc = null;
      }
      key.classList.remove("active");
    };
    key.addEventListener("mouseup", endNote);
    key.addEventListener("mouseleave", endNote);
    key.addEventListener("touchstart", (e) => {
      e.preventDefault();
      key.dispatchEvent(new MouseEvent("mousedown"));
    });
    key.addEventListener("touchend", (e) => {
      e.preventDefault();
      key.dispatchEvent(new MouseEvent("mouseup"));
    });
    keys.appendChild(key);
  });
}

// ─── METRONOME ──────────────────────────────────────────
let metroInterval = null,
  metroBeat = 0;

function initMetronome() {
  const dots = document.getElementById("metroDots");
  const bpmDisplay = document.getElementById("metroBpm");
  const slider = document.getElementById("metroSlider");
  if (!dots) return;
  for (let i = 0; i < 4; i++) {
    const dot = document.createElement("div");
    dot.className = "metro-dot";
    dots.appendChild(dot);
  }
  const allDots = dots.querySelectorAll(".metro-dot");

  document.getElementById("metroStart")?.addEventListener("click", () => {
    if (metroInterval) return;
    if (audioCtx.state === "suspended") audioCtx.resume();
    const bpm = parseInt(slider?.value || 120);
    metroInterval = setInterval(() => {
      allDots.forEach((d, i) =>
        d.classList.toggle("active", i === metroBeat % 4),
      );
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(
        metroBeat % 4 === 0 ? 1000 : 800,
        audioCtx.currentTime,
      );
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        audioCtx.currentTime + 0.05,
      );
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
      metroBeat++;
    }, 60000 / bpm);
  });

  document.getElementById("metroStop")?.addEventListener("click", () => {
    clearInterval(metroInterval);
    metroInterval = null;
    metroBeat = 0;
    allDots.forEach((d) => d.classList.remove("active"));
  });

  slider?.addEventListener("input", () => {
    if (bpmDisplay) bpmDisplay.textContent = slider.value;
    if (metroInterval) {
      clearInterval(metroInterval);
      metroInterval = null;
      document.getElementById("metroStart")?.click();
    }
  });

  window.addEventListener("beforeunload", () => {
    if (metroInterval) clearInterval(metroInterval);
  });
}

// ─── LYRICS GENERATOR ───────────────────────────────────
const lyricsData = {
  trap: [
    "No para de subir, el flow no para",
    "Dinero en la cuenta, mente en la nube",
    "Desde abajo hasta arriba, sin parar",
    "El juego es mental, yo ya llegué",
  ],
  pop: [
    "Corazón que late fuerte por ti",
    "Bailamos bajo la luz de la luna",
    "Cada momento es especial",
    "Tu sonrisa ilumina mi día",
  ],
  mpb: [
    "Sol de Aracaju brilla en mi piel",
    "Mar e vento, ritmo do nordeste",
    "Saudade que mora no peito",
    "Amor de verdade não tem preço",
  ],
  rnb: [
    "Baby you light up my world",
    "Soul into the music, feel the vibe",
    "Late night sessions, studio lights",
    "Voice like honey, smooth like wine",
  ],
};

function initLyrics() {
  const btns = document.getElementById("lyricsBtns");
  const output = document.getElementById("lyricsOutput");
  const generate = document.getElementById("lyricsGenerate");
  if (!btns || !output) return;
  let selectedGenre = "trap";
  Object.keys(lyricsData).forEach((genre) => {
    const btn = document.createElement("button");
    btn.className = "lyrics-btn" + (genre === "trap" ? " active" : "");
    btn.textContent = genre.toUpperCase();
    btn.addEventListener("click", () => {
      btns
        .querySelectorAll(".lyrics-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      selectedGenre = genre;
    });
    btns.appendChild(btn);
  });
  generate?.addEventListener("click", () => {
    const lines = lyricsData[selectedGenre];
    const shuffled = lines.sort(() => Math.random() - 0.5).slice(0, 3);
    output.innerHTML = shuffled.map((l) => `"${l}"`).join("<br><br>");
  });
}

// ─── INIT ALL ───────────────────────────────────────────
function initInstruments() {
  renderSingles();
  initPiano();
  initXylo();
  initDrums();
  initRecorder();
  initStations();
  initCarousel();
  initSynth();
  initMetronome();
  initLyrics();
}
