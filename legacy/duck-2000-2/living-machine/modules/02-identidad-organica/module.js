const MODULE_ID = "02";
const INPUT_EVENT = "portal:state";
const OUTPUT_EVENT = "identity:change";

const MOODS = Object.freeze({
  precisao: Object.freeze({
    label: "Precisão",
    statement: "Clareza no centro. Cada detalhe encontra seu lugar.",
    caption: "Presença antes do efeito",
    captionNumber: "01 / 03",
    output: "Precisão selecionada. Ritmo visual estável.",
    emphasis: ["profissional", "humano", "tecnologico"],
    rhythm: Object.freeze({ tempo: 104, cadence: "steady", pulseMs: 577, energy: 0.68 })
  }),
  jogo: Object.freeze({
    label: "Jogo",
    statement: "Curiosidade em movimento. A surpresa também pode ser precisa.",
    caption: "Leveza com intenção",
    captionNumber: "02 / 03",
    output: "Jogo selecionado. Ritmo visual ágil e sincopado.",
    emphasis: ["jovem", "divertido", "brasileiro"],
    rhythm: Object.freeze({ tempo: 128, cadence: "syncopated", pulseMs: 469, energy: 0.84 })
  }),
  impacto: Object.freeze({
    label: "Impacto",
    statement: "Peso com espaço. A ideia chega inteira, sem perder humanidade.",
    caption: "Decisão dentro do estúdio",
    captionNumber: "03 / 03",
    output: "Impacto selecionado. Ritmo visual amplo e marcado.",
    emphasis: ["profissional", "tecnologico", "jovem"],
    rhythm: Object.freeze({ tempo: 86, cadence: "wide", pulseMs: 698, energy: 0.92 })
  })
});

const IDENTITY_TRAITS = Object.freeze([
  "jovem",
  "brasileiro",
  "tecnologico",
  "divertido",
  "humano",
  "profissional"
]);

const PORTRAITS = Object.freeze({
  precisao: "images/capa-1024x576.jpg",
  jogo: "images/capa-4-1024x576.jpg",
  impacto: "images/mix-6-1024x682.jpg"
});

let cleanup = [];
let mountedRoot = null;
let activeBus = null;
let activeMood = "precisao";
let portalState = Object.freeze({
  identityLevel: 0.7,
  inkProgress: 0.4,
  dominantColor: "#6bf178",
  motionMode: "full"
});

export function mount(root, bus) {
  if (!(root instanceof HTMLElement)) {
    throw new TypeError("Identidade Orgânica requer um elemento raiz válido.");
  }
  if (!bus || typeof bus.emit !== "function" || typeof bus.on !== "function") {
    revealFallback(root, "O canal duck:* não está disponível.");
    throw new TypeError("Identidade Orgânica requer o Duck Bus.");
  }

  destroy();
  mountedRoot = root;
  activeBus = bus;
  normalizeAssetUrls(root);
  bindMoodControls(root);
  bindKeyboardNavigation(root);
  bindPortalState(root, bus);
  bindViewport(root);
  bindPortraitMotion(root);

  const remembered = bus.read?.(INPUT_EVENT);
  if (remembered) applyPortalState(root, remembered);

  setMood(root, activeMood, false);
  root.dataset.moduleState = "ready";
  root.dataset.motion = portalState.motionMode === "full" ? "full" : "paused";
  bus.emit("identity:ready", buildPayload(activeMood));
}

export function destroy() {
  cleanup.splice(0).reverse().forEach(dispose => {
    try { dispose(); } catch { /* cleanup remains best-effort */ }
  });
  if (mountedRoot) {
    mountedRoot.style.removeProperty("--identity-accent");
    mountedRoot.style.removeProperty("--identity-ink");
    mountedRoot.style.removeProperty("--identity-level");
    mountedRoot.style.removeProperty("--identity-tilt-x");
    mountedRoot.style.removeProperty("--identity-tilt-y");
    mountedRoot.dataset.viewport = "idle";
  }
  mountedRoot = null;
  activeBus = null;
}

function bindMoodControls(root) {
  root.querySelectorAll("[data-mood-control]").forEach(button => {
    const onClick = () => setMood(root, button.dataset.moodControl, true);
    button.addEventListener("click", onClick);
    cleanup.push(() => button.removeEventListener("click", onClick));
  });
}

function bindKeyboardNavigation(root) {
  const controls = [...root.querySelectorAll("[data-mood-control]")];
  const onKeydown = event => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const current = controls.indexOf(document.activeElement);
    if (current < 0) return;
    event.preventDefault();
    const next = event.key === "Home"
      ? 0
      : event.key === "End"
        ? controls.length - 1
        : (current + (event.key === "ArrowRight" ? 1 : -1) + controls.length) % controls.length;
    controls[next].focus();
    controls[next].click();
  };
  root.addEventListener("keydown", onKeydown);
  cleanup.push(() => root.removeEventListener("keydown", onKeydown));
}

function bindPortalState(root, bus) {
  const unsubscribe = bus.on(INPUT_EVENT, detail => applyPortalState(root, detail));
  if (typeof unsubscribe === "function") cleanup.push(unsubscribe);
}

function bindViewport(root) {
  if (!("IntersectionObserver" in window)) {
    root.dataset.viewport = "active";
    return;
  }
  const observer = new IntersectionObserver(entries => {
    const visible = entries.some(entry => entry.isIntersecting);
    root.dataset.viewport = visible ? "active" : "idle";
  }, { rootMargin: "15% 0px", threshold: 0.08 });
  observer.observe(root);
  cleanup.push(() => observer.disconnect());
}

function bindPortraitMotion(root) {
  const machine = root.querySelector(".duck-identity__portrait-machine");
  if (!machine) return;
  let frame = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");

  const reset = () => {
    root.style.setProperty("--identity-tilt-x", "0deg");
    root.style.setProperty("--identity-tilt-y", "0deg");
  };

  const onPointerMove = event => {
    if (reduced.matches || portalState.motionMode !== "full" || root.dataset.viewport !== "active") return;
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      const rect = machine.getBoundingClientRect();
      const x = clamp((event.clientX - rect.left) / rect.width, 0, 1) - 0.5;
      const y = clamp((event.clientY - rect.top) / rect.height, 0, 1) - 0.5;
      root.style.setProperty("--identity-tilt-x", `${(x * 3.5).toFixed(2)}deg`);
      root.style.setProperty("--identity-tilt-y", `${(y * -3).toFixed(2)}deg`);
    });
  };

  machine.addEventListener("pointermove", onPointerMove, { passive: true });
  machine.addEventListener("pointerleave", reset);
  cleanup.push(() => {
    cancelAnimationFrame(frame);
    machine.removeEventListener("pointermove", onPointerMove);
    machine.removeEventListener("pointerleave", reset);
  });
}

function applyPortalState(root, detail = {}) {
  portalState = Object.freeze({
    identityLevel: clamp(toFinite(detail.identityLevel, portalState.identityLevel), 0, 1),
    inkProgress: clamp(toFinite(detail.inkProgress, portalState.inkProgress), 0, 1),
    dominantColor: validColor(detail.dominantColor) ? detail.dominantColor : portalState.dominantColor,
    motionMode: normalizeMotion(detail.motionMode)
  });

  root.style.setProperty("--identity-level", portalState.identityLevel.toFixed(3));
  root.style.setProperty("--identity-ink", portalState.inkProgress.toFixed(3));
  root.style.setProperty("--identity-accent", portalState.dominantColor);
  root.style.setProperty("--identity-ambient-opacity", (0.1 + portalState.inkProgress * 0.32).toFixed(3));
  root.style.setProperty("--identity-halo-rotation", `${(portalState.inkProgress * 24).toFixed(2)}deg`);
  root.style.setProperty("--identity-halo-scale", (0.9 + portalState.identityLevel * 0.18).toFixed(3));
  root.style.setProperty("--identity-line-scale", (0.25 + portalState.identityLevel * 0.75).toFixed(3));
  root.style.setProperty("--identity-breathe-scale", (0.72 + portalState.identityLevel * 0.45).toFixed(3));
  root.style.setProperty("--identity-meter-scale", (0.35 + portalState.identityLevel * 0.65).toFixed(3));
  root.style.setProperty("--identity-dash", (0.09 + portalState.identityLevel * 0.18).toFixed(3));
  root.style.setProperty("--identity-dash-offset", (-portalState.inkProgress).toFixed(3));
  root.style.setProperty("--identity-overlay-strength", `${(portalState.inkProgress * 12).toFixed(1)}%`);
  root.dataset.motion = portalState.motionMode === "full" ? "full" : "paused";
  document.documentElement.dataset.duckIdentityLevel = portalState.identityLevel.toFixed(2);
  emitIdentity(activeMood);
}

function setMood(root, requestedMood, announce) {
  const moodKey = Object.hasOwn(MOODS, requestedMood) ? requestedMood : "precisao";
  const mood = MOODS[moodKey];
  activeMood = moodKey;
  root.dataset.mood = moodKey;
  root.style.setProperty("--identity-beat", `${mood.rhythm.pulseMs}ms`);
  root.style.setProperty("--identity-breathe-duration", `${mood.rhythm.pulseMs * 2}ms`);
  root.style.setProperty("--identity-orbit-duration", `${mood.rhythm.pulseMs * 12}ms`);
  root.style.setProperty("--identity-delay-quarter", `${mood.rhythm.pulseMs * -0.25}ms`);
  root.style.setProperty("--identity-delay-half", `${mood.rhythm.pulseMs * -0.5}ms`);
  root.style.setProperty("--identity-delay-three-quarter", `${mood.rhythm.pulseMs * -0.75}ms`);

  root.querySelectorAll("[data-mood-control]").forEach(button => {
    button.setAttribute("aria-pressed", String(button.dataset.moodControl === moodKey));
  });
  root.querySelectorAll("[data-portrait]").forEach(image => {
    image.dataset.active = String(image.dataset.portrait === moodKey);
  });
  root.querySelectorAll("[data-trait]").forEach(trait => {
    trait.dataset.emphasis = String(mood.emphasis.includes(trait.dataset.trait));
  });

  setText(root, "[data-mood-statement]", mood.statement);
  setText(root, "[data-caption-number]", mood.captionNumber);
  setText(root, "[data-caption-text]", mood.caption);
  setText(root, "[data-identity-output]", mood.output);
  document.documentElement.dataset.duckIdentityMood = moodKey;
  document.documentElement.dataset.duckVisualRhythm = mood.rhythm.cadence;

  animateSelection(root);
  if (announce) emitIdentity(moodKey);
}

function emitIdentity(moodKey) {
  if (!activeBus) return;
  activeBus.emit(OUTPUT_EVENT, buildPayload(moodKey));
}

function buildPayload(moodKey) {
  const mood = MOODS[moodKey] ?? MOODS.precisao;
  const weights = Object.fromEntries(IDENTITY_TRAITS.map(trait => [
    trait,
    Number((mood.emphasis.includes(trait) ? 1 : 0.72 + portalState.identityLevel * 0.18).toFixed(2))
  ]));
  return Object.freeze({
    source: MODULE_ID,
    identityTraits: IDENTITY_TRAITS.map(name => ({ name, weight: weights[name] })),
    selectedMood: moodKey,
    visualRhythm: { ...mood.rhythm, intensity: portalState.identityLevel },
    inherited: {
      inkProgress: portalState.inkProgress,
      dominantColor: portalState.dominantColor,
      motionMode: portalState.motionMode
    }
  });
}

function animateSelection(root) {
  const gsap = window.gsap;
  if (!gsap || portalState.motionMode !== "full" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const context = gsap.context(() => {
    gsap.fromTo(
      root.querySelectorAll("[data-emphasis='true']"),
      { y: 8, opacity: 0.55 },
      { y: -3, opacity: 1, duration: 0.48, stagger: 0.045, ease: "power3.out", clearProps: "opacity" }
    );
    gsap.fromTo(
      root.querySelector("[data-mood-statement]"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.58, ease: "power3.out" }
    );
  }, root);
  cleanup.push(() => context.revert());
}

function normalizeAssetUrls(root) {
  root.querySelectorAll("[data-portrait]").forEach(image => {
    const relative = PORTRAITS[image.dataset.portrait];
    if (relative) image.src = relative;
  });
  const logo = root.querySelector("[data-duck-logo]");
  if (logo) logo.src = "images/duck-logo-desktop.png";
  root.querySelector("[data-portrait='precisao']")?.setAttribute("data-active", "true");
}

function revealFallback(root, reason) {
  const fallback = root.querySelector("[data-module-fallback]");
  if (!fallback) return;
  fallback.hidden = false;
  fallback.textContent = `A identidade de Duck continua legível. ${reason}`;
}

function normalizeMotion(value) {
  return ["full", "reduced", "paused"].includes(value) ? value : portalState.motionMode;
}

function validColor(value) {
  return typeof value === "string" && CSS.supports("color", value);
}

function setText(root, selector, value) {
  const element = root.querySelector(selector);
  if (element) element.textContent = value;
}

function toFinite(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}
