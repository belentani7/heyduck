/*
 * Direção visual: Arquivo de Artista / Estúdio Editorial Noturno.
 * Esta página representa Lucas, conhecido artisticamente como Duck — um produtor
 * e artista real de Aracaju, com conexão Recife–Aracaju. O texto usa primeira
 * pessoa quando fala da trajetória e evita transformar o artista em empresa genérica.
 */

import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  AudioLines,
  ChevronDown,
  ExternalLink,
  Instagram,
  Mail,
  MapPin,
  Menu,
  Mic2,
  Music2,
  Play,
  SlidersHorizontal,
  Sparkles,
  X,
  Youtube,
} from "lucide-react";

const asset = {
  logo: "/manus-storage/duck-logo-official_1a98cc3d.png",
  portrait: "/manus-storage/duck-portrait-official_9e44349e.jpg",
  mix: "/manus-storage/duck-mix-official_a80c27d6.jpg",
};

const credits = [
  { title: "Posturadona", artist: "Luiz Cinnamon", tags: "Instrumental · Gravação · Mixagem · Masterização", href: "https://youtu.be/KEEfn6lgssM?si=ADs9--kVskAtEmNd" },
  { title: "Tititi", artist: "Leones", tags: "Instrumental · Gravação · Mixagem · Masterização", href: "https://open.spotify.com/intl-pt/track/3edfwApBI2x5QL4MHK13Re?si=7accbb981f9a4e76" },
  { title: "Cheguei Tão Longe", artist: "Leones ft. Chrislops", tags: "Instrumental · Gravação · Mixagem · Masterização", href: "https://www.youtube.com/watch?v=Uxt24afz3HM" },
  { title: "I Wrote a Song", artist: "Belentani", tags: "Instrumental · Mixagem · Masterização", href: "https://www.youtube.com/watch?v=2iaAAzN0__Y" },
  { title: "Heart Breaking", artist: "Belentani", tags: "Instrumental · Mixagem · Masterização", href: "https://www.youtube.com/watch?v=5MClO2y0OLM" },
  { title: "Contra a Parede", artist: "Jullya Murvack", tags: "Gravação · Mixagem · Masterização", href: "https://www.youtube.com/watch?v=8WbLyUPDGVE" },
];

const services = [
  { number: "01", icon: Music2, title: "Instrumental", description: "Construção de beats e instrumentais para a música ter base, movimento e personalidade." },
  { number: "02", icon: Mic2, title: "Gravação", description: "Captação para transformar uma interpretação, uma voz e uma ideia em material de verdade." },
  { number: "03", icon: SlidersHorizontal, title: "Mixagem", description: "Equilíbrio e profundidade para cada elemento encontrar o lugar certo na faixa." },
  { number: "04", icon: AudioLines, title: "Masterização", description: "O acabamento que prepara o som para chegar consistente às plataformas." },
];

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigate = (id: string) => {
    setMenuOpen(false);
    scrollToSection(id);
  };
  const ActiveServiceIcon = services[activeService].icon;

  return (
    <div className="site-shell">
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <a className="brand-lockup" href="#top" aria-label="Duck — início">
          <img src={asset.logo} alt="Duck" className="brand-mark" />
          <span className="brand-caption">Lucas / produtor e artista</span>
        </a>
        <button className="menu-toggle" aria-expanded={menuOpen} aria-controls="primary-navigation" onClick={() => setMenuOpen((open) => !open)}>
          <span>{menuOpen ? "Fechar" : "Menu"}</span>
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
        <nav id="primary-navigation" className={`primary-nav ${menuOpen ? "is-open" : ""}`}>
          <a href="#sobre" onClick={() => setMenuOpen(false)}>Sobre mim</a>
          <a href="#portfolio" onClick={() => setMenuOpen(false)}>Portfólio</a>
          <a href="#processo" onClick={() => setMenuOpen(false)}>Processo</a>
          <Link href="/singles" onClick={() => setMenuOpen(false)}>Singles</Link>
          <Link href="/studio" onClick={() => setMenuOpen(false)}>Studio</Link>
          <a href="#contato" onClick={() => setMenuOpen(false)}>Contato</a>
          <a className="nav-cta" href="https://duck.46graus.com/" target="_blank" rel="noreferrer">Site oficial <ExternalLink size={14} /></a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section artist-hero" aria-labelledby="hero-title">
          <div className="hero-media" aria-hidden="true"><img src={asset.portrait} alt="" /></div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-grid" aria-hidden="true" />
          <div className="hero-content page-frame">
            <div className="hero-kicker"><span className="live-dot" /> Recife ↔ Aracaju · Brasil</div>
            <p className="artist-intro">Eu sou Lucas.<br /><span>Você pode me chamar de Duck.</span></p>
            <h1 id="hero-title">A música<br /><em>é o meu jeito.</em></h1>
            <p className="hero-lede">Sou produtor musical e artista. Transformo ideias, vozes e referências em beats, gravações, mixagens e músicas com identidade.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => navigate("contato")}>Falar comigo <ArrowDownRight size={18} /></button>
              <a className="text-link" href="#portfolio">Ver trabalhos <span>↘</span></a>
            </div>
          </div>
          <div className="hero-side-note" aria-hidden="true"><span>DUCK / LUCAS</span><span>ARTISTA · PRODUTOR · AUTODIDATA</span></div>
          <div className="hero-scroll-hint"><span>desça para conhecer a história</span><ChevronDown size={16} /></div>
        </section>

        <section className="signal-strip" aria-label="Assinatura artística">
          <div className="signal-wave"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
          <div className="signal-copy"><Sparkles size={15} /> som com identidade</div>
          <div className="signal-wave signal-wave-right"><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /><span /></div>
        </section>

        <section className="intro-section page-frame" id="sobre">
          <div className="section-marker">01 / sobre mim</div>
          <div className="intro-layout">
            <div className="intro-statement">
              <p className="eyebrow">uma história feita à mão</p>
              <h2>Eu não tinha um estúdio. Então <em>aprendi.</em></h2>
              <p className="body-copy">Meu nome verdadeiro é Lucas, mas provavelmente você já me conhece como Duck. Meu caminho com a música começou aos 12 anos. Entre os 14 e 16, estudei guitarra e teoria musical no Conservatório de Música de Sergipe.</p>
              <p className="body-copy">Aos 17, quis tirar minhas composições do papel. Como não tinha dinheiro para ir a um studio, aprendi pela internet a gravar e produzir em casa. Desde então, sigo estudando, investindo em equipamento e fazendo a qualidade do trabalho falar por si.</p>
              <a className="arrow-link" href="https://duck.46graus.com/sobre-mim/" target="_blank" rel="noreferrer">Ler minha história completa <ArrowUpRight size={17} /></a>
            </div>
            <figure className="editorial-image intro-image portrait-frame">
              <img src={asset.mix} alt="Duck trabalhando em uma sessão de mixagem" loading="lazy" />
              <figcaption><span>Aracaju / Sergipe</span><span>desde 2021</span></figcaption>
            </figure>
          </div>
        </section>

        <section className="numbers-section page-frame" aria-label="Marcos da trajetória">
          <div className="numbers-heading"><span className="eyebrow">um caminho em movimento</span><AudioLines size={28} strokeWidth={1.2} /></div>
          <div className="numbers-grid">
            <div className="number-item"><strong>12<span>anos</span></strong><small>quando comecei na música</small></div>
            <div className="number-item"><strong>2021</strong><small>primeiro curso de produção</small></div>
            <div className="number-item"><strong>∞</strong><small>faixas ainda por criar</small></div>
            <div className="number-note"><span>o ponto de partida</span><p>Do violão improvisado ao trabalho para artistas do Brasil e do exterior.</p></div>
          </div>
        </section>

        <section className="portfolio-section page-frame" id="portfolio">
          <div className="services-header portfolio-header">
            <div><div className="section-marker">02 / portfólio</div><h2>Algumas faixas<br />que carregam <em>meu som.</em></h2></div>
            <p className="services-intro">Instrumental, gravação, mixagem e masterização. Cada crédito abaixo vem do meu portfólio público.</p>
          </div>
          <div className="credits-grid">
            {credits.map((credit, index) => (
              <a key={credit.title} className={`credit-card credit-${index + 1}`} href={credit.href} target="_blank" rel="noreferrer">
                <span className="credit-index">0{index + 1}</span>
                <span className="credit-play"><Play size={15} fill="currentColor" /></span>
                <span className="credit-title">{credit.title}</span>
                <span className="credit-artist">{credit.artist}</span>
                <span className="credit-tags">{credit.tags}</span>
                <ArrowUpRight className="credit-arrow" size={18} />
              </a>
            ))}
          </div>
          <a className="arrow-link portfolio-more" href="https://duck.46graus.com/portfolio/" target="_blank" rel="noreferrer">Ver o portfólio completo <ArrowUpRight size={17} /></a>
        </section>

        <section className="services-section page-frame" id="processo">
          <div className="services-header">
            <div><div className="section-marker">03 / o que eu faço</div><h2>Da ideia<br />ao <em>arquivo final.</em></h2></div>
            <p className="services-intro">Você pode chegar com uma referência, uma voz no celular ou apenas uma sensação. Eu encontro o caminho a partir daí.</p>
          </div>
          <div className="services-layout">
            <div className="services-list">
              {services.map((service, index) => {
                const Icon = service.icon;
                return <button key={service.number} className={`service-row ${activeService === index ? "is-active" : ""}`} onClick={() => setActiveService(index)} aria-pressed={activeService === index}><span className="service-number">{service.number}</span><span className="service-icon"><Icon size={21} strokeWidth={1.4} /></span><span className="service-title">{service.title}</span><ArrowUpRight className="service-arrow" size={18} /></button>;
              })}
            </div>
            <div className="service-detail-panel"><div className="detail-topline"><span>meu processo</span><span>{services[activeService].number} / 04</span></div><div className="detail-icon"><ActiveServiceIcon size={30} strokeWidth={1.2} /></div><h3>{services[activeService].title}</h3><p>{services[activeService].description}</p><div className="detail-footer"><span>DUCK / workflow</span><span className="detail-wave">∿∿∿</span></div></div>
          </div>
        </section>

        <section className="process-section artist-story">
          <div className="page-frame process-layout">
            <div className="process-image-wrap"><img src={asset.portrait} alt="Retrato de Duck em ambiente musical" loading="lazy" /><span className="image-stamp">feito<br />em casa</span></div>
            <div className="process-content"><div className="section-marker">04 / de onde eu vim</div><h2>Autodidata não é estar sozinho. É <em>continuar buscando.</em></h2><p className="body-copy">Eu comecei sem dinheiro para um studio e sem equipamento ideal. Aprendi o que precisava, lancei meus sons, recebi os primeiros contatos e fui transformando cada limite em motivo para estudar mais.</p><div className="process-list"><div className="process-step"><span>01</span><div><h3>Aprender</h3><p>Violão, guitarra, teoria musical e produção aprendidos na prática.</p></div></div><div className="process-step"><span>02</span><div><h3>Experimentar</h3><p>Compor, gravar em casa e testar caminhos até encontrar uma assinatura.</p></div></div><div className="process-step"><span>03</span><div><h3>Entregar</h3><p>Fazer a técnica servir à música e deixar o resultado falar por si.</p></div></div></div></div>
          </div>
        </section>

        <section className="manifesto-section page-frame"><div className="manifesto-mark"><img src={asset.logo} alt="Duck" /></div><div className="manifesto-copy"><span className="eyebrow">nota do artista</span><blockquote>“Eu não gosto de passar vontade. Se existe uma música para fazer, eu <em>aprendo como.</em>”</blockquote><span className="manifesto-signature">LUCAS / DUCK</span></div></section>

        <section className="contact-section page-frame" id="contato">
          <div className="contact-card contact-card-single">
            <div className="contact-copy">
              <div className="section-marker">05 / contato</div>
              <h2>Vamos fazer<br /><em>uma faixa?</em></h2>
              <p>Me conte o que você está construindo, em que ponto a música está e o que ela precisa dizer. Trabalho a partir de Aracaju e também de forma virtual para qualquer lugar.</p>
              <div className="contact-links contact-links-grid">
                <a href="https://wa.me/5579996026590" target="_blank" rel="noreferrer"><MapPin size={17} /> WhatsApp · 55 79 99602-6590 <ArrowUpRight size={15} /></a>
                <a href="mailto:Duck-beats@hotmail.com"><Mail size={17} /> Duck-beats@hotmail.com <ArrowUpRight size={15} /></a>
                <a href="https://www.instagram.com/duck4s/" target="_blank" rel="noreferrer"><Instagram size={17} /> @duck4s <ArrowUpRight size={15} /></a>
                <a href="https://www.youtube.com/channel/UCx7_hepVm10ulxHGWuvjjBg" target="_blank" rel="noreferrer"><Youtube size={17} /> Canal no YouTube <ArrowUpRight size={15} /></a>
                <a href="https://duck.46graus.com/" target="_blank" rel="noreferrer"><ExternalLink size={17} /> Visitar Site Oficial (46graus) <ArrowUpRight size={15} /></a>
              </div>
            </div>
          </div>
          <div className="location-line"><MapPin size={16} /> Recife ↔ Aracaju · Brasil <span /> produção e atendimento online</div>
        </section>
      </main>

      <footer className="site-footer page-frame"><a className="brand-lockup footer-brand" href="#top" aria-label="Voltar ao início"><img src={asset.logo} alt="Duck" className="brand-mark" /><span className="brand-caption">Lucas / Duck</span></a><span>© {new Date().getFullYear()} Lucas / Duck</span><a href="#top" className="footer-top">voltar ao topo ↑</a></footer>
    </div>
  );
}
