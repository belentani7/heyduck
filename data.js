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
  hero:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80",
  heroAlt:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1440&q=80",
  quote:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80",
  logo:"images/logo-768x768.png",
  logoSm:"images/logo-256x256.png",
  studio:["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1440&q=80","https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1440&q=80","https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1440&q=80","https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1440&q=80","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1440&q=80","https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1440&q=80"],
  studioLabels:["Studio","Mixer","Microphone","Waves","Headphones","Production"],
  aboutImg:"https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1920&q=80",
  // Imágenes libres de stocks (Unsplash)
  stockStudio:"https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=1920&q=80",
  stockMic:"https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=1920&q=80",
  stockWaves:"https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1920&q=80",
  stockHeadphones:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1920&q=80",
  stockMixer:"https://images.unsplash.com/photo-1598653222000-6b7b7a552625?w=1920&q=80",
};

const DUCK_I18N = {
  pt:{
    n1:'Sobre',n2:'Estúdio',n3:'Singles',n4:'Portfolio',n5:'Serviços',n6:'Contato',
    cta1:'Contratar',cta2:'Ver Projetos →',
    sp1:'Sou Duck, produtor musical, beatmaker e engenheiro de som de Aracaju, Sergipe. Possuo uma configuração neurocognitiva naturalmente inclinada para a harmonia dos sons — minha mente processa frequências, timbres e emoções de forma simultânea, como um estúdio ambulante que analisa cada som antes de transformá-lo em música. Comecei aos 12 anos sem recursos, mas com uma obsessão: entender como o som é construído. Aos 14 entrei no Conservatório de Música de Sergipe, onde desenvolvi o ouvido absoluto que hoje define meu trabalho.',
    sp2:'Trabalho com artistas nacionais e internacionais — do Trap brasileiro ao Pop que cruza fronteiras. Minha especialidade é interpretar harmonicamente o que o artista quer comunicar e transformar isso em engenharia de som. Não produzo beats genéricos. Cada projeto passa por uma análise neurocognitiva profunda: o cérebro processa frequências, dinâmica, textura e emoção de forma integrada, criando uma percepção sonora que vai além do convencional. Quando um artista me traz uma ideia, eu vejo a música inteira — a estrutura, os timbres, o ar que ela precisa respirar. Isso não é talento, é uma configuração mental que poucos têm.',
    t1:'Primeiros contatos com música, sem recursos',t2:'Conservatório de Música de Sergipe',t3:'Primeiro home studio',t4:'Especialização em Produção Musical',t5:'Produções para artistas do Brasil e exterior',
    gh:'Onde a mágica<br><em>acontece</em>',sh:'Lançamentos<br><em>oficiais</em>',sct:'Ouvir no Apple Music',ssp:'Ouvir no Spotify →',
    ph:'Discografia',fa:'Todos',
    sh2:'O que eu faço de melhor',
    sn1:'Beat & Instrumental',sd1:'Crio do zero com uma leitura harmónica profunda do projeto. Cada acorde, cada textura, cada groove é pensado para servir a emoção da música. Stems separados, versatilidade total.',
    sn2:'Gravação',sd2:'Sessões no estúdio com tratamento acústico de nível profissional. Direção criativa em cada take — sei exatamente quando o artista deu o melhor de si.',
    sn3:'Mixagem',sd3:'Onde a engenharia de som vira arte. EQ, compressão, espacialização e automação com olhar de produtor e ouvido de engenheiro. Cada instrumento ocupa exatamente o espaço que merece.',
    sn4:'Masterização',sd4:'O acabamento que separa um beat amador de uma produção profissional. Loudness para todas as plataformas com identidade sonora intacta.',
    prh:'Como funciona o meu fluxo',
    p1t:'Briefing & Referência',p1d:'Você me conta a vibe, manda referências sonoras, vibes visuais e o que a música precisa transmitir. Eu faço um mapeamento mental: quais frequências dominam, qual a dinâmica ideal, qual textura vai casar com a sua voz. É um diagnóstico criativo antes de qualquer nota ser tocada.',
    p2t:'Produção & Arranjo',p2d:'Em até 72h você recebe o primeiro rascunho completo. Cada camada é pensada: o kick que encaixa no peito, o sintetizador que cria atmosfera, a baixa que move o corpo. Uso referências de mixing desde o beat — não é só criar, é construir uma base sonora onde cada elemento tem endereço.',
    p3t:'Mixagem & Revisão',p3d:'Aqui entra a engenharia de som. Trato cada stem com EQ dinâmico, compressão paralela, automação de panning e reverberação espacial. O objetivo: separar frequentes, criar profundidade e manter a energia. Até 3 rodadas de revisão para afinar cada detalhe.',
    p4t:'Masterização & Entrega',p4d:'O processo final que garante loudness consistente para Spotify, Apple Music e todas as plataformas. Uso limitadores multibanda, stereo imaging e harmonics para entregar um arquivo pronto para o mundo. Stems, WAV 24-bit e MP3 320kbps — tudo organizado e nominal.',
    ch:'Vamos construir<br><em>algo épico</em>',cs:'Estou disponível para produções, remixes, beats exclusivos e parcerias estratégicas. Se você tem uma visão, eu tenho as ferramentas sonoras para materializá-la.'
  },
  es:{
    n1:'Sobre',n2:'Estudio',n3:'Singles',n4:'Portfolio',n5:'Servicios',n6:'Contacto',
    cta1:'Contratar',cta2:'Ver Proyectos →',
    sp1:'Soy Duck, productor musical, beatmaker e ingeniero de sonido de Aracaju, Sergipe. Poseo una configuración neurocognitiva naturalmente inclinada para la armonía de los sonidos — mi mente procesa frecuencias, timbres y emociones de forma simultánea, como un estudio ambulante que analiza cada sonido antes de transformarlo en música. Empecé a los 12 años sin recursos, pero con una obsesión: entender cómo se construye el sonido. A los 14 entré al Conservatorio de Música de Sergipe, donde desarrollé el oído absoluto que define mi trabajo hoy.',
    sp2:'Trabajo con artistas nacionales e internacionales — del Trap brasileño al Pop que cruza fronteras. Mi especialidad es interpretar armónicamente lo que el artista quiere comunicar y transformarlo en ingeniería de sonido. No produzco beats genéricos. Cada proyecto pasa por un análisis neurocognitivo profundo: el cerebro procesa frecuencias, dinámica, textura y emoción de forma integrada, creando una percepción sonora que va más allá de lo convencional. Cuando un artista me trae una idea, veo la música entera — la estructura, los timbres, el aire que necesita respirar. Eso no es talento, es una configuración mental que pocos tienen.',
    t1:'Primeros contactos con la música',t2:'Conservatorio de Música de Sergipe',t3:'Primer home studio',t4:'Especialización en Producción Musical',t5:'Producciones para artistas de Brasil y el exterior',
    gh:'Donde la magia<br><em>sucede</em>',sh:'Lanzamientos<br><em>oficiales</em>',sct:'Escuchar en Apple Music',ssp:'Escuchar en Spotify →',
    ph:'Discografía',fa:'Todos',
    sh2:'Lo que hago mejor',
    sn1:'Beat & Instrumental',sd1:'Creo desde cero con una lectura armónica profunda del proyecto. Cada acorde, cada textura, cada groove está pensado para servir la emoción de la música.',
    sn2:'Grabación',sd2:'Sesiones en estudio con tratamiento acústico profesional. Dirección creativa en cada toma.',
    sn3:'Mezcla',sd3:'Donde la ingeniería de sonido se convierte en arte. EQ, compresión, espacialización con mirada de productor y oído de ingeniero.',
    sn4:'Masterización',sd4:'El acabamiento que separa un beat amateur de una producción profesional. Loudness para todas las plataformas.',
    prh:'Cómo funciona mi flujo',
    p1t:'Briefing & Referencia',p1d:'Me cuentas la vibe, envías referencias sonoras y lo que la música necesita transmitir. Hago un mapeo mental: frecuencias dominantes, dinámica ideal, textura que casará con tu voz. Es un diagnóstico creativo antes de cualquier nota.',
    p2t:'Producción & Arreglo',p2d:'En hasta 72h recibes el primer borrador completo. Cada capa es intencional: el kick que golpea el pecho, el sintetizador que crea atmósfera, el bajo que mueve el cuerpo.',
    p3t:'Mezcla & Revisión',p3d:'Aquí entra la ingeniería de sonido. Trato cada stem con EQ dinámico, compresión paralela, automatización de panning y reverberación espacial. Hasta 3 rondas de revisión.',
    p4t:'Masterización & Entrega',p4d:'El proceso final que garantiza loudness consistente para Spotify, Apple Music y todas las plataformas. Limitadores multibanda, stereo imaging y harmonics.',
    ch:'Construyamos<br><em>algo épico</em>',cs:'Disponible para producciones, remixes, beats exclusivos y alianzas estratégicas.'
  },
  en:{
    n1:'About',n2:'Studio',n3:'Singles',n4:'Portfolio',n5:'Services',n6:'Contact',
    cta1:'Hire',cta2:'See Projects →',
    sp1:'I\'m Duck — music producer, beatmaker, and sound engineer from Aracaju, Sergipe. I possess a neurocognitive configuration naturally inclined towards sound harmony — my mind processes frequencies, timbres, and emotions simultaneously, like a mobile studio that analyzes every sound before transforming it into music. I started at 12 with no resources, but with an obsession: understanding how sound is built. At 14 I entered the Sergipe Music Conservatory, where I developed the absolute ear that defines my work today.',
    sp2:'I work with national and international artists — from Brazilian Trap to Pop that crosses borders. My specialty is harmonically interpreting what the artist wants to communicate and transforming it into sound engineering. I don\'t produce generic beats. Every project goes through deep neurocognitive analysis: the brain processes frequencies, dynamics, texture, and emotion in an integrated way, creating a sonic perception that goes beyond conventional. When an artist brings me an idea, I see the whole song — the structure, the timbres, the air it needs to breathe. That\'s not talent, it\'s a mental configuration that few have.',
    t1:'First contact with music, with no resources',t2:'Sergipe Music Conservatory',t3:'First home studio',t4:'Music Production specialization',t5:'Productions for artists in Brazil and abroad',
    gh:'Where the magic<br><em>happens</em>',sh:'Official<br><em>releases</em>',sct:'Listen on Apple Music',ssp:'Listen on Spotify →',
    ph:'Discography',fa:'All',
    sh2:'What I do best',
    sn1:'Beat & Instrumental',sd1:'I create from scratch with deep harmonic analysis of the project. Every chord, texture, and groove is designed to serve the song\'s emotion. Separated stems, total versatility.',
    sn2:'Recording',sd2:'Professional-grade acoustic treatment sessions. Creative direction on every take — I know exactly when the artist gave their best.',
    sn3:'Mixing',sd3:'Where sound engineering becomes art. EQ, compression, spatialization with a producer\'s eye and an engineer\'s ear. Every instrument occupies exactly the space it deserves.',
    sn4:'Mastering',sd4:'The finishing touch that separates amateur beats from professional productions. Loudness for all platforms with intact sonic identity.',
    prh:'How my workflow works',
    p1t:'Briefing & Reference',p1d:'You tell me the vibe, send sonic references, visual moods, and what the song needs to convey. I do a mental mapping: which frequencies dominate, the ideal dynamics, what texture will match your voice. It\'s a creative diagnosis before any note is played.',
    p2t:'Production & Arrangement',p2d:'Within 72 hours you receive the first complete draft. Every layer is intentional: the kick that hits the chest, the synth that creates atmosphere, the bass that moves the body.',
    p3t:'Mixing & Revision',p3d:'This is where sound engineering enters. I treat each stem with dynamic EQ, parallel compression, panning automation, and spatial reverb. Up to 3 revision rounds to refine every detail.',
    p4t:'Mastering & Delivery',p4d:'The final process that ensures consistent loudness for Spotify, Apple Music, and all platforms. Multiband limiters, stereo imaging, and harmonics for a file ready for the world.',
    ch:"Let's build<br><em>something epic</em>",cs:'Available for productions, remixes, exclusive beats, and strategic partnerships. If you have a vision, I have the sonic tools to materialize it.'
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
