(() => {
  "use strict";

  if (!window.DUCK_DATA) {
    return;
  }

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const releaseStack = document.querySelector("#releaseStack");
  const catalogGrid = document.querySelector("#catalogGrid");
  const licenseGrid = document.querySelector("#licenseGrid");
  const serviceList = document.querySelector("#serviceList");
  const statsBand = document.querySelector("#statsBand");
  const studioCards = document.querySelector("#studioCards");
  const gearGrid = document.querySelector("#gearGrid");
  const testimonialStack = document.querySelector("#testimonialStack");
  const heroMeta = document.querySelector("#heroMeta");
  const soundToggle = document.querySelector("#soundToggle");
  const soundLabel = soundToggle.querySelector(".sound-label");
  const previewStatus = document.querySelector("#previewStatus");

  const previewById = new Map(DUCK_DATA.singles.map((release) => [String(release.id), release]));
  const featuredReleases = DUCK_DATA.singles.filter((release) => release.preview).slice(0, 4);

  const palette = ["#b7ff45", "#6bf2b1", "#d2ee72", "#82c976"];
  const statPalette = ["#b7ff45", "#84dd98", "#d7f277", "#9fd46d"];

  let soundEnabled = false;
  let activeAudio = null;
  let activeCard = null;
  let stopTimer = 0;
  let touchScrubbing = false;
  let motionEase = "power3.out";

  const escapeHTML = (value) => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;"
  })[character]);

  const formatShort = (value) => {
    if (!Number.isFinite(value)) return String(value);
    if (value >= 1e6) return `${(value / 1e6).toFixed(value % 1e6 === 0 ? 0 : 1).replace(/\.0$/, "")}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(value % 1e3 === 0 ? 0 : 1).replace(/\.0$/, "")}K`;
    return String(value);
  };

  const createWave = (count = 28) => Array.from({ length: count }, (_, index) =>
    `<i style="--i:${index};height:${18 + ((index * 37) % 66)}%"></i>`
  ).join("");

  const setStatus = (message, persistent = false) => {
    previewStatus.textContent = message;
    previewStatus.classList.add("visible");
    window.clearTimeout(setStatus.timer);
    if (!persistent) {
      setStatus.timer = window.setTimeout(() => previewStatus.classList.remove("visible"), 2600);
    }
  };

  const syncCardState = (card, playing) => {
    if (!card) return;
    card.classList.toggle("is-playing", playing);
    card.setAttribute("aria-pressed", String(playing));

    const actionLabel = card.querySelector(".release-action span, .catalog-action span");
    const actionIcon = card.querySelector(".release-action b, .catalog-action b");

    if (actionLabel && actionIcon) {
      if (playing) {
        actionLabel.textContent = "Reproduzindo preview";
        actionIcon.textContent = "Ⅱ";
      } else {
        actionLabel.textContent = card.dataset.preview === "true" ? "Pressione para ouvir" : "Abrir lançamento";
        actionIcon.textContent = card.dataset.preview === "true" ? "▶" : "↗";
      }
    }
  };

  const stopPreview = (announce = false) => {
    window.clearTimeout(stopTimer);

    if (!activeAudio) {
      if (announce) setStatus("Preview pausado");
      return;
    }

    const audio = activeAudio;
    const card = activeCard;
    activeAudio = null;
    activeCard = null;

    if (window.gsap) {
      gsap.to(audio, {
        volume: 0,
        duration: 0.24,
        onComplete: () => {
          audio.pause();
          audio.src = "";
        }
      });
    } else {
      audio.pause();
      audio.src = "";
    }

    syncCardState(card, false);

    if (announce) {
      setStatus("Preview pausado");
    }
  };

  const playRelease = async (release, card, sticky = false) => {
    if (!release.preview) {
      if (release.link && release.link !== "#") {
        window.open(release.link, "_blank", "noopener,noreferrer");
        setStatus(`Abrindo ${release.title}`);
      } else {
        setStatus("Este item não tem preview oficial");
      }
      return;
    }

    if (!soundEnabled) {
      setStatus("Ative os previews no topo", true);
      return;
    }

    if (card === activeCard && activeAudio && !activeAudio.paused) {
      return;
    }

    stopPreview();

    const audio = new Audio(release.preview);
    audio.preload = "none";
    audio.volume = 0;
    activeAudio = audio;
    activeCard = card;

    syncCardState(card, true);
    setStatus(`Agora: ${release.title} · ${release.artist}`, true);

    try {
      await audio.play();
      if (window.gsap) {
        gsap.to(audio, { volume: 0.82, duration: 0.5, ease: motionEase });
      } else {
        audio.volume = 0.82;
      }
      window.clearTimeout(stopTimer);
      stopTimer = window.setTimeout(() => stopPreview(true), sticky ? 24000 : 18000);
      audio.addEventListener("ended", () => stopPreview(), { once: true });
    } catch (error) {
      stopPreview();
      setStatus("Preview indisponível nesta conexão");
    }
  };

  const bindPlayback = (card, release, options = {}) => {
    const { allowLink = false } = options;

    card.dataset.releaseId = String(release.id);
    card.dataset.preview = String(Boolean(release.preview));
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");
    card.setAttribute("aria-label", `${release.title}, ${release.artist}. ${release.preview ? "Ativar preview." : "Abrir lançamento."}`);

    card.addEventListener("pointerenter", (event) => {
      if (event.pointerType === "mouse" && release.preview) {
        playRelease(release, card, true);
      }
    });

    card.addEventListener("pointerdown", (event) => {
      touchScrubbing = event.pointerType !== "mouse";
      if (release.preview) {
        if (!soundEnabled) {
          setSound(true);
        }
        playRelease(release, card, true);
        return;
      }

      if (allowLink && release.link && release.link !== "#") {
        window.open(release.link, "_blank", "noopener,noreferrer");
      } else {
        setStatus("Sem preview oficial");
      }
    });

    card.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();

      if (release.preview) {
        if (!soundEnabled) {
          setSound(true);
        }
        if (activeCard === card) {
          stopPreview(true);
        } else {
          playRelease(release, card, true);
        }
        return;
      }

      if (allowLink && release.link && release.link !== "#") {
        window.open(release.link, "_blank", "noopener,noreferrer");
      } else {
        setStatus("Sem preview oficial");
      }
    });

    card.addEventListener("pointermove", (event) => {
      if (!window.gsap || reducedMotion || event.pointerType !== "mouse") return;
      const box = card.getBoundingClientRect();
      const rotateY = ((event.clientX - box.left) / box.width - 0.5) * 5;
      const rotateX = ((event.clientY - box.top) / box.height - 0.5) * -5;
      gsap.to(card, { rotateX, rotateY, duration: 0.55, ease: motionEase, overwrite: "auto" });
    });

    card.addEventListener("pointerleave", (event) => {
      if (window.gsap && !reducedMotion) {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: motionEase });
      }
      if (event.pointerType === "mouse" && activeCard === card) {
        stopPreview();
      }
    });
  };

  const renderHeroMeta = () => {
    const items = [
      { value: `${formatShort(DUCK_DATA.stats.streams)}`, label: "streams" },
      { value: `${DUCK_DATA.stats.releases}+`, label: "lançamentos" },
      { value: `${DUCK_DATA.stats.yearsActive}+`, label: "anos ativos" },
      { value: DUCK_DATA.status, label: DUCK_DATA.location }
    ];

    heroMeta.innerHTML = items.map((item, index) => `
      <div class="meta-chip" style="--chip:${statPalette[index % statPalette.length]}">
        <strong>${escapeHTML(item.value)}</strong>
        <span>${escapeHTML(item.label)}</span>
      </div>
    `).join("");
  };

  const renderStatsBand = () => {
    const items = [
      { value: formatShort(DUCK_DATA.stats.streams), label: "streams acumulados" },
      { value: `${DUCK_DATA.stats.releases}+`, label: "lançamentos oficiais" },
      { value: `${DUCK_DATA.stats.yearsActive}+`, label: "anos de estrada" },
      { value: formatShort(DUCK_DATA.stats.followers), label: "seguidores no radar" }
    ];

    statsBand.innerHTML = items.map((item, index) => `
      <article class="stat-card" role="listitem" style="--card-accent:${statPalette[index % statPalette.length]}">
        <strong>${escapeHTML(item.value)}</strong>
        <span>${escapeHTML(item.label)}</span>
      </article>
    `).join("");
  };

  const renderFeaturedReleases = () => {
    releaseStack.innerHTML = "";

    featuredReleases.forEach((release, index) => {
      const card = document.createElement("article");
      card.className = "release-card";
      card.style.setProperty("--card-accent", palette[index % palette.length]);
      card.innerHTML = `
        <div class="release-visual" aria-hidden="true">
          <span class="release-index">0${index + 1} / 0${featuredReleases.length}</span>
          <div class="release-disc"><img src="${escapeHTML(release.cover)}" alt="Capa de ${escapeHTML(release.title)}" loading="lazy"></div>
          <div class="wave">${createWave()}</div>
        </div>
        <div class="release-info">
          <span class="release-type">${escapeHTML(release.type)} · preview oficial</span>
          <h3>${escapeHTML(release.title)}</h3>
          <p class="release-artist">${escapeHTML(release.artist)}</p>
          <div class="release-details">
            <span>${escapeHTML(release.genre)}</span>
            <span>${escapeHTML(release.bpm)}</span>
            <span>${escapeHTML(release.key)}</span>
          </div>
          <div class="release-action">
            <span>Pressione para ouvir</span>
            <b aria-hidden="true">▶</b>
          </div>
        </div>`;

      releaseStack.appendChild(card);
      bindPlayback(card, release);
    });
  };

  const renderCatalog = () => {
    catalogGrid.innerHTML = "";

    DUCK_DATA.singles.forEach((release, index) => {
      const card = document.createElement("article");
      card.className = "catalog-card";
      card.classList.toggle("is-locked", !release.preview);
      card.innerHTML = `
        <div class="catalog-head">
          <span class="catalog-index">0${index + 1}</span>
          <span class="catalog-type">${escapeHTML(release.preview ? "Preview" : "Link")}</span>
        </div>
        <div class="catalog-disc"><img src="${escapeHTML(release.cover)}" alt="Capa de ${escapeHTML(release.title)}" loading="lazy"></div>
        <div class="catalog-body">
          <h3>${escapeHTML(release.title)}</h3>
          <p class="catalog-artist">${escapeHTML(release.artist)}</p>
          <div class="catalog-tags">
            <span>${escapeHTML(release.genre)}</span>
            <span>${escapeHTML(release.bpm)}</span>
          </div>
        </div>
        <div class="catalog-action">
          <span>${escapeHTML(release.preview ? "Ouvir preview" : "Abrir lançamento")}</span>
          <b aria-hidden="true">${release.preview ? "▶" : "↗"}</b>
        </div>`;

      catalogGrid.appendChild(card);
      bindPlayback(card, release, { allowLink: true });
    });
  };

  const renderLicenses = () => {
    licenseGrid.innerHTML = DUCK_DATA.beatStore.map((license) => `
      <article class="license-card">
        <div class="license-price">${escapeHTML(license.price)}</div>
        <h3>${escapeHTML(license.name)}</h3>
        <p>${escapeHTML(license.features[0])}</p>
        <ul class="license-features">
          ${license.features.map((feature) => `<li>${escapeHTML(feature)}</li>`).join("")}
        </ul>
      </article>
    `).join("");
  };

  const renderServices = () => {
    serviceList.innerHTML = DUCK_DATA.services.map((service, index) => `
      <article class="service-item">
        <span>0${index + 1}</span>
        <h3>${escapeHTML(service.title)}</h3>
        <p>${escapeHTML(service.description)}</p>
      </article>
    `).join("");
  };

  const renderStudio = () => {
    studioCards.innerHTML = DUCK_DATA.stations.map((station, index) => `
      <article class="studio-card">
        <img src="${escapeHTML(station.image)}" alt="${escapeHTML(station.name)}" loading="lazy" width="1440" height="960">
        <div class="studio-copy">
          <span>Estação 0${index + 1}</span>
          <h3>${escapeHTML(station.name)}</h3>
          <p>${escapeHTML(station.description)}</p>
          <ul>${station.specs.map((spec) => `<li>${escapeHTML(spec)}</li>`).join("")}</ul>
        </div>
      </article>
    `).join("");
  };

  const renderGear = () => {
    gearGrid.innerHTML = Object.entries(DUCK_DATA.gear).map(([category, items]) => `
      <article class="gear-card">
        <span>${escapeHTML(category)}</span>
        <strong>${escapeHTML(category.replace(/([a-z])([A-Z])/g, "$1 $2"))}</strong>
        <ul class="gear-list">
          ${items.map((item) => `<li>${escapeHTML(item.name)} · ${escapeHTML(item.type)}</li>`).join("")}
        </ul>
      </article>
    `).join("");
  };

  const renderTestimonials = () => {
    testimonialStack.innerHTML = DUCK_DATA.testimonials.map((testimonial) => `
      <article class="testimonial-card">
        <blockquote>“${escapeHTML(testimonial.quote)}”</blockquote>
        <div class="testimonial-author">${escapeHTML(testimonial.author)} · ${escapeHTML(testimonial.track)}</div>
      </article>
    `).join("");
  };

  const initDuckLab = () => {
    const sequenceGrid = document.querySelector("#sequenceGrid");
    const sequenceToggle = document.querySelector("#sequenceToggle");
    const sequenceRandom = document.querySelector("#sequenceRandom");
    const sequenceClear = document.querySelector("#sequenceClear");
    const bpmControl = document.querySelector("#bpmControl");
    const bpmValue = document.querySelector("#bpmValue");
    const waveControl = document.querySelector("#waveControl");
    const synthKeys = document.querySelector("#synthKeys");
    const scope = document.querySelector("#labScope");
    const labStatus = document.querySelector("#labStatus");
    const labClock = document.querySelector("#labClock");
    const recordToggle = document.querySelector("#recordToggle");
    const recordDiscard = document.querySelector("#recordDiscard");
    const recordState = document.querySelector("#recordState");
    const recordPlayback = document.querySelector("#recordPlayback");

    if (!sequenceGrid || !scope) return;

    const tracks = [
      { id: "kick", label: "KICK" },
      { id: "snare", label: "SNARE" },
      { id: "hat", label: "HAT" }
    ];
    const notes = [
      { key: "a", label: "C", frequency: 261.63 },
      { key: "s", label: "D", frequency: 293.66 },
      { key: "d", label: "E", frequency: 329.63 },
      { key: "f", label: "F", frequency: 349.23 },
      { key: "g", label: "G", frequency: 392 },
      { key: "h", label: "A", frequency: 440 },
      { key: "j", label: "B", frequency: 493.88 },
      { key: "k", label: "C2", frequency: 523.25 }
    ];
    const pattern = {
      kick: [true, false, false, false, true, false, false, false],
      snare: [false, false, true, false, false, false, true, false],
      hat: [true, false, true, false, true, false, true, false]
    };

    let labContext = null;
    let masterGain = null;
    let analyser = null;
    let sequenceTimer = 0;
    let sequenceStep = -1;
    let mediaRecorder = null;
    let recorderStream = null;
    let recordingChunks = [];
    let recordingUrl = "";

    const updateLabStatus = (message) => {
      labStatus.textContent = message;
    };

    const ensureAudio = async () => {
      if (!labContext) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) throw new Error("Web Audio indisponível");
        labContext = new AudioContext();
        masterGain = labContext.createGain();
        analyser = labContext.createAnalyser();
        analyser.fftSize = 256;
        masterGain.gain.value = 0.58;
        masterGain.connect(analyser);
        analyser.connect(labContext.destination);
      }
      if (labContext.state === "suspended") await labContext.resume();
      return labContext;
    };

    const createNoise = (duration) => {
      const buffer = labContext.createBuffer(1, labContext.sampleRate * duration, labContext.sampleRate);
      const channel = buffer.getChannelData(0);
      for (let index = 0; index < channel.length; index += 1) {
        channel[index] = Math.random() * 2 - 1;
      }
      const source = labContext.createBufferSource();
      source.buffer = buffer;
      return source;
    };

    const playDrum = async (type) => {
      try {
        const context = await ensureAudio();
        const now = context.currentTime;

        if (type === "kick") {
          const oscillator = context.createOscillator();
          const gain = context.createGain();
          oscillator.frequency.setValueAtTime(145, now);
          oscillator.frequency.exponentialRampToValueAtTime(42, now + .16);
          gain.gain.setValueAtTime(.9, now);
          gain.gain.exponentialRampToValueAtTime(.0001, now + .34);
          oscillator.connect(gain).connect(masterGain);
          oscillator.start(now);
          oscillator.stop(now + .35);
        } else {
          const noise = createNoise(type === "snare" ? .22 : .07);
          const filter = context.createBiquadFilter();
          const gain = context.createGain();
          filter.type = "highpass";
          filter.frequency.value = type === "snare" ? 1200 : 6500;
          gain.gain.setValueAtTime(type === "snare" ? .34 : .17, now);
          gain.gain.exponentialRampToValueAtTime(.0001, now + (type === "snare" ? .2 : .06));
          noise.connect(filter).connect(gain).connect(masterGain);
          noise.start(now);
        }
      } catch (error) {
        updateLabStatus(error.message);
      }
    };

    const playNote = async (note, keyButton) => {
      try {
        const context = await ensureAudio();
        const now = context.currentTime;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        const filter = context.createBiquadFilter();
        oscillator.type = waveControl.value;
        oscillator.frequency.value = note.frequency;
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(2200, now);
        filter.frequency.exponentialRampToValueAtTime(620, now + .42);
        gain.gain.setValueAtTime(.0001, now);
        gain.gain.exponentialRampToValueAtTime(.34, now + .018);
        gain.gain.exponentialRampToValueAtTime(.0001, now + .48);
        oscillator.connect(filter).connect(gain).connect(masterGain);
        oscillator.start(now);
        oscillator.stop(now + .5);
        keyButton.classList.add("is-playing");
        window.setTimeout(() => keyButton.classList.remove("is-playing"), 180);
        updateLabStatus(`Nota ${note.label} · ${waveControl.value}`);
      } catch (error) {
        updateLabStatus(error.message);
      }
    };

    sequenceGrid.innerHTML = tracks.map((track) => `
      <div class="sequence-row" data-track="${track.id}">
        <span class="sequence-label">${track.label}</span>
        ${pattern[track.id].map((active, index) => `
          <button class="sequence-step${active ? " is-active" : ""}" type="button" data-step="${index}" aria-pressed="${active}" aria-label="${track.label}, passo ${index + 1}"></button>
        `).join("")}
      </div>
    `).join("");

    synthKeys.innerHTML = notes.map((note) => `
      <button class="synth-key" type="button" data-key="${note.key}" aria-label="Tocar nota ${note.label}">${note.label}<br>${note.key.toUpperCase()}</button>
    `).join("");

    const setStep = (button, enabled) => {
      const row = button.closest(".sequence-row");
      const track = row.dataset.track;
      const step = Number(button.dataset.step);
      pattern[track][step] = enabled;
      button.classList.toggle("is-active", enabled);
      button.setAttribute("aria-pressed", String(enabled));
      if (enabled) playDrum(track);
    };

    sequenceGrid.addEventListener("click", (event) => {
      const button = event.target.closest(".sequence-step");
      if (!button) return;
      setStep(button, !button.classList.contains("is-active"));
    });

    const tickSequence = () => {
      sequenceStep = (sequenceStep + 1) % 8;
      sequenceGrid.querySelectorAll(".sequence-step").forEach((button) => {
        button.classList.toggle("is-current", Number(button.dataset.step) === sequenceStep);
      });
      tracks.forEach((track) => {
        if (pattern[track.id][sequenceStep]) playDrum(track.id);
      });
    };

    const stopSequence = () => {
      window.clearInterval(sequenceTimer);
      sequenceTimer = 0;
      sequenceStep = -1;
      sequenceToggle.setAttribute("aria-pressed", "false");
      sequenceToggle.textContent = "Iniciar sequência";
      sequenceGrid.querySelectorAll(".sequence-step").forEach((button) => button.classList.remove("is-current"));
    };

    const startSequence = async () => {
      try {
        await ensureAudio();
        stopPreview();
        const interval = 60000 / Number(bpmControl.value) / 2;
        sequenceToggle.setAttribute("aria-pressed", "true");
        sequenceToggle.textContent = "Parar sequência";
        tickSequence();
        sequenceTimer = window.setInterval(tickSequence, interval);
        updateLabStatus(`Sequência ativa · ${bpmControl.value} BPM`);
      } catch (error) {
        updateLabStatus(error.message);
      }
    };

    sequenceToggle.addEventListener("click", () => {
      if (sequenceTimer) {
        stopSequence();
        updateLabStatus("Sequência parada");
      } else {
        startSequence();
      }
    });

    sequenceRandom.addEventListener("click", () => {
      tracks.forEach((track) => {
        pattern[track.id] = pattern[track.id].map((value, index) => {
          if (track.id === "snare" && (index === 2 || index === 6)) return true;
          return Math.random() > (track.id === "hat" ? .42 : .7);
        });
      });
      sequenceGrid.querySelectorAll(".sequence-step").forEach((button) => {
        const track = button.closest(".sequence-row").dataset.track;
        const enabled = pattern[track][Number(button.dataset.step)];
        button.classList.toggle("is-active", enabled);
        button.setAttribute("aria-pressed", String(enabled));
      });
      updateLabStatus("Novo ritmo gerado");
    });

    sequenceClear.addEventListener("click", () => {
      tracks.forEach((track) => pattern[track.id].fill(false));
      sequenceGrid.querySelectorAll(".sequence-step").forEach((button) => {
        button.classList.remove("is-active");
        button.setAttribute("aria-pressed", "false");
      });
      updateLabStatus("Matriz limpa");
    });

    bpmControl.addEventListener("input", () => {
      bpmValue.textContent = `${bpmControl.value} BPM`;
      if (sequenceTimer) {
        stopSequence();
        startSequence();
      }
    });

    synthKeys.addEventListener("pointerdown", (event) => {
      const button = event.target.closest(".synth-key");
      if (!button) return;
      const note = notes.find((item) => item.key === button.dataset.key);
      playNote(note, button);
    });

    document.addEventListener("keydown", (event) => {
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;
      const note = notes.find((item) => item.key === event.key.toLowerCase());
      if (!note) return;
      const button = synthKeys.querySelector(`[data-key="${note.key}"]`);
      playNote(note, button);
    });

    const discardRecording = () => {
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      recordingUrl = "";
      recordPlayback.removeAttribute("src");
      recordPlayback.hidden = true;
      recordDiscard.disabled = true;
      recordState.textContent = "PRONTO";
      updateLabStatus("Gravação descartada localmente");
    };

    const stopRecording = () => {
      if (mediaRecorder?.state === "recording") mediaRecorder.stop();
      recorderStream?.getTracks().forEach((track) => track.stop());
      recorderStream = null;
      recordToggle.setAttribute("aria-pressed", "false");
      recordToggle.textContent = "Gravar ideia";
    };

    recordToggle.addEventListener("click", async () => {
      if (mediaRecorder?.state === "recording") {
        stopRecording();
        return;
      }
      if (!navigator.mediaDevices?.getUserMedia || !window.MediaRecorder) {
        updateLabStatus("Gravação indisponível neste navegador ou contexto");
        return;
      }
      try {
        discardRecording();
        recorderStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        recordingChunks = [];
        mediaRecorder = new MediaRecorder(recorderStream);
        mediaRecorder.addEventListener("dataavailable", (event) => {
          if (event.data.size) recordingChunks.push(event.data);
        });
        mediaRecorder.addEventListener("stop", () => {
          const blob = new Blob(recordingChunks, { type: mediaRecorder.mimeType || "audio/webm" });
          recordingUrl = URL.createObjectURL(blob);
          recordPlayback.src = recordingUrl;
          recordPlayback.hidden = false;
          recordDiscard.disabled = false;
          recordState.textContent = "CAPTURADO";
          updateLabStatus("Ideia capturada · arquivo mantido apenas nesta sessão");
        }, { once: true });
        mediaRecorder.start();
        recordToggle.setAttribute("aria-pressed", "true");
        recordToggle.textContent = "Parar gravação";
        recordState.textContent = "GRAVANDO";
        updateLabStatus("Microfone ativo · gravação local em curso");
      } catch (error) {
        recordState.textContent = "BLOQUEADO";
        updateLabStatus("Permissão de microfone não concedida");
      }
    });

    recordDiscard.addEventListener("click", discardRecording);

    const scopeContext = scope.getContext("2d");
    const drawScope = () => {
      const width = scope.width;
      const height = scope.height;
      scopeContext.clearRect(0, 0, width, height);
      scopeContext.lineWidth = 3;
      scopeContext.strokeStyle = "#b7ff45";
      scopeContext.beginPath();
      const data = new Uint8Array(analyser?.frequencyBinCount || 128);
      if (analyser) analyser.getByteTimeDomainData(data);
      for (let index = 0; index < data.length; index += 1) {
        const x = index / (data.length - 1) * width;
        const idle = 128 + Math.sin(index * .19 + performance.now() * .0015) * 2;
        const y = ((analyser ? data[index] : idle) / 255) * height;
        if (index === 0) scopeContext.moveTo(x, y); else scopeContext.lineTo(x, y);
      }
      scopeContext.stroke();
      requestAnimationFrame(drawScope);
    };
    drawScope();

    const updateClock = () => {
      labClock.textContent = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    };
    updateClock();
    window.setInterval(updateClock, 1000);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        stopSequence();
        stopRecording();
      }
    });

    window.addEventListener("beforeunload", () => {
      stopSequence();
      stopRecording();
      if (recordingUrl) URL.revokeObjectURL(recordingUrl);
      labContext?.close();
    }, { once: true });
  };

  const setSound = (enabled) => {
    soundEnabled = enabled;
    soundToggle.setAttribute("aria-pressed", String(enabled));
    document.body.classList.toggle("sound-on", enabled);
    soundLabel.textContent = enabled ? "Previews ativos" : "Ativar previews";

    if (enabled) {
      setStatus("Previews ativos · passe o dedo ou o mouse sobre um card");
    } else {
      stopPreview();
      setStatus("Som desativado");
    }
  };

  const initPressKit = () => {
    const copyButton = document.querySelector("#copyBio");
    const printButton = document.querySelector("#printPressKit");
    const bio = document.querySelector("#pressBioShort");
    const status = document.querySelector("#pressStatus");

    if (!copyButton || !printButton || !bio || !status) return;

    const copyWithFallback = () => {
      const textarea = document.createElement("textarea");
      textarea.value = bio.textContent.trim();
      textarea.setAttribute("readonly", "");
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      textarea.remove();
      return copied;
    };

    copyButton.addEventListener("click", async () => {
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(bio.textContent.trim());
        } else if (!copyWithFallback()) {
          throw new Error("Clipboard unavailable");
        }
        status.textContent = "Bio copiada.";
      } catch {
        status.textContent = copyWithFallback()
          ? "Bio copiada."
          : "Selecione a bio e copie manualmente.";
      }
    });

    printButton.addEventListener("click", () => window.print());
  };

  renderHeroMeta();
  renderStatsBand();
  renderFeaturedReleases();
  renderCatalog();
  renderLicenses();
  renderServices();
  renderStudio();
  renderGear();
  renderTestimonials();
  initDuckLab();
  initPressKit();

  soundToggle.addEventListener("click", () => setSound(!soundEnabled));

  document.addEventListener("pointermove", (event) => {
    if (!touchScrubbing) return;
    const card = document.elementFromPoint(event.clientX, event.clientY)?.closest(".release-card, .catalog-card");
    if (!card || card === activeCard || card.dataset.preview !== "true") return;
    const release = previewById.get(card.dataset.releaseId);
    if (release) {
      playRelease(release, card, true);
    }
  }, { passive: true });

  document.addEventListener("pointerup", () => {
    touchScrubbing = false;
  }, { passive: true });

  document.addEventListener("pointercancel", () => {
    touchScrubbing = false;
  }, { passive: true });

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopPreview();
    }
  });

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    if (window.CustomEase) {
      gsap.registerPlugin(CustomEase);
      CustomEase.create("duck", "M0,0 C0.16,1 0.3,1 1,1");
      motionEase = "duck";
    }

    const animationContext = gsap.context(() => {
      gsap.from(".hero-copy .eyebrow", { y: 24, autoAlpha: 0, duration: 0.8, ease: motionEase });
      gsap.from("#heroTitle span", { yPercent: 120, rotate: 3, autoAlpha: 0, duration: 1.1, stagger: 0.1, ease: motionEase });
      gsap.from(".hero-lead, .hero-actions", { y: 26, autoAlpha: 0, duration: 0.8, stagger: 0.06, delay: 0.35, ease: motionEase });
      gsap.from(".hero-meta", { y: 24, autoAlpha: 0, duration: 0.8, delay: 0.55, ease: motionEase });
      gsap.to(".hero-portrait", { yPercent: 8, scale: 1.04, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
      gsap.to(".scroll-progress span", { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.2 } });

      gsap.utils.toArray(".release-card").forEach((card, index) => {
        gsap.from(card, {
          y: 100,
          rotateX: 12,
          scale: 0.94,
          autoAlpha: 0,
          ease: motionEase,
          scrollTrigger: { trigger: card, start: "top 86%", end: "top 34%", scrub: 0.7 }
        });

        if (index < featuredReleases.length - 1) {
          gsap.to(card, {
            scale: 0.92,
            filter: "brightness(.7)",
            ease: "none",
            scrollTrigger: { trigger: card.nextElementSibling, start: "top 82%", end: "top 22%", scrub: true }
          });
        }
      });

      gsap.from(".catalog-card", {
        y: 48,
        autoAlpha: 0,
        duration: 0.85,
        stagger: 0.05,
        ease: motionEase,
        scrollTrigger: { trigger: ".catalog-grid", start: "top 75%" }
      });

      gsap.from(".artist-copy > p, .artist-facts > div, .artist-timeline li", {
        y: 32,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.07,
        ease: motionEase,
        scrollTrigger: { trigger: ".artist-story", start: "top 68%" }
      });

      gsap.from(".artist-portrait", {
        clipPath: "inset(0 0 100% 0)",
        y: 54,
        duration: 1.1,
        stagger: 0.12,
        ease: motionEase,
        scrollTrigger: { trigger: ".artist-portraits", start: "top 78%" }
      });

      gsap.from(".license-card", {
        y: 40,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: motionEase,
        scrollTrigger: { trigger: ".license-grid", start: "top 75%" }
      });

      gsap.from(".service-item", {
        x: 60,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".service-list", start: "top 78%" }
      });

      gsap.from(".stat-card", {
        y: 28,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.7,
        ease: motionEase,
        scrollTrigger: { trigger: ".stats-band", start: "top 82%" }
      });

      gsap.from(".studio-card", {
        y: 32,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".studio", start: "top 70%" }
      });

      gsap.from(".lab-module", {
        y: 42,
        autoAlpha: 0,
        stagger: 0.09,
        duration: 0.9,
        ease: motionEase,
        scrollTrigger: { trigger: ".duck-lab", start: "top 68%" }
      });

      gsap.from(".work-route, .brief-flow li", {
        y: 36,
        autoAlpha: 0,
        stagger: 0.07,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".work-with", start: "top 70%" }
      });

      gsap.from(".gear-card, .testimonial-card", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".ecosystem", start: "top 70%" }
      });

      gsap.from(".press-bio, .press-facts, .press-photo, .palette-swatches > div", {
        y: 34,
        autoAlpha: 0,
        stagger: 0.06,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".press-kit", start: "top 72%" }
      });

      gsap.from(".contact-logo", { scale: 0.7, rotate: -18, autoAlpha: 0, duration: 1.05, ease: motionEase, scrollTrigger: { trigger: ".contact", start: "top 60%" } });

      ScrollTrigger.matchMedia({
        "(min-width: 1081px) and (prefers-reduced-motion: no-preference)": () => {
          const distance = () => Math.max(0, studioCards.scrollWidth - window.innerWidth + 96);

          gsap.to(studioCards, {
            x: () => -distance(),
            ease: "none",
            scrollTrigger: {
              trigger: ".studio",
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 1,
              pin: true,
              invalidateOnRefresh: true
            }
          });
        }
      });
    });

    const hero = document.querySelector(".hero");
    hero.addEventListener("pointermove", (event) => {
      if (reducedMotion || event.pointerType !== "mouse") return;
      const x = (event.clientX / window.innerWidth - 0.5) * 12;
      const y = (event.clientY / window.innerHeight - 0.5) * -8;
      gsap.to(".hero-portrait img", { x, y, duration: 1, ease: motionEase, overwrite: "auto" });
    });

    window.addEventListener("beforeunload", () => animationContext.revert(), { once: true });
  }

  if (window.Lenis && !reducedMotion) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 0.85, touchMultiplier: 1.15 });
    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    if (window.ScrollTrigger) {
      lenis.on("scroll", ScrollTrigger.update);
    }
  }

  const header = document.querySelector(".site-header");
  if (window.ScrollTrigger) {
    ScrollTrigger.create({
      start: 40,
      onToggle: (self) => header.classList.toggle("scrolled", self.isActive)
    });
  } else {
    header.classList.add("scrolled");
  }
})();
