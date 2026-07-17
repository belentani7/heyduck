// DUCK — Datos compartidos para todas las versiones
// Singles/EPs + Portfolio + Info

const DUCK_SINGLES = [
  {name:"For Reaper's Only",type:"EP",url:"https://music.apple.com/us/album/for-reapers-only-ep/1768570067",cover:"images/covers/for-reapers-only-ep.jpg",tracks:"WTF · Intro · No Hook · Last Warning · Skilla Baby Flow · Motion",ft:"Duck4x"},
  {name:"F**k the opps",type:"SINGLE",url:"https://music.apple.com/us/album/f-k-the-opps-single/1764623513",cover:"images/covers/f-k-the-opps.jpg",tracks:"Single",ft:"Duck4x"},
  {name:"F**k em",type:"SINGLE",url:"https://music.apple.com/us/album/f-k-em-feat-maal4km-single/1819255100",cover:"images/covers/f-k-em-feat-maal4km.jpg",tracks:"Single",ft:"feat. Maal4km"},
  {name:"Bougie Hoes Remix",type:"SINGLE",url:"https://music.apple.com/us/album/bougie-hoes-remix-feat-naeedy-skimode-ap-single/1825713190",cover:"images/covers/bougie-hoes-remix.jpg",tracks:"Single",ft:"feat. Naeedy & Skimode ap"},
  {name:"Odor",type:"SINGLE",url:"https://music.apple.com/us/album/odor-feat-luh0ne-hotboy-loeski/1774636647",cover:"images/covers/odor-feat-luh0ne.jpg",tracks:"Single",ft:"feat. Luh0ne & Hotboy Loeski"},
  {name:"Whats going on",type:"SINGLE",url:"https://music.apple.com/us/album/whats-going-on-feat-maal4km/1783908680",cover:"images/covers/whats-going-on.jpg",tracks:"Single",ft:"feat. Maal4km"},
  {name:"Cold",type:"SINGLE",url:"https://music.apple.com/us/album/cold-feat-duck4x/1895058889",cover:"images/covers/cold-feat-duck4x.jpg",tracks:"Single",ft:"feat. Duck4x · by Big Murdda"},
  {name:"Slip N Slide",type:"SINGLE",url:"https://music.apple.com/us/album/slip-n-slide/1747165417",cover:"images/covers/track_slip-n-slide.jpg",tracks:"Single",ft:"Skimode Ap, Naeedy, Luh One, Duck4x, Maal4km"},
];

const DUCK_TRACKS = [
  {a:'Luiz Cinnamon',t:'Posturadona',g:'pop',r:['Instrumental','Gravação','Mixagem','Masterização']},
  {a:'Leones',t:'Tititi',g:'pop',r:['Produção','Mixagem']},
  {a:'Leones',t:'De Fininho',g:'pop',r:['Produção']},
  {a:'Belentani',t:'I Wrote a Song',g:'pop',r:['Instrumental','Mixagem','Masterização']},
  {a:'Leones ft. Chrislops',t:'Cheguei Tão Longe',g:'pop',r:['Produção','Mixagem']},
  {a:'Belentani',t:'Lento',g:'pop',r:['Produção','Masterização']},
  {a:'Dayo',t:'Ouro Rosê',g:'trap',r:['Beat','Produção']},
  {a:'Dlok',t:'Money Way',g:'trap',r:['Beat']},
  {a:'Kvyn MC',t:'Yakuza',g:'trap',r:['Beat','Mixagem']},
  {a:'NK ft. Duck',t:'Telefone',g:'trap',r:['Produção','Feature']},
  {a:'Waave ft. Duck',t:'Mohamed',g:'trap',r:['Beat','Feature']},
  {a:'Duck',t:'EP Veneno',g:'trap',r:['Direção Musical']},
  {a:'Big Murdda ft. Duck4x',t:'Cold',g:'trap',r:['Feature']},
  {a:'Skimode Ap ft. Naeedy, Duck4x',t:'Slip N Slide',g:'trap',r:['Feature']},
  {a:'Duck4x ft. Luh0ne, Hotboy Loeski',t:'Odor',g:'trap',r:['Produção','Feature']},
  {a:'Duck4x ft. Maal4km',t:'Whats going on',g:'pop',r:['Produção','Feature']},
  {a:'Duck4x',t:'Bougie Hoes Remix',g:'pop',r:['Produção']},
  {a:'Duck4x ft. Maal4km',t:'F**k em',g:'trap',r:['Produção','Feature']},
  {a:'Duck4x',t:'F**k the opps',g:'trap',r:['Produção']},
];

const DUCK_IMAGES = {
  hero:"images/capa-1920x1080.jpg",
  heroAlt:"images/capa-1440x810.jpg",
  quote:"images/capa-4-1920x1080.jpg",
  logo:"images/logo-768x768.png",
  logoSm:"images/logo-256x256.png",
  studio:["images/setup-2-1440x960.jpg","images/setup-3-1440x960.jpg","images/setup-4-1440x960.jpg","images/setup-5-1440x960.jpg","images/mix-3-1440x960.jpg","images/mix-6-1440x960.jpg"],
  studioLabels:["Home Studio","Mix Station","Production","Recording","Mixing","Mastering"],
  aboutImg:"images/setup-2-1920x1280.jpg",
};

const DUCK_I18N = {
  pt:{
    n1:'Sobre',n2:'Estúdio',n3:'Singles',n4:'Portfolio',n5:'Serviços',n6:'Contato',
    cta1:'Contratar',cta2:'Ver Projetos →',
    sp1:'Duck é produtor musical de Aracaju, Sergipe. Começou aos 12 anos sem recursos, passou pelo Conservatório de Música de Sergipe dos 14 aos 16, montou o primeiro home studio aos 17 e em 2021 se especializou formalmente em produção musical.',
    sp2:'Hoje produz para artistas do Brasil e do exterior — Pop, Trap, HipHop, MPB. Cada beat carrega tensão, ginga e identidade. Nunca pastiche.',
    t1:'Primeiros contatos com música, sem recursos',t2:'Conservatório de Música de Sergipe',t3:'Primeiro home studio',t4:'Especialização em Produção Musical',t5:'Produções para artistas do Brasil e exterior',
    gh:'Onde a mágica<br><em>acontece</em>',sh:'Lançamentos<br><em>oficiais</em>',sct:'Ouvir no Apple Music',ssp:'Ouvir no Spotify →',
    ph:'Discografia',fa:'Todos',
    sh2:'O que ofereço',
    sn1:'Instrumental / Beat',sd1:'Produção do zero com stems separados. Entendemos seu referencial e construímos juntos o som que sua música pede.',
    sn2:'Gravação',sd2:'Sessões no estúdio com ambiente acústico tratado. Voz, instrumentos e takes com direção criativa.',
    sn3:'Mixagem',sd3:'Tratamento completo: EQ, compressão, espacialização e coesão tonal para o projeto inteiro.',
    sn4:'Masterização',sd4:'Loudness e identidade sonora para streaming e distribuição. Coerência de EP ou álbum completo.',
    prh:'Como trabalhamos',
    p1t:'Briefing',p1d:'Compartilha referências, ideias e o que a música precisa comunicar.',
    p2t:'Produção',p2d:'Primeiro rascunho em até 72h. Iteramos até chegar ao resultado certo.',
    p3t:'Revisão',p3d:'Até 3 revisões incluídas. Afinamos arranjo, transições e textura juntos.',
    p4t:'Entrega',p4d:'Stems, WAV e MP3. Pronto para gravar, distribuir ou publicar.',
    ch:'Vamos<br>criar <em>juntos</em>',cs:'Produtor disponível para projetos, parcerias e beats exclusivos.'
  },
  es:{
    n1:'Sobre',n2:'Estudio',n3:'Singles',n4:'Portfolio',n5:'Servicios',n6:'Contacto',
    cta1:'Contratar',cta2:'Ver Proyectos →',
    sp1:'Duck es productor musical de Aracaju, Sergipe. Empezó a los 12 años sin recursos, pasó por el Conservatorio de Música de Sergipe de los 14 a los 16, montó su primer home studio a los 17 y en 2021 se especializó en producción musical.',
    sp2:'Hoy produce para artistas de Brasil y el exterior — Pop, Trap, HipHop, MPB. Cada beat carga tensión, ginga e identidad. Nunca pastiche.',
    t1:'Primeros contactos con la música',t2:'Conservatorio de Música de Sergipe',t3:'Primer home studio',t4:'Especialización en Producción Musical',t5:'Producciones para artistas de Brasil y el exterior',
    gh:'Donde la magia<br><em>sucede</em>',sh:'Lanzamientos<br><em>oficiales</em>',sct:'Escuchar en Apple Music',ssp:'Escuchar en Spotify →',
    ph:'Discografía',fa:'Todos',
    sh2:'Qué ofrezco',
    sn1:'Instrumental / Beat',sd1:'Producción desde cero con stems separados. Entendemos tu referencial y construimos el sonido que tu música necesita.',
    sn2:'Grabación',sd2:'Sesiones en estudio con ambiente acústico tratado. Voz, instrumentos y tomas con dirección creativa.',
    sn3:'Mezcla',sd3:'Tratamiento completo: EQ, compresión, espacialización y cohesión tonal del proyecto.',
    sn4:'Masterización',sd4:'Loudness e identidad sonora para streaming y distribución. Coherencia de EP o álbum completo.',
    prh:'Cómo trabajamos',
    p1t:'Briefing',p1d:'Compartes referencias, ideas y lo que la música necesita comunicar.',
    p2t:'Producción',p2d:'Primer borrador en hasta 72h. Iteramos hasta el resultado correcto.',
    p3t:'Revisión',p3d:'Hasta 3 revisiones incluidas. Afinamos arreglo, transiciones y textura.',
    p4t:'Entrega',p4d:'Stems, WAV y MP3. Listo para grabar, distribuir o publicar.',
    ch:'Creemos<br><em>juntos</em>',cs:'Productor disponible para proyectos, colaboraciones y beats exclusivos.'
  },
  en:{
    n1:'About',n2:'Studio',n3:'Singles',n4:'Portfolio',n5:'Services',n6:'Contact',
    cta1:'Hire',cta2:'See Projects →',
    sp1:'Duck is a music producer from Aracaju, Sergipe. Started at age 12 with no resources, attended the Sergipe Music Conservatory from 14 to 16, built his first home studio at 17, and in 2021 specialized in music production.',
    sp2:'Now producing for artists across Brazil and abroad — Pop, Trap, HipHop, MPB. Every beat carries tension, groove and identity. Never pastiche.',
    t1:'First contact with music, with no resources',t2:'Sergipe Music Conservatory',t3:'First home studio',t4:'Music Production specialization',t5:'Productions for artists in Brazil and abroad',
    gh:'Where the magic<br><em>happens</em>',sh:'Official<br><em>releases</em>',sct:'Listen on Apple Music',ssp:'Listen on Spotify →',
    ph:'Discography',fa:'All',
    sh2:'What I offer',
    sn1:'Instrumental / Beat',sd1:'Production from scratch with separated stems. We understand your references and build the sound your music needs.',
    sn2:'Recording',sd2:'Studio recording sessions with treated acoustic environment. Vocals, instruments, takes with creative direction.',
    sn3:'Mixing',sd3:'Full track treatment: EQ, compression, spatialization and tonal cohesion for the whole project.',
    sn4:'Mastering',sd4:'Loudness and sonic identity for streaming and distribution. Consistency across EP or full album.',
    prh:'How we work',
    p1t:'Briefing',p1d:'You share references, ideas and what the music needs to communicate.',
    p2t:'Production',p2d:'First draft within 72h. We iterate until we reach the right result.',
    p3t:'Revision',p3d:'Up to 3 revisions included. We fine-tune arrangement, transitions and texture.',
    p4t:'Delivery',p4d:'Stems, WAV and MP3. Ready to record, distribute or publish.',
    ch:"Let's create<br><em>together</em>",cs:'Producer available for projects, collaborations and exclusive beats.'
  }
};

// Helper: render singles grid
function renderSingles(containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = DUCK_SINGLES.map(s => `
    <a href="${s.url}" target="_blank" class="s-card rv">
      <div class="s-cover"><img src="${s.cover}" loading="lazy" alt="${s.name}"></div>
      <div class="s-info">
        <span class="s-type">${s.type}</span>
        <div class="s-name">${s.name}</div>
        <div class="s-ft">${s.ft}</div>
      </div>
    </a>`).join('');
}

// Helper: render tracks grid
function renderTracks(containerId, filter) {
  const g = document.getElementById(containerId);
  if (!g) return;
  const f = filter || 'all';
  const list = f === 'all' ? DUCK_TRACKS : DUCK_TRACKS.filter(x => x.g === f);
  g.innerHTML = list.map(x => `
    <div class="tc">
      <span class="tc-g">${x.g.toUpperCase()}</span>
      <div class="tc-a">${x.a}</div>
      <div class="tc-t">${x.t}</div>
      <div class="tc-r">${x.r.map(r => `<span class="tc-rt">${r}</span>`).join('')}</div>
    </div>`).join('');
}

// Helper: render gallery
function renderGallery(containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = DUCK_IMAGES.studio.map((img, i) => `
    <div class="gal-i rv">
      <img src="${img}" loading="lazy" alt="${DUCK_IMAGES.studioLabels[i]}">
      <div class="gal-cap">${DUCK_IMAGES.studioLabels[i]}</div>
    </div>`).join('');
}

// Helper: set language
function setDuckLang(lang) {
  document.querySelectorAll('.langs button').forEach(b => b.classList.remove('on'));
  const btn = document.querySelector(`.langs button[data-lang="${lang}"]`);
  if (btn) btn.classList.add('on');
  const d = DUCK_I18N[lang];
  if (!d) return;
  document.querySelectorAll('[data-k]').forEach(el => {
    const v = d[el.dataset.k];
    if (v !== undefined) el.innerHTML = v;
  });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
}

// Helper: animate counters
function animateCounters() {
  document.querySelectorAll('.stat-n').forEach(el => {
    const t = parseInt(el.dataset.c);
    if (isNaN(t)) return;
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          gsap.to({ v: 0 }, {
            v: t, duration: 2, ease: 'power2.out',
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].v).toLocaleString() + (t >= 1000 ? '+' : 'M+');
            }
          });
        }
      });
    } else {
      el.textContent = t.toLocaleString() + (t >= 1000 ? '+' : 'M+');
    }
  });
}

// Helper: reveal on scroll
function initReveals() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.rv').forEach(el => obs.observe(el));
}

// Helper: init filters
function initFilters(btnSelector, containerId) {
  document.querySelectorAll(btnSelector).forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll(btnSelector).forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      renderTracks(containerId, b.dataset.f);
    });
  });
}

// Helper: nav active state
function initNavActive() {
  const secs = [...document.querySelectorAll('section[id]')];
  window.addEventListener('scroll', () => {
    secs.forEach(s => {
      const top = s.offsetTop - 200;
      const lk = document.querySelector(`.nav-links a[href="#${s.id}"]`);
      if (lk) lk.style.color = scrollY >= top && scrollY < top + s.offsetHeight ? 'var(--a)' : '';
    });
  }, { passive: true });
}

// Helper: sticky nav
function initStickyNav() {
  window.addEventListener('scroll', () => {
    document.getElementById('nav').classList.toggle('stuck', scrollY > 80);
  }, { passive: true });
}

// Helper: ticker
function initTicker() {
  const items = ['Produção Musical','Aracaju · Sergipe','POP · TRAP · MPB · HipHop','Beatmaker','Mixagem & Masterização','36M+ Streams','40+ Lançamentos','duck-beats@hotmail.com','@duck4s'];
  const tk = document.getElementById('tk');
  if (!tk) return;
  [...items, ...items].forEach(t => {
    const s = document.createElement('span');
    s.className = 'ti';
    s.textContent = t;
    tk.appendChild(s);
  });
}

// Helper: waveform
function initWaveform() {
  const wf = document.getElementById('wf');
  if (!wf) return;
  [6,11,22,32,40,28,36,20,34,16,38,24,30,14,26,32,18,28,22,36].forEach((h, i) => {
    const b = document.createElement('div');
    b.className = 'wb';
    b.style.setProperty('--h', h + 'px');
    b.style.setProperty('--d', (0.6 + Math.random() * 0.8) + 's');
    b.style.animationDelay = (i * 0.04) + 's';
    wf.appendChild(b);
  });
}

// Helper: custom cursor
function initCursor() {
  const cur = document.getElementById('cur');
  if (!cur) return;
  document.addEventListener('mousemove', e => {
    if (typeof gsap !== 'undefined') gsap.to(cur, { x: e.clientX - 10, y: e.clientY - 10, duration: 0.1 });
  });
  document.querySelectorAll('a,button,.gal-i,.s-card,.tc').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('on'));
    el.addEventListener('mouseleave', () => cur.classList.remove('on'));
  });
}

console.log('DUCK data.js loaded — ' + DUCK_SINGLES.length + ' singles, ' + DUCK_TRACKS.length + ' tracks, ' + DUCK_I18N.pt.n1 + ' / ' + DUCK_I18N.es.n1 + ' / ' + DUCK_I18N.en.n1);
