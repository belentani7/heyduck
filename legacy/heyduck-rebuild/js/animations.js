/**
 * DUCK - Animations Module v2.0
 * GSAP animations, scroll effects, cursor, reveals
 */

// Wait for GSAP to load
if (typeof gsap === "undefined") {
  console.warn("GSAP not loaded");
}

// ─── CURSOR SYSTEM ────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById("cursorDot");
  const ring = document.getElementById("cursorRing");
  if (!dot || !ring) return;
  if (window.matchMedia("(max-width: 768px)").matches) return;

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states
  const hoverElements =
    "a, button, .gal-i, .gallery-item, .s-card, .tc, .track-card, .btn-primary, .btn-secondary, .filter-btn, .contact-link, .langs button, .process-dot";

  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(hoverElements)) {
      ring.classList.add("active");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(hoverElements)) {
      ring.classList.remove("active");
    }
  });
}

// ─── MAGNETIC BUTTONS ────────────────────────────────────
function initMagnetic() {
  document
    .querySelectorAll(
      ".btn-primary, .btn-secondary, .langs button, .nav-links a",
    )
    .forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.3;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.3;
        gsap.to(el, { x, y, duration: 0.3, ease: "power2.out" });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1,.5)" });
      });
    });
}

// ─── SCROLL PROGRESS BAR ─────────────────────────────────
function initScrollProgress() {
  const bar = document.getElementById("scrollProgress");
  if (!bar) return;
  gsap.to(bar, {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3,
    },
  });
}

// ─── TEXT SPLIT ANIMATION ─────────────────────────────────
function splitTextToChars(el) {
  const text = el.textContent;
  el.innerHTML = "";
  const chars = [];
  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.className = "split-char";
    const inner = document.createElement("span");
    inner.textContent = text[i] === " " ? "\u00a0" : text[i];
    inner.style.display = "inline-block";
    span.appendChild(inner);
    el.appendChild(span);
    chars.push(inner);
  }
  return chars;
}

// ─── REVEAL OBSERVER ─────────────────────────────────────
let revealObserver;

function initRevealObserver() {
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("vis");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 },
  );

  document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));
}

// ─── PRELOADER ───────────────────────────────────────────
function initPreloader(callback) {
  const preloader = document.getElementById("preloader");
  const logo = document.getElementById("preloaderLogo");
  const fill = document.getElementById("preloaderFill");
  if (!preloader) {
    callback();
    return;
  }

  const tl = gsap.timeline();
  tl.to(logo, { opacity: 1, scale: 1, duration: 0.8, ease: "power2.out" }).to(
    fill,
    { scaleX: 1, duration: 1.8, ease: "power2.inOut" },
    "-=.3",
  );

  setTimeout(() => {
    gsap.to(preloader, {
      opacity: 0,
      duration: 0.6,
      ease: "power2.inOut",
      onComplete: () => {
        preloader.classList.add("done");
        callback();
      },
    });
  }, 2600);
}

// ─── HERO ANIMATIONS ─────────────────────────────────────
function initHero() {
  // Split text animation
  const heroH = document.querySelector(".hero-title");
  if (heroH) {
    const span = heroH.querySelector("span");
    if (span) {
      const chars = splitTextToChars(span);
      const heroTl = gsap.timeline({ delay: 0.1 });
      heroTl
        .to(".hero-tag", {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
        })
        .to(
          chars,
          { y: 0, duration: 1.1, ease: "power4.out", stagger: 0.03 },
          "-=.5",
        )
        .to(
          "#heroSub",
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=.6",
        )
        .to("#heroBtns", { opacity: 1, duration: 0.7 }, "-=.4");
    }
  }

  // Floating tag (delayed to not conflict with hero timeline)
  setTimeout(() => {
    gsap.to(".hero-tag", {
      y: "+=8",
      duration: 3,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
    });
  }, 2000);

  // Parallax
  gsap.to("#heroBg", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: { trigger: ".hero", scrub: 1.5 },
  });
  gsap.to(".hero-content", {
    yPercent: -10,
    ease: "none",
    scrollTrigger: { trigger: ".hero", scrub: 1 },
  });
  gsap.to(".hero-waveform", {
    y: 50,
    ease: "none",
    scrollTrigger: { trigger: ".hero", scrub: 1 },
  });
}

// ─── SECTION REVEALS ─────────────────────────────────────
function initSectionReveals() {
  // Section headings
  document.querySelectorAll(".section-heading").forEach((h) => {
    gsap.from(h, {
      opacity: 0,
      y: 60,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: { trigger: h, start: "top 88%" },
    });
  });

  // Section labels
  document.querySelectorAll(".section-label").forEach((l) => {
    gsap.from(l, {
      opacity: 0,
      x: -40,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: { trigger: l, start: "top 90%" },
    });
  });

  // Stats bounce
  document.querySelectorAll(".stat").forEach((s, i) => {
    gsap.from(s, {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 0.7,
      delay: i * 0.15,
      ease: "back.out(1.5)",
      scrollTrigger: { trigger: s, start: "top 90%" },
    });
  });
}

// ─── STATS COUNTER ───────────────────────────────────────
function initStatsCounter() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseInt(el.dataset.c);
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.from(el, {
          scale: 0.5,
          opacity: 0,
          duration: 0.6,
          ease: "back.out(2)",
        });
        gsap.to(
          { v: 0 },
          {
            v: target,
            duration: 2.5,
            ease: "power2.out",
            onUpdate: function () {
              const val = Math.round(this.targets()[0].v).toLocaleString();
              el.textContent = val + (target >= 1000 ? "+" : "M+");
            },
          },
        );
      },
    });
  });
}

// ─── GALLERY 3D ──────────────────────────────────────────
function initGallery() {
  document.querySelectorAll(".gal-i").forEach((g, i) => {
    gsap.from(g, {
      opacity: 0,
      scale: 0.88,
      y: 60,
      rotation: gsap.utils.random(-2, 2),
      duration: 0.9,
      delay: i * 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: g, start: "top 90%" },
    });

    // 3D hover
    g.addEventListener("mousemove", (e) => {
      const r = g.getBoundingClientRect();
      const x = ((e.clientX - r.left - r.width / 2) / r.width) * 6;
      const y = ((e.clientY - r.top - r.height / 2) / r.height) * 6;
      const img = g.querySelector("img");
      if (img)
        gsap.to(img, {
          rotationY: x,
          rotationX: -y,
          transformPerspective: 600,
          scale: 1.05,
          duration: 0.4,
          ease: "power2.out",
        });
    });

    g.addEventListener("mouseleave", () => {
      const img = g.querySelector("img");
      if (img)
        gsap.to(img, {
          rotationY: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.6,
          ease: "power2.out",
        });
    });

    // Caption
    g.addEventListener("mouseenter", () => {
      gsap.to(g.querySelector(".gallery-caption"), {
        opacity: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
      });
    });
    g.addEventListener("mouseleave", () => {
      gsap.to(g.querySelector(".gallery-caption"), {
        opacity: 0,
        y: 10,
        duration: 0.3,
      });
    });
  });
}

// ─── TRACK CARDS 3D TILT ─────────────────────────────────
function initTrackCards() {
  document.querySelectorAll(".tc").forEach((c) => {
    gsap.from(c, {
      opacity: 0,
      y: 80,
      rotationX: 15,
      duration: 0.7,
      delay: (Array.from(c.parentElement.children).indexOf(c) % 4) * 0.12,
      ease: "power3.out",
      scrollTrigger: { trigger: c, start: "top 92%" },
    });

    c.addEventListener("mousemove", (e) => {
      const r = c.getBoundingClientRect();
      const x = ((e.clientX - r.left - r.width / 2) / r.width) * 10;
      const y = ((e.clientY - r.top - r.height / 2) / r.height) * 10;
      gsap.to(c, {
        rotationY: x,
        rotationX: -y,
        transformPerspective: 600,
        duration: 0.35,
        ease: "power2.out",
      });
    });

    c.addEventListener("mouseleave", () => {
      gsap.to(c, {
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        duration: 0.6,
        ease: "elastic.out(1,.6)",
      });
    });
  });
}

// ─── PROCESS DOTS ────────────────────────────────────────
function initProcess() {
  document.querySelectorAll(".process-dot").forEach((d, i) => {
    gsap.from(d, {
      scale: 0,
      opacity: 0,
      duration: 0.6,
      delay: i * 0.2,
      ease: "back.out(2.5)",
      scrollTrigger: { trigger: d, start: "top 85%" },
    });
  });
}

// ─── SERVICES ────────────────────────────────────────────
function initServices() {
  document.querySelectorAll(".service-card").forEach((s, i) => {
    gsap.from(s, {
      opacity: 0,
      x: i % 2 === 0 ? -60 : 60,
      duration: 0.8,
      delay: i * 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: s, start: "top 90%" },
    });
  });
}

// ─── CONTACT ─────────────────────────────────────────────
function initContact() {
  document.querySelectorAll(".contact-link").forEach((l, i) => {
    gsap.from(l, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      delay: i * 0.15,
      ease: "power3.out",
      scrollTrigger: { trigger: l, start: "top 92%" },
    });
  });
}

// ─── QUOTE ───────────────────────────────────────────────
function initQuote() {
  const quoteBg = document.getElementById("quoteBg");
  if (quoteBg) {
    gsap.to(quoteBg, {
      yPercent: 35,
      ease: "none",
      scrollTrigger: { trigger: ".quote-section", scrub: 1.5 },
    });
  }
  gsap.from(".quote-text", {
    opacity: 0,
    scale: 0.85,
    y: 40,
    duration: 1.4,
    ease: "power3.out",
    scrollTrigger: { trigger: ".quote-section", start: "top 75%" },
  });
}

// ─── ABOUT IMAGE PARALLAX ────────────────────────────────
function initAboutParallax() {
  gsap.to(".about-image img", {
    yPercent: -20,
    ease: "none",
    scrollTrigger: {
      trigger: ".about-image",
      start: "top bottom",
      end: "bottom top",
      scrub: 2,
    },
  });
}

// ─── SMOOTH NAV SCROLL ───────────────────────────────────
function initSmoothNav() {
  document.querySelectorAll(".nav-links a").forEach((a) => {
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.querySelector(a.getAttribute("href"));
      if (target)
        gsap.to(window, {
          duration: 1.2,
          scrollTo: { y: target, autoKill: true },
          ease: "power3.inOut",
        });
    });
  });
}

// ─── STICKY NAV ──────────────────────────────────────────
function initStickyNav() {
  window.addEventListener(
    "scroll",
    () => {
      const nav = document.getElementById("mainNav");
      if (nav) nav.classList.toggle("stuck", scrollY > 80);
    },
    { passive: true },
  );
}

// ─── NAV ACTIVE STATE ────────────────────────────────────
function initNavActive() {
  const sections = [...document.querySelectorAll("section[id]")];
  window.addEventListener(
    "scroll",
    () => {
      sections.forEach((s) => {
        const top = s.offsetTop - 200;
        const link = document.querySelector(`.nav-links a[href="#${s.id}"]`);
        if (link)
          link.style.color =
            scrollY >= top && scrollY < top + s.offsetHeight ? "var(--a)" : "";
      });
    },
    { passive: true },
  );
}

// ─── TICKER ──────────────────────────────────────────────
function initTicker() {
  const container = document.getElementById("ticker");
  if (!container) return;

  [...DUCK_TICKER, ...DUCK_TICKER].forEach((text) => {
    const span = document.createElement("span");
    span.className = "ticker-item";
    span.textContent = text;
    container.appendChild(span);
  });

  // Pause on hover
  const inner = document.querySelector(".ticker-inner");
  if (inner) {
    inner.parentElement.addEventListener(
      "mouseenter",
      () => (inner.style.animationPlayState = "paused"),
    );
    inner.parentElement.addEventListener(
      "mouseleave",
      () => (inner.style.animationPlayState = "running"),
    );
  }
}

// ─── WAVEFORM ────────────────────────────────────────────
function initWaveform() {
  const wf = document.getElementById("waveform");
  if (!wf) return;

  [
    6, 11, 22, 32, 40, 28, 36, 20, 34, 16, 38, 24, 30, 14, 26, 32, 18, 28, 22,
    36,
  ].forEach((h, i) => {
    const bar = document.createElement("div");
    bar.className = "wave-bar";
    bar.style.setProperty("--h", h + "px");
    bar.style.setProperty("--d", 0.6 + Math.random() * 0.8 + "s");
    bar.style.animationDelay = i * 0.04 + "s";
    wf.appendChild(bar);
  });
}

// ─── SECTION PARALLAX ────────────────────────────────────
function initSectionParallax() {
  document.querySelectorAll(".section").forEach((sec) => {
    gsap.from(sec, {
      opacity: 0.7,
      y: 30,
      ease: "none",
      scrollTrigger: {
        trigger: sec,
        start: "top bottom",
        end: "top center",
        scrub: 1,
      },
    });
  });
}

// ─── MASTER INIT ─────────────────────────────────────────
function initAllAnimations() {
  try {
    initTicker();
    initWaveform();
    initStickyNav();
    initSmoothNav();
    initRevealObserver();
    initNavActive();
    initHero();
    initSectionReveals();
    initStatsCounter();
    initGallery();
    initTrackCards();
    initProcess();
    initServices();
    initContact();
    initQuote();
    initAboutParallax();
    initMagnetic();
    initScrollProgress();
    initSectionParallax();
    initCursor();
  } catch (e) {
    console.error("Animation init error:", e);
  }
}
