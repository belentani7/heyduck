/*
 * Duckweb / Terminal Roja Autárquica
 * Página principal: archivo musical, sistemas creativos y manifiesto.
 * La UI debe sentirse como un estudio independiente: precisa, oscura y legible.
 */
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  ChevronRight,
  Circle,
  ExternalLink,
  Headphones,
  Menu,
  Play,
  Radio,
  ScanLine,
  Sparkles,
  X,
} from "lucide-react";

const heroImage = "/manus-storage/duckweb-hero_6aae9292.jpg";
const archiveImage = "/manus-storage/duckweb-studio-fallback_ec08eacf.jpg";
const fluxImage = "/manus-storage/duckweb-redroom-fallback_72a46f1c.jpg";
const markImage = "/manus-storage/duckprod-mark_3a731169.png";

const navItems = [
  { id: "signal", label: "Signal" },
  { id: "archivo", label: "Archivo" },
  { id: "sistemas", label: "Sistemas" },
  { id: "manifiesto", label: "Manifiesto" },
];

const tracks = [
  { title: "JUDAS", type: "single / 2026", duration: "04:12" },
  { title: "THERAPIST", type: "demo / studio", duration: "03:48" },
  { title: "AMERICA HAS A PROBLEM", type: "field note", duration: "03:21" },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 22);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (id: string) => {
    setMobileOpen(false);
    scrollToId(id);
  };

  return (
    <div className="site-shell">
      <div className="scanline" aria-hidden="true" />
      <header className={`site-header ${scrolled ? "site-header--scrolled" : ""}`}>
        <button className="brand-lockup" aria-label="Duck Prod, volver al inicio" onClick={() => scrollToId("signal")}>
          <img src={markImage} alt="" className="brand-mark" />
          <span className="brand-wordmark">DUCK<span>PROD</span></span>
        </button>
        <div className="header-status" aria-label="Estado del estudio">
          <span className="status-dot" />
          <span>STUDIO / ONLINE</span>
        </div>
        <nav className="desktop-nav" aria-label="Navegación principal">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)}>
              <span className="nav-index">0{navItems.indexOf(item) + 1}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="menu-toggle" aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMobileOpen((open) => !open)}>
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {mobileOpen && (
        <div className="mobile-nav" role="dialog" aria-label="Navegación móvil">
          {navItems.map((item) => (
            <button key={item.id} onClick={() => handleNav(item.id)}>
              <span>0{navItems.indexOf(item) + 1}</span>
              {item.label}
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      )}

      <aside className="side-index" aria-label="Índice de la página">
        <div className="side-index__topline"><span className="status-dot" /> LIVE INDEX</div>
        <span className="side-index__vertical">DUCK PROD / BELENTANI / 2026</span>
        <div className="side-index__ticks">
          {navItems.map((item, index) => (
            <button key={item.id} aria-label={`Ir a ${item.label}`} onClick={() => handleNav(item.id)}>
              <span>0{index + 1}</span>
              <i />
            </button>
          ))}
        </div>
      </aside>

      <main>
        <section className="hero-section section-shell" id="signal">
          <div className="hero-copy reveal-up">
            <div className="eyebrow"><span className="eyebrow-line" /> DUCK PROD / ARCHIVE 001</div>
            <h1>La presión<br /><em>se convierte</em><br />en forma.</h1>
            <p className="hero-lede">Música, sistemas y pensamiento desde un estudio independiente. El archivo de Belentani no pide permiso: construye su propia frecuencia.</p>
            <div className="hero-actions">
              <button className="button button--primary" onClick={() => handleNav("archivo")}>
                Escuchar el archivo <ArrowDownRight size={16} />
              </button>
              <button className="text-link" onClick={() => handleNav("manifiesto")}>
                Leer el manifiesto <ChevronRight size={15} />
              </button>
            </div>
            <div className="hero-metadata">
              <div><span>LOC</span><strong>L'HOSPITALET</strong></div>
              <div><span>MODE</span><strong>AUTÁRQUICO</strong></div>
              <div><span>OUTPUT</span><strong>UNLIMITED</strong></div>
            </div>
          </div>
          <div className="hero-visual reveal-up reveal-delay-2">
            <div className="hero-frame">
              <img src={heroImage} alt="Estudio musical nocturno con señal roja y equipo analógico" />
              <div className="hero-frame__grid" aria-hidden="true" />
              <div className="frame-label frame-label--top">REC / 001 <span className="frame-signal" /></div>
              <div className="frame-label frame-label--bottom">43° 21' 16.8&quot; N<br />02° 05' 41.9&quot; E</div>
              <div className="frame-corner frame-corner--tl" />
              <div className="frame-corner frame-corner--br" />
            </div>
            <div className="hero-caption"><span>01</span><span>THE ROOM WHERE THE SIGNAL STARTS</span><span>© DUCK PROD</span></div>
          </div>
          <div className="hero-side-note"><span>NOT A LABEL</span><strong>A PRIVATE<br />FREQUENCY</strong></div>
        </section>

        <section className="ticker" aria-label="Estado de transmisión">
          <div className="ticker-track"><span>DUCK PROD</span><i /> <span>BELENTANI</span><i /> <span>JUDAS / ARCHIVE 001</span><i /> <span>KEEP THE SIGNAL CLEAN</span><i /> <span>DUCK PROD</span><i /> <span>BELENTANI</span><i /></div>
        </section>

        <section className="archive-section section-shell" id="archivo">
          <div className="section-heading">
            <div className="section-number">02</div>
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> Archivo sonoro</div>
              <h2>Lo que queda<br /><em>cuando todo calla.</em></h2>
            </div>
            <p>Una selección de piezas, notas y sesiones que convierten la experiencia en una superficie de escucha. Pulsa play para abrir cada registro.</p>
          </div>
          <div className="console-cue console-cue--archive"><span>ARCHIVE_CONSOLE / 001</span><span>SYNC 100%</span><span className="console-cue__bars"><i /><i /><i /><i /><i /></span></div>
          <div className="archive-layout">
            <div className="archive-image-wrap">
              <img src={archiveImage} alt="Mesa de producción musical iluminada en rojo" />
              <div className="archive-image-overlay"><span>DUCK ARCHIVE</span><strong>001 / 003</strong></div>
            </div>
            <div className="track-list" aria-label="Lista de canciones">
              {tracks.map((track, index) => (
                <button key={track.title} className={`track-row ${activeTrack === track.title ? "track-row--active" : ""}`} onClick={() => setActiveTrack(activeTrack === track.title ? null : track.title)}>
                  <span className="track-number">0{index + 1}</span>
                  <span className="track-icon">{activeTrack === track.title ? <AudioLines size={17} /> : <Play size={15} fill="currentColor" />}</span>
                  <span className="track-main"><strong>{track.title}</strong><small>{track.type}</small></span>
                  <span className="track-duration">{track.duration}</span>
                  <ArrowUpRight size={16} className="track-arrow" />
                </button>
              ))}
              <div className="track-footer"><span><Circle size={8} fill="currentColor" /> 3 registros listos</span><span>DUCK PROD / 2026</span></div>
            </div>
          </div>
          <div className="player-bar" aria-live="polite">
            <div className="player-bar__left"><Headphones size={17} /><span>{activeTrack ? `Reproduciendo: ${activeTrack}` : "Selecciona un registro para escuchar"}</span></div>
            <div className="player-wave" aria-hidden="true">{Array.from({ length: 30 }).map((_, index) => <i key={index} style={{ height: `${10 + ((index * 13) % 22)}px` }} />)}</div>
            <span className="player-bar__mode">LOCAL / NO ADS</span>
          </div>
        </section>

        <section className="systems-section section-shell" id="sistemas">
          <div className="section-heading section-heading--systems">
            <div className="section-number">03</div>
            <div>
              <div className="eyebrow"><span className="eyebrow-line" /> Sistemas propios</div>
              <h2>La misma mente.<br /><em>Otra herramienta.</em></h2>
            </div>
            <p>Cuando la música no basta, el sistema toma el relevo. Proyectos de IA local, automatización y privacidad para construir sin ceder el control.</p>
          </div>
          <div className="console-cue console-cue--systems"><span>PRIVATE_SYSTEMS / 002</span><span>LOCAL-FIRST</span><span className="console-cue__coordinates">41.36 / 02.10</span></div>
          <div className="system-feature">
            <div className="system-feature__visual"><img src={fluxImage} alt="Visual abstracta de ondas y datos en rojo" /><div className="system-visual-label"><Radio size={14} /> LIVE PROTOCOL / 002</div></div>
            <div className="system-feature__copy"><span className="system-tag">01 / CASSANDRA FLUX</span><h3>Un sistema que escucha el contexto.</h3><p>Una exploración de inteligencia artificial local para mapear patrones, conversaciones y señales sin convertir la vida privada en mercancía. Cassandra Flux nace entre la psicología, la ingeniería y la necesidad de mantener los datos cerca de quien los genera.</p><button className="outline-link" onClick={() => setActiveTrack("CASSANDRA FLUX / PROTOTYPE")}>Abrir ficha de proyecto <ExternalLink size={15} /></button></div>
          </div>
          <div className="system-cards">
            <article className="system-card"><div className="system-card__top"><span>02 / OPENCLAW</span><Sparkles size={17} /></div><h3>Automatizar sin perder la intención.</h3><p>Agentes y herramientas que hacen el trabajo repetible visible, ajustable y propio.</p><span className="card-status"><i /> en desarrollo</span></article>
            <article className="system-card system-card--dark"><div className="system-card__top"><span>03 / PRIVATE MODELS</span><ScanLine size={17} /></div><h3>La privacidad también es una estética.</h3><p>Modelos locales, flujos transparentes y una relación distinta con la infraestructura.</p><span className="card-status"><i /> protocolo activo</span></article>
          </div>
        </section>

        <section className="manifesto-section section-shell" id="manifiesto">
          <div className="manifesto-scan-corner" aria-hidden="true"><span>MANIFESTO / 004</span><span>FORM &gt; SIGNAL</span></div>
          <div className="manifesto-number">04</div>
          <div className="manifesto-copy"><div className="eyebrow"><span className="eyebrow-line" /> Manifiesto de estudio</div><blockquote>“No necesito una audiencia para empezar. Necesito una señal que no mienta.”</blockquote><p>Duck Prod es una práctica autárquica: hacer música y sistemas desde la misma raíz, con la precisión de quien escucha antes de hablar y la paciencia de quien sabe que una obra necesita su propio tiempo. El objetivo no es parecer ocupado. Es dejar una forma que resista.</p><div className="manifesto-signature"><span>PM</span><div><strong>PEDRO MARCOS<br />SANTOS BELENTANI</strong><small>ARTISTA / SYSTEMS BUILDER / PRODUCER</small></div></div></div>
          <div className="manifesto-side"><span>THE SIGNAL IS<br />STILL CLEAN.</span><div className="manifesto-cross">+</div><small>COORD 41.363 / 2.101<br />DUCK PROD NODE</small></div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><img src={markImage} alt="" className="brand-mark" /><span>DUCK<span>PROD</span></span></div>
        <div className="footer-note">Música y sistemas desde una frecuencia propia.<br />Archivo independiente / 2026.</div>
        <div className="footer-links"><a href="#signal">Inicio</a><a href="#archivo">Escuchar</a><a href="#sistemas">Proyectos</a></div>
        <div className="footer-end">© DUCK PROD<br /><span>MADE WITH INTENT</span></div>
      </footer>
    </div>
  );
}
