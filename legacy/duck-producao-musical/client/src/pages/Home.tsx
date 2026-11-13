/*
 * Design philosophy: Dark Cinematic — contraste dramático, layout asimétrico,
 * verde botánico luminoso y motion breve para que cada interacción se sienta como
 * una consola de estudio. La interfaz debe comunicar precisión sin perder calor.
 */
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioWaveform,
  CalendarDays,
  ChevronRight,
  CirclePlay,
  Disc3,
  Headphones,
  Instagram,
  MapPin,
  Menu,
  Mic2,
  Music2,
  Radio,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";

const assets = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663751782532/Wip9A8YiuCChf4UGtQpSNg/duck-hero-producer-g2oJ4FuExS3E9acK6SkGPv.webp",
  mixing: "https://d2xsxph8kpxj0f.cloudfront.net/310519663751782532/Wip9A8YiuCChf4UGtQpSNg/duck-mixing-console-FXXjfUQV5ZoUUUAmNQ5Fjh.webp",
  studio: "https://d2xsxph8kpxj0f.cloudfront.net/310519663751782532/Wip9A8YiuCChf4UGtQpSNg/duck-studio-wide-gRFCU9USodSjtViZPFi7wj.webp",
  waves: "https://d2xsxph8kpxj0f.cloudfront.net/310519663751782532/Wip9A8YiuCChf4UGtQpSNg/duck-sound-waves-GWe8JY4dRPXn5M4TMmFpmd.webp",
  logo: "https://d2xsxph8kpxj0f.cloudfront.net/310519663751782532/Wip9A8YiuCChf4UGtQpSNg/duck-logo-6MZQyJuD5h6AXRpKE4rVgb.webp",
};

const navItems = [
  ["sobre", "Sobre"],
  ["servicos", "Serviços"],
  ["catalogo", "Catálogo"],
  ["estudio", "Estúdio"],
  ["contacto", "Contato"],
];

const services = [
  {
    number: "01",
    icon: Music2,
    title: "Produção musical",
    description: "Do primeiro loop à última textura: arranjo, direção e identidade sonora para uma faixa que não passa despercebida.",
    tag: "Beatmaking · Arranjo",
  },
  {
    number: "02",
    icon: SlidersHorizontal,
    title: "Mixagem",
    description: "Profundidade, espaço e impacto. Cada elemento encontra seu lugar sem tirar a personalidade da música.",
    tag: "Balance · Punch",
  },
  {
    number: "03",
    icon: Headphones,
    title: "Masterização",
    description: "O acabamento final com tradução em fones, carro, palco e plataformas de streaming.",
    tag: "Loudness · Release",
  },
  {
    number: "04",
    icon: Mic2,
    title: "Direção vocal",
    description: "Captação, edição e interpretação para transformar uma boa ideia em uma performance que permanece.",
    tag: "Take · Comping",
  },
  {
    number: "05",
    icon: Radio,
    title: "Som para imagem",
    description: "Sound design, trilha e mix para vídeos, campanhas e histórias que precisam ser sentidas antes de explicadas.",
    tag: "Trilha · SFX",
  },
  {
    number: "06",
    icon: Sparkles,
    title: "Consultoria criativa",
    description: "Uma leitura externa e estratégica do projeto para encontrar o som, a narrativa e o próximo passo.",
    tag: "Feedback · Plano",
  },
];

const releases = [
  { title: "Cold feat. Big Murdda", type: "Single", year: "2024", accent: "lime" },
  { title: "For Reaper's Only", type: "EP", year: "2024", accent: "gold" },
  { title: "Slip N Slide", type: "Single", year: "2024", accent: "forest" },
];

const scenes = [
  { label: "01", title: "No silêncio começa", image: assets.hero },
  { label: "02", title: "No detalhe acontece", image: assets.mixing },
  { label: "03", title: "No espaço permanece", image: assets.studio },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scene, setScene] = useState(0);

  const handleNav = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };

  const handleBrief = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("A conversa vai abrir no Instagram. Leva o teu briefing contigo.");
    window.open("https://instagram.com/duck4s", "_blank", "noopener,noreferrer");
  };

  return (
    <main className="duck-page">
      <a className="skip-link" href="#conteudo">Saltar para o conteúdo</a>

      <header className={`site-nav ${menuOpen ? "is-open" : ""}`}>
        <div className="nav-shell">
          <button className="brand-lockup" onClick={() => handleNav("hero")} aria-label="Voltar ao início">
            <span className="brand-mark"><img src={assets.logo} alt="" /></span>
            <span className="brand-signal" aria-hidden="true"><AudioWaveform size={15} /></span>
            <span className="brand-wordmark">DUCK<span>.</span></span>
          </button>
          <span className="brand-caption">Produção musical<br />Aracaju · BR</span>
          <nav className="desktop-nav" aria-label="Navegação principal">
            {navItems.map(([id, label]) => (
              <button key={id} onClick={() => handleNav(id)}>{label}</button>
            ))}
          </nav>
          <button type="button" className="menu-trigger" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-nav" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}>
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        <div id="mobile-nav" className="mobile-nav" hidden={!menuOpen}>
          {navItems.map(([id, label], index) => (
            <button key={id} onClick={() => handleNav(id)}><span>0{index + 1}</span>{label}<ArrowUpRight size={16} /></button>
          ))}
          <a href="https://instagram.com/duck4s" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a>
        </div>
      </header>

      <section id="hero" className="hero-section" aria-labelledby="hero-title">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${scenes[scene].image})` }} aria-hidden="true" />
        <div className="hero-gradient" aria-hidden="true" />
        <div className="hero-grid-lines" aria-hidden="true" />
        <div className="hero-shell" id="conteudo">
          <div className="hero-copy">
            <p className="eyebrow"><span className="eyebrow-dot" /> Studio online · sound with intention</p>
            <h1 id="hero-title">A intenção<br /><em>vira som.</em></h1>
            <p className="hero-lede">Produção musical para artistas que não querem apenas lançar uma faixa — querem construir um universo que se reconhece nos primeiros segundos.</p>
            <div className="hero-actions">
              <button className="button button--primary" onClick={() => handleNav("contacto")}>Começar um projeto <ArrowUpRight size={17} /></button>
              <button className="button button--quiet" onClick={() => handleNav("catalogo")}>Ouvir catálogo <CirclePlay size={17} /></button>
            </div>
          </div>

          <div className="hero-aside">
            <div className="hero-status"><span className="status-pulse" /> Signal online <span>·</span> 2026</div>
            <div className="hero-scene-switcher" aria-label="Mudar imagem do estúdio">
              {scenes.map((item, index) => (
                <button type="button" key={item.label} className={scene === index ? "active" : ""} onClick={() => setScene(index)} aria-pressed={scene === index} aria-label={`Ver cena ${item.label}: ${item.title}`}>
                  <span>{item.label}</span><span className="scene-line" /><span>{item.title}</span>
                </button>
              ))}
            </div>
            <div className="hero-coordinate"><MapPin size={14} /> 10° 56' 21" S · 37° 04' 35" W</div>
          </div>
        </div>
        <div className="hero-footer">
          <div className="hero-microcopy">/ Uma produção por vez, sem atalhos.</div>
          <div className="hero-scroll-hint"><span className="scroll-wheel" /> Desliza para entrar</div>
        </div>
      </section>

      <section className="metrics-strip" aria-label="Dados do portfólio">
        <div className="metric"><strong>36M<span>+</span></strong><span>streams no arquivo Duck</span></div>
        <div className="metric"><strong>40<span>+</span></strong><span>lançamentos catalogados</span></div>
        <div className="metric"><strong>06</strong><span>estações de criação</span></div>
        <div className="metric metric--note"><AudioWaveform size={22} /><span>Precisão técnica.<br />Instinto artístico.</span></div>
      </section>

      <section id="sobre" className="story-section section-shell">
        <div className="section-marker"><span>01</span><span className="marker-rule" /><AudioWaveform className="marker-signal" size={14} aria-hidden="true" /><span>Sobre o processo</span></div>
        <div className="story-grid">
          <div className="story-title-block">
            <p className="section-kicker">Não faço apenas beats.</p>
            <h2>Construo<br /><em>universos.</em></h2>
          </div>
          <div className="story-copy">
            <p className="large-copy">Duck é produtor musical e beatmaker baseado em Aracaju. O trabalho cruza tecnologia de estúdio, escuta atenta e direção criativa para transformar intenção em arquitetura sonora.</p>
            <p>Da primeira referência ao master final, cada decisão precisa responder à mesma pergunta: isso faz a música dizer mais? Se a resposta for sim, seguimos. Se não, abrimos espaço.</p>
            <div className="story-link-row"><button className="text-link" onClick={() => handleNav("contacto")}>Falar sobre uma ideia <ArrowUpRight size={16} /></button><span className="story-year">Desde 2018 · Aracaju</span></div>
          </div>
        </div>
        <div className="story-image-wrap">
          <img src={assets.mixing} alt="Close-up de uma consola de mistura iluminada em verde" loading="lazy" />
          <div className="image-stamp"><span>DUCK</span><span>SONIC<br />ARCHITECTURE</span></div>
          <div className="image-caption">01 / detalhe, não decoração</div>
        </div>
      </section>

      <section id="servicos" className="services-section section-shell">
        <div className="section-marker"><span>02</span><span className="marker-rule" /><AudioWaveform className="marker-signal" size={14} aria-hidden="true" /><span>O que fazemos</span></div>
        <div className="services-intro"><h2>Do primeiro<br /><em>impulso.</em></h2><p>Serviços que respeitam a identidade da faixa e dão forma ao que ainda está só na cabeça. Uma cadeia completa, uma escuta consistente.</p></div>
        <div className="services-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return <article key={service.number} className="service-card">
              <div className="service-top"><span className="service-number">{service.number}</span><Icon size={22} strokeWidth={1.5} /></div>
              <h3>{service.title}</h3><p>{service.description}</p><span className="service-tag">{service.tag}</span><ArrowUpRight className="service-arrow" size={18} />
            </article>;
          })}
        </div>
      </section>

      <section id="catalogo" className="catalogue-section section-shell">
        <div className="catalogue-backdrop" style={{ backgroundImage: `url(${assets.waves})` }} aria-hidden="true" />
        <div className="section-marker section-marker--light"><span>03</span><span className="marker-rule" /><AudioWaveform className="marker-signal" size={14} aria-hidden="true" /><span>Catálogo</span></div>
        <div className="catalogue-heading"><h2>Trabalhos que<br /><em>ficam.</em></h2><a className="text-link text-link--light" href="https://music.apple.com/us/artist/duck4x/1744132409" target="_blank" rel="noreferrer">Abrir Apple Music <ArrowUpRight size={16} /></a></div>
        <div className="release-list">
          {releases.map((release, index) => <a key={release.title} className="release-row" href="https://music.apple.com/us/artist/duck4x/1744132409" target="_blank" rel="noreferrer">
            <span className="release-index">0{index + 1}</span><span className={`release-cover release-cover--${release.accent}`}><Disc3 size={26} /><span className="cover-signal" aria-hidden="true"><i /><i /><i /><i /><i /></span></span><span className="release-title">{release.title}</span><span className="release-meta">{release.type} · {release.year}</span><ArrowUpRight className="release-arrow" size={20} />
          </a>)}
        </div>
        <a className="catalogue-player" href="https://music.apple.com/us/artist/duck4x/1744132409" target="_blank" rel="noreferrer" aria-label="Ouvir o catálogo Duck no Apple Music"><span className="player-button" aria-hidden="true"><CirclePlay size={17} /></span><span className="player-wave" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></span><span>preview / ouvir no Apple Music</span><ArrowUpRight size={15} aria-hidden="true" /></a>
      </section>

      <section id="estudio" className="studio-section section-shell">
        <div className="section-marker"><span>04</span><span className="marker-rule" /><AudioWaveform className="marker-signal" size={14} aria-hidden="true" /><span>O estúdio</span></div>
        <div className="studio-grid"><div className="studio-image"><img src={assets.studio} alt="Estúdio de produção musical profissional com iluminação verde" loading="lazy" /><div className="studio-overlay"><span>ROOM 01</span><span>MONITORING / MIX</span></div></div><div className="studio-copy"><p className="section-kicker">Um espaço para ouvir melhor.</p><h2>O detalhe<br />muda <em>tudo.</em></h2><p>Acústica, monitorização e um setup pensado para sair do ruído. O estúdio é parte do processo — não um cenário atrás dele.</p><div className="studio-facts"><div><span>01</span><strong>Escuta</strong><small>Honesta em cada etapa</small></div><div><span>02</span><strong>Textura</strong><small>Analógica quando importa</small></div><div><span>03</span><strong>Entrega</strong><small>Pronta para o mundo</small></div></div></div></div>
      </section>

      <section id="contacto" className="contact-section section-shell">
        <div className="section-marker"><span>05</span><span className="marker-rule" /><AudioWaveform className="marker-signal" size={14} aria-hidden="true" /><span>Contato</span></div>
        <div className="contact-grid"><div className="contact-heading"><p className="section-kicker">Tens uma faixa a caminho?</p><h2>Vamos dar<br /><em>forma.</em></h2><p>Conta o ponto em que estás, a direção que imaginas e o que precisa acontecer a seguir. O primeiro passo é uma boa conversa.</p><div className="contact-details"><a href="https://instagram.com/duck4s" target="_blank" rel="noreferrer"><Instagram size={17} /> @duck4s <ArrowUpRight size={15} /></a><a href="https://open.spotify.com/artist/duck4x" target="_blank" rel="noreferrer"><Headphones size={17} /> Ouvir no Spotify <ArrowUpRight size={15} /></a><span><CalendarDays size={17} /> Agenda aberta para 2026</span></div></div><form className="brief-form" onSubmit={handleBrief} aria-describedby="form-note"><div className="form-heading"><span>BRIEF / 001</span><span>2 min</span></div><label htmlFor="brief-name">Como te chamas?<input id="brief-name" required type="text" name="name" autoComplete="name" minLength={2} maxLength={80} placeholder="Nome artístico ou banda" /></label><label htmlFor="brief-service">Que tipo de ajuda precisas?<select id="brief-service" name="service" defaultValue="production"><option value="production">Produção musical</option><option value="mix">Mixagem</option><option value="master">Masterização</option><option value="direction">Direção criativa</option></select></label><label htmlFor="brief-message">Fala-me da faixa<textarea id="brief-message" required name="message" rows={4} minLength={12} maxLength={1200} placeholder="Referências, prazo, estado atual..." /></label><button className="button button--primary button--full" type="submit">Enviar briefing <ArrowUpRight size={17} /></button><p id="form-note" className="form-note">Ao enviar, abrimos a conversa no Instagram. O briefing não fica guardado nesta página.</p></form></div>
      </section>

      <footer className="site-footer"><div className="footer-brand"><img src={assets.logo} alt="" /><span>DUCK<span>.</span></span><AudioWaveform className="footer-signal" size={18} aria-hidden="true" /></div><div className="footer-note">Produção musical com intenção.<br />Aracaju, Sergipe · Brasil</div><div className="footer-meta"><span>© {new Date().getFullYear()} Duck</span><span>Built for the signal</span><button onClick={() => scrollToSection("hero")} aria-label="Voltar ao topo"><ArrowDownRight size={17} /></button></div></footer>
    </main>
  );
}
