const MODULE_SELECTOR = '[data-duck-module="03"]';
const INPUT_EVENT = 'duck:identity';
const OUTPUT_EVENT = 'duck:production';

const STAGES = {
  understand: {
    code: 'ETAPA 01',
    title: 'Entender antes de produzir',
    description: 'A conversa define intenção, contexto e referências. O primeiro gesto é fazer perguntas melhores, não preencher o silêncio.',
    question: 'O que esta música precisa fazer alguém sentir?'
  },
  find: {
    code: 'ETAPA 02',
    title: 'Encontrar o centro',
    description: 'Pulso, contraste e espaço transformam uma ideia aberta numa direção reconhecível, sem confundir variedade com identidade.',
    question: 'Qual decisão faz todas as outras parecerem inevitáveis?'
  },
  build: {
    code: 'ETAPA 03',
    title: 'Construir com tensão',
    description: 'As camadas entram por função. Percurso, densidade e respiro organizam a energia para que cada mudança tenha consequência.',
    question: 'O que precisa entrar, sair ou esperar para a música respirar?'
  },
  deliver: {
    code: 'ETAPA 04',
    title: 'Entregar com continuidade',
    description: 'A versão final comunica a intenção, acolhe revisão e preserva uma linha clara entre o primeiro briefing e a escuta.',
    question: 'A entrega ainda responde à pergunta que iniciou o processo?'
  }
};

const MOOD_MAP = {
  curious: { energy: 62, density: 44, intent: 'kinetic' },
  curioso: { energy: 62, density: 44, intent: 'kinetic' },
  playful: { energy: 76, density: 52, intent: 'kinetic' },
  divertido: { energy: 76, density: 52, intent: 'kinetic' },
  intimate: { energy: 38, density: 31, intent: 'intimate' },
  intimo: { energy: 38, density: 31, intent: 'intimate' },
  'íntimo': { energy: 38, density: 31, intent: 'intimate' },
  expansive: { energy: 72, density: 63, intent: 'expansive' },
  expansivo: { energy: 72, density: 63, intent: 'expansive' },
  professional: { energy: 58, density: 48, intent: 'intimate' },
  profissional: { energy: 58, density: 48, intent: 'intimate' }
};

let active = null;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, Number(value) || 0));
}

function normalizeTraits(value) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).slice(0, 6);
  if (typeof value === 'string') return value.split(/[,·|]/).map((item) => item.trim()).filter(Boolean).slice(0, 6);
  return ['jovem', 'tecnológico', 'humano'];
}

function deriveHints(state) {
  const intentBias = state.intent === 'intimate' ? -12 : state.intent === 'expansive' ? 10 : 4;
  const rhythmBias = typeof state.visualRhythm === 'number'
    ? clamp(state.visualRhythm, -12, 12)
    : String(state.visualRhythm).toLowerCase().includes('rápid') ? 8 : 0;
  const tempo = Math.round(clamp(72 + state.energy * .52 + intentBias + rhythmBias, 68, 142));
  const texture = state.density < 34 ? 'leve' : state.density > 68 ? 'granular' : state.intent === 'expansive' ? 'larga' : 'tátil';
  const space = state.intent === 'expansive' ? 'aberto' : state.density > 66 ? 'compacto' : state.energy < 42 ? 'íntimo' : 'próximo';
  return { tempoHint: tempo, textureHint: texture, spaceHint: space };
}

function emit(bus, detail) {
  bus.dispatchEvent(new CustomEvent(OUTPUT_EVENT, { detail }));
}

function animateTransition(context, previousButton, nextButton) {
  const { root } = context;
  const gsap = globalThis.gsap;
  if (!gsap || !context.gsapEnabled || context.reducedMotion) return;

  const glyphBars = nextButton.querySelectorAll('.duck-stage__glyph i');
  const readoutItems = root.querySelectorAll('.duck-production__readout > *');
  gsap.killTweensOf([glyphBars, readoutItems]);
  gsap.fromTo(glyphBars, { scaleX: .15 }, { scaleX: 1, duration: .55, stagger: .07, ease: 'duck-machine' });
  gsap.fromTo(readoutItems, { y: 15, opacity: 0 }, { y: 0, opacity: 1, duration: .48, stagger: .045, ease: 'duck-machine' });
  if (previousButton) gsap.to(previousButton, { duration: .22, ease: 'duck-machine' });
}

function render(context, options = {}) {
  const { root, elements, state, bus } = context;
  const stage = STAGES[state.processStage];
  const hints = deriveHints(state);
  const previousButton = root.querySelector('.duck-stage.is-active');
  const nextButton = root.querySelector(`[data-stage-button="${state.processStage}"]`);

  root.dataset.stage = state.processStage;
  elements.stageButtons.forEach((button) => {
    const selected = button === nextButton;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });

  elements.stageCode.textContent = stage.code;
  elements.stageTitle.textContent = stage.title;
  elements.stageDescription.textContent = stage.description;
  elements.stageQuestion.textContent = stage.question;
  elements.mood.textContent = state.mood;
  elements.traits.textContent = state.identityTraits.join(' · ');
  elements.energy.value = String(state.energy);
  elements.energyOutput.textContent = String(state.energy);
  elements.density.value = String(state.density);
  elements.densityOutput.textContent = String(state.density);
  elements.intent.value = state.intent;
  elements.tempo.textContent = `${hints.tempoHint} BPM`;
  elements.texture.textContent = hints.textureHint;
  elements.space.textContent = hints.spaceHint;
  elements.processStage.textContent = state.processStage;
  elements.status.textContent = options.received
    ? `Sinal de Bohr recebido: ${state.mood}. Decisões atualizadas para Sartre.`
    : `Etapa ${stage.code.slice(-2)} ativa. Saída preparada para o laboratório sonoro.`;

  const htmlState = document.documentElement.dataset;
  htmlState.duckProcessStage = state.processStage;
  htmlState.duckTempoHint = String(hints.tempoHint);
  htmlState.duckTextureHint = hints.textureHint;
  htmlState.duckSpaceHint = hints.spaceHint;

  animateTransition(context, previousButton, nextButton);
  emit(bus, {
    source: '03-kant-motor-producao',
    processStage: state.processStage,
    tempoHint: hints.tempoHint,
    textureHint: hints.textureHint,
    spaceHint: hints.spaceHint
  });
}

function resolveElements(root) {
  const one = (selector) => root.querySelector(selector);
  return {
    stageButtons: [...root.querySelectorAll('[data-stage-button]')],
    mood: one('[data-input-mood]'),
    traits: one('[data-input-traits]'),
    intent: one('[data-intent]'),
    energy: one('[data-energy]'),
    energyOutput: one('[data-energy-output]'),
    density: one('[data-density]'),
    densityOutput: one('[data-density-output]'),
    stageCode: one('[data-stage-code]'),
    stageTitle: one('[data-stage-title]'),
    stageDescription: one('[data-stage-description]'),
    stageQuestion: one('[data-stage-question]'),
    tempo: one('[data-tempo]'),
    texture: one('[data-texture]'),
    space: one('[data-space]'),
    processStage: one('[data-process-stage]'),
    status: one('[data-status]')
  };
}

function validateElements(elements) {
  return elements.stageButtons.length === 4 && Object.entries(elements)
    .filter(([key]) => key !== 'stageButtons')
    .every(([, value]) => value instanceof Element);
}

function setupGsap(context) {
  const gsap = globalThis.gsap;
  const customEase = globalThis.CustomEase;
  if (!gsap || !customEase || context.reducedMotion) return;

  gsap.registerPlugin(customEase);
  try { customEase.create('duck-machine', 'M0,0 C0.2,0.9 0.2,1 1,1'); } catch { /* Ease already registered. */ }
  context.gsapEnabled = true;

  context.gsapContext = gsap.context(() => {
    gsap.fromTo(
      context.root.querySelectorAll('.duck-production__header > *, .duck-production__machine, .duck-production__console'),
      { y: 28, opacity: 0 },
      { y: 0, opacity: 1, duration: .75, stagger: .08, ease: 'duck-machine' }
    );
  }, context.root);
}

export function mount(root, bus = document) {
  destroy();
  const moduleRoot = root?.matches?.(MODULE_SELECTOR) ? root : root?.querySelector?.(MODULE_SELECTOR);
  const eventBus = bus?.addEventListener && bus?.dispatchEvent ? bus : document;

  if (!moduleRoot) throw new Error('DUCK 03: root [data-duck-module="03"] não encontrado.');

  const elements = resolveElements(moduleRoot);
  if (!validateElements(elements)) {
    moduleRoot.dataset.error = 'true';
    moduleRoot.insertAdjacentHTML('afterbegin', '<p role="alert">Motor de produção indisponível: estrutura incompleta.</p>');
    throw new Error('DUCK 03: artifact.html incompleto.');
  }

  const context = {
    root: moduleRoot,
    bus: eventBus,
    elements,
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    cleanup: [],
    observer: null,
    gsapContext: null,
    gsapEnabled: false,
    state: {
      identityTraits: ['jovem', 'tecnológico', 'humano'],
      mood: 'curioso',
      visualRhythm: 'fluido',
      processStage: 'understand',
      intent: 'kinetic',
      energy: 64,
      density: 46
    }
  };

  const listen = (target, type, handler) => {
    target.addEventListener(type, handler);
    context.cleanup.push(() => target.removeEventListener(type, handler));
  };

  elements.stageButtons.forEach((button) => {
    listen(button, 'click', () => {
      context.state.processStage = button.dataset.stageButton;
      render(context);
    });
  });

  listen(elements.intent, 'change', () => {
    context.state.intent = elements.intent.value;
    render(context);
  });

  listen(elements.energy, 'input', () => {
    context.state.energy = clamp(elements.energy.value, 0, 100);
    render(context);
  });

  listen(elements.density, 'input', () => {
    context.state.density = clamp(elements.density.value, 0, 100);
    render(context);
  });

  listen(eventBus, INPUT_EVENT, (event) => {
    const detail = event.detail || {};
    const mood = String(detail.selectedMood ?? detail.mood ?? 'curioso').trim().toLowerCase();
    const preset = MOOD_MAP[mood] || MOOD_MAP.curious;
    context.state.identityTraits = normalizeTraits(detail.identityTraits);
    context.state.mood = mood;
    context.state.visualRhythm = detail.visualRhythm ?? 'fluido';
    context.state.energy = preset.energy;
    context.state.density = preset.density;
    context.state.intent = preset.intent;
    render(context, { received: true });
  });

  if ('IntersectionObserver' in globalThis) {
    context.observer = new IntersectionObserver(([entry]) => {
      moduleRoot.dataset.visible = String(entry.isIntersecting);
    }, { threshold: .08 });
    context.observer.observe(moduleRoot);
  }

  active = context;
  setupGsap(context);
  render(context);
  return { destroy };
}

export function destroy() {
  if (!active) return;
  active.cleanup.forEach((remove) => remove());
  active.observer?.disconnect();
  active.gsapContext?.revert();

  const htmlState = document.documentElement.dataset;
  delete htmlState.duckProcessStage;
  delete htmlState.duckTempoHint;
  delete htmlState.duckTextureHint;
  delete htmlState.duckSpaceHint;
  active = null;
}
