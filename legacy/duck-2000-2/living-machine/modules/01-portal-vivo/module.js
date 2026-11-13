let active = null;

const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

function createEvent(name, detail) {
  return new CustomEvent(name, { detail, bubbles: false });
}

function publish(bus, name, detail) {
  bus.dispatchEvent(createEvent(name, detail));
}

export function mount(root, bus = document) {
  if (!(root instanceof Element)) throw new TypeError("Portal Vivo requiere un elemento raíz válido.");
  if (!bus || typeof bus.dispatchEvent !== "function") throw new TypeError("Portal Vivo requiere un bus EventTarget.");
  destroy();

  const section = root.matches('[data-duck-module="01"]') ? root : root.querySelector('[data-duck-module="01"]');
  if (!section) throw new Error('Portal Vivo no encontró [data-duck-module="01"].');

  const enterButton = section.querySelector("[data-portal-enter]");
  const motionButton = section.querySelector("[data-portal-motion]");
  const identityOutput = section.querySelector("[data-portal-identity]");
  const inkOutput = section.querySelector("[data-portal-ink]");
  const colorOutput = section.querySelector("[data-portal-color]");
  const modeOutput = section.querySelector("[data-portal-mode]");
  const status = section.querySelector("[data-portal-status]");
  const required = [enterButton, motionButton, identityOutput, inkOutput, colorOutput, modeOutput, status];
  if (required.some((node) => !node)) throw new Error("Portal Vivo incompleto: faltan controles o salidas requeridas.");

  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  const state = {
    identityLevel: media.matches ? .85 : 0,
    inkProgress: media.matches ? .78 : 0,
    dominantColor: media.matches ? "green" : "purple",
    motionMode: media.matches ? "reduced" : "full"
  };
  const cleanup = [];
  let gsapContext = null;
  let scrollTrigger = null;
  let observer = null;
  let lastPayload = "";

  function listen(target, name, handler, options) {
    target.addEventListener(name, handler, options);
    cleanup.push(() => target.removeEventListener(name, handler, options));
  }

  function snapshot() {
    return {
      module: "01",
      owner: "Rawls",
      identityLevel: Number(state.identityLevel.toFixed(3)),
      inkProgress: Number(state.inkProgress.toFixed(3)),
      dominantColor: state.dominantColor,
      motionMode: state.motionMode
    };
  }

  function render(announce = false) {
    section.style.setProperty("--portal-identity", state.identityLevel.toFixed(3));
    section.style.setProperty("--portal-ink-progress", state.inkProgress.toFixed(3));
    section.dataset.duckMotion = state.motionMode;
    identityOutput.value = String(Math.round(state.identityLevel * 100)).padStart(2, "0");
    inkOutput.value = String(Math.round(state.inkProgress * 100)).padStart(2, "0");
    colorOutput.value = state.dominantColor === "purple" ? "ROXO" : state.dominantColor === "green" ? "VERDE" : "TINTA";
    modeOutput.value = state.motionMode === "full" ? "ATIVO" : state.motionMode === "paused" ? "PAUSADO" : "REDUZIDO";
    motionButton.setAttribute("aria-pressed", String(state.motionMode === "paused"));
    motionButton.disabled = state.motionMode === "reduced";
    motionButton.textContent = state.motionMode === "reduced" ? "Movimento reduzido" : state.motionMode === "paused" ? "Retomar movimento" : "Pausar movimento";

    const html = document.documentElement;
    html.dataset.duckIdentityLevel = state.identityLevel.toFixed(3);
    html.dataset.duckInkProgress = state.inkProgress.toFixed(3);
    html.dataset.duckDominantColor = state.dominantColor;
    html.dataset.duckMotionMode = state.motionMode;

    const payload = snapshot();
    const serialized = JSON.stringify(payload);
    if (serialized !== lastPayload) {
      lastPayload = serialized;
      publish(bus, "duck:portal:state", payload);
    }
    if (announce) status.textContent = `Identidade ${Math.round(state.identityLevel * 100)}%. Tinta ${Math.round(state.inkProgress * 100)}%. Estado ${colorOutput.value.toLowerCase()}.`;
  }

  function setProgress(progress, announce = false) {
    const next = clamp(progress);
    state.identityLevel = clamp(next * 1.08);
    state.inkProgress = clamp((next - .18) / .72);
    state.dominantColor = state.inkProgress < .34 ? "purple" : state.inkProgress < .72 ? "ink" : "green";
    render(announce);
  }

  function setupMotion() {
    const gsap = globalThis.gsap;
    const ScrollTrigger = globalThis.ScrollTrigger;
    if (state.motionMode === "reduced") {
      render();
      return;
    }
    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);
      gsapContext = gsap.context(() => {
      const ease = globalThis.CustomEase ? globalThis.CustomEase.create("duckPortalEase", "M0,0 C0.76,0 0.24,1 1,1") : "power3.inOut";
        gsap.from(section.querySelector(".duck-portal__portrait"), { scale: 1.18, duration: 1.8, ease });
        gsap.from(section.querySelectorAll(".duck-portal__copy > *"), { y: 56, opacity: 0, duration: 1.05, stagger: .1, ease }, 0);
        gsap.from(section.querySelector(".duck-portal__gestalt"), { opacity: 0, rotate: -19, duration: 1.5, ease }, .2);
        scrollTrigger = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: .65,
          onUpdate: ({ progress }) => state.motionMode === "full" && setProgress(progress)
        });
      }, section);
      status.textContent = "Portal pronto. Movimento sincronizado com a rolagem.";
      return;
    }

    const thresholds = Array.from({ length: 21 }, (_, index) => index / 20);
    observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry || state.motionMode !== "full") return;
      setProgress(clamp((entry.intersectionRatio - .08) / .72));
    }, { threshold: thresholds });
    observer.observe(section);
    status.textContent = "Portal em modo seguro: conteúdo completo, movimento simplificado.";
  }

  function activate() {
    if (state.motionMode === "paused") state.motionMode = "full";
    if (scrollTrigger) {
      const destination = section.offsetTop + Math.min(window.innerHeight * .92, section.offsetHeight * .46);
      window.scrollTo({ top: destination, behavior: state.motionMode === "reduced" ? "auto" : "smooth" });
    } else {
      setProgress(.82, true);
    }
    publish(bus, "duck:portal:activate", snapshot());
    status.textContent = "Máquina ativada. A tinta está revelando a identidade de Duck.";
    render();
  }

  function toggleMotion() {
    if (media.matches) return;
    state.motionMode = state.motionMode === "paused" ? "full" : "paused";
    if (scrollTrigger) {
      if (state.motionMode === "full") scrollTrigger.enable();
      else scrollTrigger.disable(false);
    }
    if (globalThis.gsap) {
      const targets = [section, ...section.querySelectorAll("*")];
      globalThis.gsap.getTweensOf(targets, true).forEach((tween) => tween.paused(state.motionMode === "paused"));
    }
    render(true);
    publish(bus, "duck:motion:change", snapshot());
  }

  function handlePreference(event) {
    state.motionMode = event.matches ? "reduced" : "full";
    if (event.matches) setProgress(.82, true); else render(true);
    if (scrollTrigger) {
      if (event.matches) scrollTrigger.disable(false);
      else scrollTrigger.enable();
    }
    publish(bus, "duck:motion:change", snapshot());
  }

  listen(enterButton, "click", activate);
  listen(motionButton, "click", toggleMotion);
  listen(media, "change", handlePreference);
  setupMotion();
  render();
  publish(bus, "duck:portal:ready", snapshot());

  active = {
    cleanup,
    section,
    teardown() {
      cleanup.splice(0).forEach((dispose) => dispose());
      if (observer) observer.disconnect();
      if (scrollTrigger) scrollTrigger.kill();
      if (gsapContext) gsapContext.revert();
      section.style.removeProperty("--portal-identity");
      section.style.removeProperty("--portal-ink-progress");
      delete section.dataset.duckMotion;
    }
  };

  return { getState: snapshot, destroy };
}

export function destroy() {
  if (!active) return;
  active.teardown();
  active = null;
}
