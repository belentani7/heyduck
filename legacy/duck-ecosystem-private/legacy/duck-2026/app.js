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
        setStatus("Este item no tiene preview oficial");
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
      <article class="stat-card" style="--card-accent:${statPalette[index % statPalette.length]}">
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
          <div class="release-disc"><img src="images/logo-768x768.png" alt=""></div>
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
        <div class="catalog-disc"><img src="images/logo-768x768.png" alt=""></div>
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
        <p>${escapeHTML(service.description.split(".")[0])}.</p>
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

  renderHeroMeta();
  renderStatsBand();
  renderFeaturedReleases();
  renderCatalog();
  renderLicenses();
  renderServices();
  renderStudio();
  renderGear();
  renderTestimonials();

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
      gsap.to(".logo-object", { rotateY: 360, duration: 18, repeat: -1, ease: "none" });
      gsap.to(".orbit-a", { rotateZ: 372, duration: 24, repeat: -1, ease: "none" });
      gsap.to(".orbit-b", { rotateZ: -388, duration: 31, repeat: -1, ease: "none" });
      gsap.to(".hero-orbit", { yPercent: 34, scale: 0.84, scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1 } });
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

      gsap.from(".gear-card, .testimonial-card", {
        y: 30,
        autoAlpha: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: motionEase,
        scrollTrigger: { trigger: ".ecosystem", start: "top 70%" }
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
      const x = (event.clientX / window.innerWidth - 0.5) * 18;
      const y = (event.clientY / window.innerHeight - 0.5) * -14;
      gsap.to(".hero-orbit", { rotateY: x, rotateX: y, duration: 1, ease: motionEase, overwrite: "auto" });
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
