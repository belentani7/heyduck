/*
 * Singles / direção: arquivo vivo de artista.
 * La cuadrícula queda como índice; el escenario principal se comporta como una
 * vitrina cinética: la portada entra en profundidad, el vinilo se libera desde
 * detrás, el puntero modifica la perspectiva y el usuario puede avanzar con
 * teclado, rueda o controles explícitos. La experiencia no diagnostica nada:
 * describe la escucha en capas como oficio, atención y percepción musical.
 */

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowLeft, ArrowUpRight, ChevronLeft, ChevronRight, Disc3, Headphones, Layers3, MousePointer2, Pause, Play, Sparkles } from "lucide-react";
import { Link } from "wouter";
import ShaderBackdrop from "@/components/ShaderBackdrop";

const covers = [
  { title: "Posturadona", artist: "Luiz Cinnamon", type: "Instrumental · Gravação · Mixagem · Masterização", image: "/manus-storage/posturadona_9e3da23e.png", href: "https://youtu.be/KEEfn6lgssM?si=ADs9--kVskAtEmNd", tone: "green" },
  { title: "Tititi", artist: "Leones", type: "Instrumental · Gravação · Mixagem · Masterização", image: "/manus-storage/tititi_ccc1cdb3.png", href: "https://open.spotify.com/intl-pt/track/3edfwApBI2x5QL4MHK13Re?si=7accbb981f9a4e76", tone: "violet" },
  { title: "Cheguei Tão Longe", artist: "Leones ft. Chrislops", type: "Instrumental · Gravação · Mixagem · Masterização", image: "/manus-storage/cheguei_371e900f.png", href: "https://www.youtube.com/watch?v=Uxt24afz3HM", tone: "cream" },
  { title: "I Wrote a Song", artist: "Belentani", type: "Instrumental · Mixagem · Masterização", image: "/manus-storage/i-wrote-a-song_2cbcd3e9.jpg", href: "https://www.youtube.com/watch?v=2iaAAzN0__Y", tone: "blue" },
  { title: "Heart Breaking", artist: "Belentani", type: "Instrumental · Mixagem · Masterização", image: "/manus-storage/heart-breaking_b9462557.jpg", href: "https://www.youtube.com/watch?v=5MClO2y0OLM", tone: "red" },
  { title: "Baila conmigo", artist: "Belentani", type: "Instrumental · Mixagem · Masterização", image: "/manus-storage/baila-conmigo_cbb3e91e.jpg", href: "https://www.youtube.com/watch?v=4Hsy6TKp6ys", tone: "orange" },
];

export default function Singles() {
  const stageRef = useRef<HTMLElement>(null);
  const stageArtRef = useRef<HTMLDivElement>(null);
  const stageSleeveRef = useRef<HTMLDivElement>(null);
  const stageVinylRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const previousIndexRef = useRef(0);
  const wheelLockRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const activeCover = covers[activeIndex];

  const goTo = (nextIndex: number) => {
    setActiveIndex((current) => (nextIndex + covers.length) % covers.length || (current === 0 && nextIndex < 0 ? covers.length - 1 : (nextIndex + covers.length) % covers.length));
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => { reducedMotionRef.current = media.matches; if (media.matches) setAutoplay(false); };
    syncMotion();
    media.addEventListener("change", syncMotion);
    return () => media.removeEventListener("change", syncMotion);
  }, []);

  useEffect(() => {
    if (!autoplay || reducedMotionRef.current) return;
    const timer = window.setInterval(() => setActiveIndex((current) => (current + 1) % covers.length), 6200);
    return () => window.clearInterval(timer);
  }, [autoplay, activeIndex]);

  useEffect(() => {
    const stage = stageRef.current;
    const art = stageArtRef.current;
    const sleeve = stageSleeveRef.current;
    const vinyl = stageVinylRef.current;
    if (!stage || !art || !sleeve || !vinyl) return;
    stage.dataset.tone = activeCover.tone;
    const direction = activeIndex >= previousIndexRef.current ? 1 : -1;
    previousIndexRef.current = activeIndex;
    if (reducedMotionRef.current) {
      gsap.set([art, sleeve, vinyl], { clearProps: "all" });
      return;
    }
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });
    timeline.set(art, { x: direction * 180, y: 20, rotateY: direction * -26, rotateZ: direction * -4, scale: 0.82, opacity: 0, transformPerspective: 1200 })
      .set(vinyl, { x: direction * -170, rotate: direction * -35, scale: 0.72, opacity: 0.2 })
      .set(sleeve, { rotateZ: direction * 8 })
      .to(art, { x: 0, y: 0, rotateY: 0, rotateZ: 0, scale: 1, opacity: 1, duration: 1.05, ease: "expo.out" })
      .to(vinyl, { x: 0, rotate: direction * 360, scale: 1, opacity: 1, duration: 1.25, ease: "power3.out" }, "<0.08")
      .to(sleeve, { rotateZ: 0, duration: 0.72, ease: "back.out(1.5)" }, "<0.15");
    return () => { timeline.kill(); };
  }, [activeCover.tone, activeIndex]);

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (reducedMotionRef.current || !stageRef.current || !stageArtRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    gsap.to(stageArtRef.current, { rotateY: x * 13, rotateX: y * -9, x: x * 15, y: y * 10, duration: 0.55, ease: "power3.out", overwrite: "auto" });
    if (stageVinylRef.current) gsap.to(stageVinylRef.current, { x: x * 30, y: y * 18, rotation: x * 8, duration: 0.75, ease: "power2.out", overwrite: "auto" });
  };

  const handlePointerLeave = () => {
    if (reducedMotionRef.current) return;
    if (stageArtRef.current) gsap.to(stageArtRef.current, { rotateY: 0, rotateX: 0, x: 0, y: 0, duration: 0.8, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
    if (stageVinylRef.current) gsap.to(stageVinylRef.current, { x: 0, y: 0, rotation: 0, duration: 0.8, ease: "elastic.out(1, 0.55)", overwrite: "auto" });
  };

  const handleWheel = (event: React.WheelEvent<HTMLElement>) => {
    if (Math.abs(event.deltaY) < 24 || wheelLockRef.current) return;
    wheelLockRef.current = true;
    goTo(activeIndex + (event.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => { wheelLockRef.current = false; }, 760);
  };

  const handleStageKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") { event.preventDefault(); goTo(activeIndex + 1); }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") { event.preventDefault(); goTo(activeIndex - 1); }
  };

  const selectFromCatalog = (index: number) => {
    setActiveIndex(index);
    stageRef.current?.scrollIntoView({ behavior: reducedMotionRef.current ? "auto" : "smooth", block: "center" });
  };

  return (
    <div className="singles-page">
      <ShaderBackdrop className="singles-shader" variant="violet" />
      <header className="singles-header page-frame"><Link href="/" className="back-link"><ArrowLeft size={16} /> início</Link><span className="singles-header-mark">DUCK / catálogo vivo</span><Link href="/studio" className="studio-link">abrir Studio <ArrowUpRight size={15} /></Link></header>
      <main>
        <section className="singles-hero page-frame"><div className="section-marker">arquivo de faixas / 2026</div><div className="singles-hero-layout"><div><h1>Singles que<br /><em>ficam girando.</em></h1><p>Uma coleção de trabalhos, créditos e colaborações de Duck. Agora o catálogo se comporta como uma vitrine: a faixa entra, a capa respira e o disco nunca fica totalmente parado.</p></div><div className="catalog-note"><Headphones size={21} /><span>pop · pop br<br />trap · hiphop</span></div></div></section>

        <section ref={stageRef} className="cinematic-stage page-frame" data-tone={activeCover.tone} aria-label="Vitrine cinética de singles" tabIndex={0} onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onWheel={handleWheel} onKeyDown={handleStageKeyDown}>
          <div className="stage-light" aria-hidden="true" /><div className="stage-grid" aria-hidden="true" /><div className="stage-grain" aria-hidden="true" />
          <div className="stage-topline"><span><Disc3 size={15} /> objeto {String(activeIndex + 1).padStart(2, "0")} / 06</span><button className="stage-autoplay" type="button" onClick={() => setAutoplay((value) => !value)} aria-label={autoplay ? "Pausar troca automática" : "Ativar troca automática"}>{autoplay ? <Pause size={13} /> : <Play size={13} />}{autoplay ? "movimento ao vivo" : "pausado"}</button></div>
          <div className="stage-layout">
            <div className="stage-copy"><span className="stage-kicker">single selecionado / {activeCover.type}</span><h2>{activeCover.title}</h2><p className="stage-artist">{activeCover.artist}</p><p className="stage-caption">Uma colaboração arquivada no corpo do som. A capa é superfície; o vinil é o que continua escapando.</p><div className="stage-actions"><a className="button button-primary" href={activeCover.href} target="_blank" rel="noreferrer"><Play size={16} fill="currentColor" /> escutar faixa</a><span className="stage-gesture"><MousePointer2 size={14} /> aponta / gira / escolhe</span></div></div>
            <div className="stage-art-space"><div ref={stageArtRef} className="stage-art"><div ref={stageVinylRef} className="stage-vinyl" aria-hidden="true"><span className="stage-vinyl-label">DUCK</span><span className="stage-vinyl-groove groove-one" /><span className="stage-vinyl-groove groove-two" /></div><div ref={stageSleeveRef} className="stage-sleeve"><img src={activeCover.image} alt={`Capa de ${activeCover.title}`} /><span className="sleeve-shine" /></div><span className="stage-art-shadow" /></div></div>
          </div>
          <div className="stage-controls"><button type="button" className="stage-arrow" onClick={() => goTo(activeIndex - 1)} aria-label="Single anterior"><ChevronLeft size={21} /></button><div className="stage-progress" role="tablist" aria-label="Selecionar single">{covers.map((cover, index) => <button type="button" key={cover.title} className={index === activeIndex ? "is-active" : ""} onClick={() => goTo(index)} role="tab" aria-selected={index === activeIndex} aria-label={`Selecionar ${cover.title}`}><span /></button>)}</div><button type="button" className="stage-arrow" onClick={() => goTo(activeIndex + 1)} aria-label="Próximo single"><ChevronRight size={21} /></button></div>
          <div className="stage-footnote"><span><Layers3 size={14} /> usa as setas, a roda ou o teclado</span><span>o som muda de pele</span></div>
        </section>

        <section className="singles-catalog page-frame" ref={cardsRef} aria-label="Índice do catálogo de singles">{covers.map((cover, index) => <button key={cover.title} type="button" className={`single-card single-tone-${cover.tone} ${index === activeIndex ? "is-selected" : ""}`} data-single-card onClick={() => selectFromCatalog(index)}><div className="single-index">0{index + 1} / 06</div><div className="record-stage"><div className="vinyl-record" data-vinyl><span className="record-label">DUCK</span><span className="record-groove groove-a" /><span className="record-groove groove-b" /></div><div className="sleeve" data-sleeve><img src={cover.image} alt={`Capa de ${cover.title}`} loading="lazy" /><span className="sleeve-shine" /></div></div><div className="single-meta"><div><h2>{cover.title}</h2><p>{cover.artist}</p></div><ArrowUpRight size={18} /><span className="single-type">abrir no palco cinético · {cover.type}</span></div></button>)}</section>

        <section className="sound-layers page-frame"><div className="sound-layers-mark"><Sparkles size={27} /></div><div className="sound-layers-copy"><span className="eyebrow">escuta em camadas</span><h2>Duck escuta uma faixa como quem abre uma <em>mesa de mixagem.</em></h2><p>Na prática musical, isso descreve uma atenção treinada para perceber simultaneamente relações de timbre, frequência, dinâmica, espaço e intenção. Em vez de ouvir apenas “a música inteira”, ele procura o que cada camada está fazendo e como uma escolha altera a outra.</p><p>É uma linguagem de ofício — uma maneira de explicar uma percepção artística e técnica desenvolvida com estudo, repetição e trabalho real. Não é um diagnóstico clínico nem uma afirmação de capacidades sobrenaturais: é escuta crítica aplicada à produção.</p><div className="sound-layer-tags"><span>timbre</span><span>frequência</span><span>dinâmica</span><span>espaço</span><span>intenção</span></div></div></section>

        <section className="international-section page-frame"><div className="international-label"><span className="live-dot" /> alcance</div><div><h2>De Aracaju para artistas de todo o Brasil e do exterior.</h2><p>Duck trabalha com projetos conectados ao Brasil e também com artistas e colaborações que atravessam fronteiras — incluindo Estados Unidos e Europa — de forma presencial ou virtual.</p><a className="arrow-link" href="https://duck.46graus.com/portfolio/" target="_blank" rel="noreferrer">ver créditos completos <ArrowUpRight size={17} /></a></div></section>
      </main>
      <footer className="singles-footer page-frame"><span>Lucas / Duck</span><Link href="/studio">próximo: Studio →</Link></footer>
    </div>
  );
}
