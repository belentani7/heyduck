// DUCK - Shared data for all versions

const DUCK_TRACKS = [
  {a:'Luiz Cinnamon',t:'Posturadona',g:'pop',r:['Instrumental','Mixagem','Masterização'],cover:'images/covers/posturadona-256x255.png',yt:'https://www.youtube.com/watch?v=cIraeWrxjVI'},
  {a:'Leones',t:'Tititi',g:'pop',r:['Produção','Mixagem'],cover:'images/covers/tititi-254x256.png',yt:'https://www.youtube.com/watch?v=a0T1AJj2VyI'},
  {a:'Leones',t:'De Fininho',g:'pop',r:['Produção'],cover:'images/covers/leones-254x256.png',yt:'https://www.youtube.com/watch?v=oQzE1EG-74g'},
  {a:'Leones',t:'Cheguei Tão Longe',g:'pop',r:['Mixagem'],cover:'images/covers/cheguei-256x255.png',yt:'https://www.youtube.com/watch?v=ShCWOG62aV0'},
  {a:'Leones',t:'Louco',g:'pop',r:['Produção'],cover:'images/covers/louco-256x256.jpg',yt:'https://www.youtube.com/watch?v=nO5HJ2IXqqk'},
  {a:'Belentani',t:'I Wrote a Song',g:'pop',r:['Instrumental','Mixagem','Masterização'],cover:'images/covers/whrote-256x255.png',yt:'https://www.youtube.com/watch?v=2iaAAzN0__Y'},
  {a:'Belentani',t:'Lento',g:'pop',r:['Produção','Masterização'],cover:'images/covers/lento-256x256.jpg',yt:'https://www.youtube.com/watch?v=5MClO2y0OLM'},
  {a:'Belentani',t:'Sleep Talking',g:'pop',r:['Beat'],cover:'images/covers/sleep-talking-256-255.jpg',yt:'https://www.youtube.com/watch?v=vmZjzGkZzag'},
  {a:'Belentani',t:'Heart Breaking',g:'pop',r:['Beat'],cover:'images/covers/heart-256-255.png',yt:'https://www.youtube.com/watch?v=4Hsy6TKp6ys'},
  {a:'Belentani',t:'Therapist',g:'pop',r:['Beat'],cover:'images/covers/therapist-256-256.jpg',yt:'https://www.youtube.com/watch?v=SEqmcrkl-QQ'},
  {a:'Dayo',t:'Ouro Rosê',g:'trap',r:['Beat','Produção'],cover:'images/covers/ouro-rose-256-256.jpg',yt:'https://www.youtube.com/watch?v=eO5MjxLAcQM'},
  {a:'Dlok',t:'Money Way',g:'trap',r:['Beat'],cover:'images/covers/money-way-256-144.jpg',yt:'https://www.youtube.com/watch?v=DraF8ww2kgU'},
  {a:'Kvyn MC',t:'Yakuza',g:'trap',r:['Beat','Mixagem'],cover:'images/covers/yakuza-2-256-144.jpg',yt:'https://www.youtube.com/watch?v=6WgxE4o0J1E'},
  {a:'NK ft. Duck',t:'Telefone',g:'trap',r:['Produção','Feature'],cover:'images/covers/telefone-256-256.jpg',yt:'https://www.youtube.com/watch?v=9BqVvldx2-s'},
  {a:'Waave ft. Duck',t:'Mohamed',g:'trap',r:['Beat','Feature'],cover:'images/covers/gun-256-234.png',yt:'https://www.youtube.com/watch?v=1kjwszuYRt8'},
  {a:'Jullya Murvack',t:'Track',g:'pop',r:['Gravação','Mixagem'],cover:'images/covers/julya-256-241.png',yt:'https://www.youtube.com/watch?v=8WbLyUPDGVE'},
  {a:'Dayo',t:'Desce Sobe',g:'trap',r:['Beat'],cover:'images/covers/capa-desce-sobe-256-256.png',yt:'https://www.youtube.com/watch?v=cIraeWrxjVI'},
  {a:'Duck4x',t:'Eu Que Mando',g:'pop',r:['Produção'],cover:'images/covers/eu-que-mando-256-247.png',yt:'https://www.youtube.com/watch?v=SwD7EGmOYQs'},
  {a:'Duck4x',t:'Gostosa',g:'pop',r:['Produção'],cover:'images/covers/gostosa-256-256.png',yt:'https://www.youtube.com/watch?v=dmruk8j3IsQ'},
  {a:'Duck4x',t:'Love Me',g:'pop',r:['Produção'],cover:'images/covers/love-me-256-245.png',yt:'https://www.youtube.com/watch?v=9hbB47ckn-c'},
  {a:'Duck4x',t:'One RPM',g:'pop',r:['Produção'],cover:'images/covers/one-rpm-256-256.jpg',yt:'https://www.youtube.com/watch?v=XzvZwxJaYd4'},
  {a:'Duck4x',t:'Capa Brilho do Luar',g:'pop',r:['Produção'],cover:'images/covers/capa-brilho-do-luar-256-256.jpg',yt:'https://www.youtube.com/watch?v=ALVzhUp5DpM'},
];

const DUCK_SINGLES = [
  {name:"For Reaper's Only",type:"EP",url:"https://music.apple.com/us/album/for-reapers-only-ep/1768570067",cover:"images/covers/for-reapers-only-ep.jpg",ft:"Duck4x"},
  {name:"Cold",type:"SINGLE",url:"https://music.apple.com/us/album/cold-feat-duck4x/1895058889",cover:"images/covers/cold-feat-duck4x.jpg",ft:"feat. Big Murdda"},
  {name:"Slip N Slide",type:"SINGLE",url:"https://music.apple.com/us/album/slip-n-slide/1747165417",cover:"images/covers/track_slip-n-slide.jpg",ft:"Duck4x, Naeedy, Luh One, Maal4km"},
];

const DUCK_IMAGES = {
  hero:"images/capa-1920x1080.jpg",
  quote:"images/capa-4-1920x1080.jpg",
  studio:["images/studio/setup-2-1440x960.jpg","images/studio/setup-3-1440x960.jpg","images/studio/setup-4-1440x960.jpg","images/studio/setup-5-1440x960.jpg","images/studio/mix-3-1440x960.jpg","images/studio/mix-6-1440x960.jpg","images/chatgpt-duck.png"],
  studioLabels:["Home Studio","Mix Station","Production","Recording","Mixing","Mastering","AI Art"],
};

const DUCK_I18N = {
  pt:{
    n1:'Sobre',n2:'Estúdio',n3:'Singles',n4:'Portfolio',n5:'Serviços',n6:'Contato',
    cta1:'Contratar',cta2:'Ver Projetos →',
    heroTag:'Produção Musical · Aracaju · Sergipe · Brasil',
    heroSub:'Beatmaker · Mixagem · Masterização',
    heroDesc:'Transformo a intenção do artista em arquitetura sonora de elite. Produção musical para artistas de nível nacional e internacional.',
    heroBadge1:'36M+ STREAMS',heroBadge2:'40+ LANÇAMENTOS',heroBadge3:'1400+ SEGUIDORES',heroBadge4:'DESDE 2012',
    sp1:'Meu nome é Lucas, mas o mercado me conhece como Duck. Existe um tipo raro de produtor que não apenas ouve a música, mas a vê. Desde os 12 anos, minha relação com o som foi além do auditivo: meu cérebro processa frequências, harmonias e emoções de forma simultânea e visual. Consigo enxergar as camadas de uma música antes mesmo de ela existir: onde os acordes se encontram, como as texturas se abraçam e qual o espaço exato que cada elemento precisa ocupar para gerar o impacto emocional correto.',
    sp2:'Essa percepção harmônica única não é mágica; é uma configuração neurocognitiva afiada, lapidada no Conservatório de Música de Sergipe e em anos de imersão total em estúdio. É o que me permite traduzir a intenção bruta de um artista em engenharia de som concreta e emocionante. Hoje, essa visão é a base do meu trabalho com artistas de peso no Brasil e no exterior. Do Trap ao Pop, da MPB ao HipHop, meu objetivo nunca é criar um beat genérico. É construir a identidade sonora que só você pode ter, com tensão, ginga e personalidade.',
    quote:'"Duck, que beat é esse?" — @check_match',
    quoteA:'Sobre Duck',
    t1:'Primeiros contatos com música, sem recursos',t2:'Conservatório de Música de Sergipe',t3:'Primeiro home studio',t4:'Especialização em Produção Musical',t5:'Produções para artistas do Brasil e exterior',
    gh:'Onde a mágica<br><em>acontece</em>',sh:'Lançamentos<br><em>oficiais</em>',sct:'Ouvir no Apple Music',ssp:'Ouvir no Spotify →',
    ph:'Discografia',fa:'Todos',
    sh2:'O que eu faço de melhor',
    sn1:'Beatmaking & Produção Musical',sd1:'Criação do zero com uma leitura harmônica profunda do seu projeto. Não entrego apenas loops; construo um universo sonoro onde cada acorde, textura e groove é pensado para servir à narrativa e à emoção da sua música. Trabalho com referências visuais e sonoras que você me traz, faço um mapeamento mental das frequências, dinâmica e textura ideal, e construo uma base onde cada elemento tem endereço certo. Stems separados, versatilidade total entre Trap, Pop, MPB e HipHop.',
    sn2:'Gravação',sd2:'Sessões no estúdio com tratamento acústico de nível profissional. Ofereço direção criativa em cada take, sabendo exatamente o momento de extrair a performance mais autêntica e visceral do artista. Controlo técnico de gain staging, posicionamento de microfones e tratamento de sinal para garantir que cada gravação chegue à mixagem com qualidade e energia máximas.',
    sn3:'Mixagem',sd3:'Onde a engenharia de som vira arte. Utilizo EQ dinâmico, compressão paralela, espacialização e automação com olhar de produtor e ouvido de engenheiro. O objetivo é separar frequências, criar profundidade e garantir que cada instrumento ocupe exatamente o espaço que "vejo" que ele merece. Trabalho com automação de panning, reverberação espacial e sidechain criativo para dar vida e movimento a cada faixa.',
    sn4:'Masterização',sd4:'O polimento final que separa um projeto amador de uma produção profissional de elite. Utilizo limitadores multibanda, stereo imaging e harmonics para entregar um arquivo pronto para o mundo. Loudness competitivo e otimizado para Spotify, Apple Music e todas as plataformas, mantendo a identidade sonora e a intenção emocional 100% intactas. Entrego em WAV 24-bit, MP3 320kbps e stems organizados.',
    prh:'Como funciona meu fluxo',
    p1t:'Diagnóstico & Briefing',p1d:'Você me traz a visão, as referências sonoras, visuais e a mensagem que a música precisa transmitir. Eu faço um mapeamento mental imediato: quais frequências dominam, qual a dinâmica ideal e qual textura vai casar perfeitamente com a sua voz. É um diagnóstico criativo antes de qualquer nota ser tocada.',
    p2t:'Arquitetura Sonora',p2d:'Em até 72h, você recebe o primeiro rascunho completo. Cada camada tem uma função: o kick que pulsa no peito, o sintetizador que cria a atmosfera, o baixo que move o corpo. Uso referências de mixagem já na criação do beat, construindo uma base sólida onde cada elemento tem seu endereço certo.',
    p3t:'Escultura & Revisão',p3d:'Aqui entra o refinamento da engenharia de som. Afinamos juntos arranjo, transições e textura. Incluo até 3 rodadas de revisão para garantir que o resultado final seja exatamente o que sua mente imaginou.',
    p4t:'Finalização & Entrega',p4d:'O processo final que garante consistência em qualquer sistema de som. Entrego arquivos prontos para o mundo: Stems, WAV 24-bit e MP3 320kbps, tudo organizado, nominal e pronto para distribuição.',
    ch:'Vamos construir<br><em>algo épico</em>',cs:'Estou disponível para produções, remixes, beats exclusivos, mix/master e parcerias estratégicas. Se você tem uma visão, eu tenho as ferramentas sonoras e a percepção para materializá-la.'
  },
  es:{
    n1:'Sobre',n2:'Estudio',n3:'Singles',n4:'Portfolio',n5:'Servicios',n6:'Contacto',
    cta1:'Contratar',cta2:'Ver Proyectos →',
    heroTag:'Producción Musical · Aracaju · Sergipe · Brasil',
    heroSub:'Beatmaker · Mezcla · Masterización',
    heroDesc:'Transformo la intención del artista en arquitectura sonora de élite. Producción musical para artistas de nivel nacional e internacional.',
    heroBadge1:'36M+ STREAMS',heroBadge2:'40+ LANZAMIENTOS',heroBadge3:'1400+ SEGUIDORES',heroBadge4:'DESDE 2012',
    sp1:'Me llamo Lucas, pero el mercado me conoce como Duck. Existe un tipo raro de productor que no solo escucha la música, sino que la ve. Desde los 12 años, mi relación con el sonido fue más allá de lo auditivo: mi cerebro procesa frecuencias, armonías y emociones de forma simultánea y visual. Soy capaz de ver las capas de una música antes de que exista: dónde se encuentran los acordes, cómo se abrazan las texturas y cuál es el espacio exacto que cada elemento necesita ocupar para generar el impacto emocional correcto.',
    sp2:'Esa percepción armónica única no es magia; es una configuración neurocognitiva afilada, tallada en el Conservatorio de Música de Sergipe y en años de inmersión total en estudio. Es lo que me permite traducir la intención bruta de un artista en ingeniería de sonido concreta y emocionante. Hoy, esa visión es la base de mi trabajo con artistas de peso en Brasil y en el exterior. Del Trap al Pop, de la MPB al HipHop, mi objetivo nunca es crear un beat genérico. Es construir la identidad sonora que solo tú puedes tener, con tensión, ritmo y personalidad.',
    quote:'"Duck, ¿qué beat es ese?" — @check_match',
    quoteA:'Sobre Duck',
    t1:'Primeros contactos con la música',t2:'Conservatorio de Música de Sergipe',t3:'Primer home studio',t4:'Especialización en Producción Musical',t5:'Producciones para artistas de Brasil y el exterior',
    gh:'Donde la magia<br><em>sucede</em>',sh:'Lanzamientos<br><em>oficiales</em>',sct:'Escuchar en Apple Music',ssp:'Escuchar en Spotify →',
    ph:'Discografía',fa:'Todos',
    sh2:'Lo que hago mejor',
    sn1:'Beatmaking & Producción Musical',sd1:'Creación desde cero con una lectura armónica profunda de tu proyecto. No entrego solo loops; construyo un universo sonoro donde cada acorde, textura y groove está pensado para servir a la narrativa y la emoción de tu música. Trabajo con referencias visuales y sonoras que me traes, hago un mapeo mental de frecuencias, dinámica y textura ideal, y construyo una base donde cada elemento tiene dirección correcta. Stems separados, versatilidad total entre Trap, Pop, MPB e HipHop.',
    sn2:'Grabación',sd2:'Sesiones en estudio con tratamiento acústico de nivel profesional. Ofrezco dirección creativa en cada take, sabiendo exactamente el momento de extraer la performance más auténtica y visceral del artista. Control técnico de gain staging, posicionamiento de micrófonos y tratamiento de señal para garantizar que cada grabación llegue a la mezcla con calidad y energía máximas.',
    sn3:'Mezcla',sd3:'Donde la ingeniería de sonido se convierte en arte. Utilizo EQ dinámico, compresión paralela, espacialización y automatización con mirada de productor y oído de ingeniero. El objetivo es separar frecuencias, crear profundidad y garantizar que cada instrumento ocupe exactamente el espacio que "veo" que merece. Trabajo con automatización de panning, reverberación espacial y sidechain creativo para dar vida y movimiento a cada pista.',
    sn4:'Masterización',sd4:'El pulido final que separa un proyecto amateur de una producción profesional de élite. Utilizo limitadores multibanda, stereo imaging y harmonics para entregar un archivo listo para el mundo. Loudness competitivo y optimizado para Spotify, Apple Music y todas las plataformas, manteniendo la identidad sonora y la intención emocional 100% intactas. Entrego en WAV 24-bit, MP3 320kbps y stems organizados.',
    prh:'Cómo funciona mi flujo',
    p1t:'Diagnóstico & Briefing',p1d:'Me traes la visión, las referencias sonoras, visuales y el mensaje que la música necesita transmitir. Hago un mapeo mental inmediato: qué frecuencias dominan, cuál es la dinámica ideal y qué textura casará perfectamente con tu voz. Es un diagnóstico creativo antes de que cualquier nota sea tocada.',
    p2t:'Arquitectura Sonora',p2d:'En hasta 72h, recibes el primer borrador completo. Cada capa tiene una función: el kick que pulsa en el pecho, el sintetizador que crea la atmósfera, el bajo que mueve el cuerpo. Uso referencias de mezcla ya en la creación del beat, construyendo una base sólida donde cada elemento tiene su dirección correcta.',
    p3t:'Escultura & Revisión',p3d:'Aquí entra el refinamiento de la ingeniería de sonido. Afinamos juntos arreglo, transiciones y textura. Incluyo hasta 3 rondas de revisión para garantizar que el resultado final sea exactamente lo que tu mente imaginó.',
    p4t:'Finalización & Entrega',p4d:'El proceso final que garantiza consistencia en cualquier sistema de sonido. Entrego archivos listos para el mundo: Stems, WAV 24-bit y MP3 320kbps, todo organizado, nominal y listo para distribución.',
    ch:'Construyamos<br><em>algo épico</em>',cs:'Estoy disponible para producciones, remixes, beats exclusivos, mix/master y alianzas estratégicas. Si tienes una visión, tengo las herramientas sonoras y la percepción para materializarla.'
  },
  en:{
    n1:'About',n2:'Studio',n3:'Singles',n4:'Portfolio',n5:'Services',n6:'Contact',
    cta1:'Hire',cta2:'See Projects →',
    heroTag:'Music Production · Aracaju · Sergipe · Brazil',
    heroSub:'Beatmaker · Mixing · Mastering',
    heroDesc:'I transform the artist\'s intention into elite sound architecture. Music production for national and international artists.',
    heroBadge1:'36M+ STREAMS',heroBadge2:'40+ RELEASES',heroBadge3:'1400+ FOLLOWERS',heroBadge4:'SINCE 2012',
    sp1:'My name is Lucas, but the market knows me as Duck. There\'s a rare type of producer who doesn\'t just hear music, but sees it. Since I was 12, my relationship with sound went beyond auditory: my brain processes frequencies, harmonies, and emotions simultaneously and visually. I can see the layers of a song before it even exists: where the chords meet, how the textures embrace, and the exact space each element needs to occupy to create the right emotional impact.',
    sp2:'This unique harmonic perception isn\'t magic; it\'s a sharpened neurocognitive configuration, honed at the Sergipe Music Conservatory and years of total studio immersion. It\'s what allows me to translate an artist\'s raw intention into concrete, exciting sound engineering. Today, this vision is the foundation of my work with heavyweight artists in Brazil and abroad. From Trap to Pop, from MPB to HipHop, my goal is never to create a generic beat. It\'s to build the sonic identity that only you can have, with tension, groove, and personality.',
    quote:'"Duck, what beat is that?" — @check_match',
    quoteA:'About Duck',
    t1:'First contact with music, with no resources',t2:'Sergipe Music Conservatory',t3:'First home studio',t4:'Music Production specialization',t5:'Productions for artists in Brazil and abroad',
    gh:'Where the magic<br><em>happens</em>',sh:'Official<br><em>releases</em>',sct:'Listen on Apple Music',ssp:'Listen on Spotify →',
    ph:'Discography',fa:'All',
    sh2:'What I do best',
    sn1:'Beatmaking & Music Production',sd1:'Creation from scratch with deep harmonic reading of your project. I don\'t just deliver loops; I build a sonic universe where every chord, texture, and groove is designed to serve the narrative and emotion of your music. I work with visual and sonic references you bring, do a mental mapping of frequencies, dynamics, and ideal texture, and build a foundation where every element has the right address. Separated stems, total versatility across Trap, Pop, MPB, and HipHop.',
    sn2:'Recording',sd2:'Studio sessions with professional-grade acoustic treatment. I offer creative direction on every take, knowing exactly when to extract the most authentic and visceral performance from the artist. Technical control of gain staging, microphone placement, and signal processing to ensure every recording reaches the mix with maximum quality and energy.',
    sn3:'Mixing',sd3:'Where sound engineering becomes art. I use dynamic EQ, parallel compression, spatialization, and automation with a producer\'s eye and an engineer\'s ear. The goal is to separate frequencies, create depth, and ensure every instrument occupies exactly the space I "see" it deserves. I work with panning automation, spatial reverb, and creative sidechain to bring life and movement to every track.',
    sn4:'Mastering',sd4:'The final polish that separates an amateur project from an elite professional production. I use multiband limiters, stereo imaging, and harmonics to deliver a file ready for the world. Competitive loudness optimized for Spotify, Apple Music, and all platforms, keeping the sonic identity and emotional intention 100% intact. Delivered in WAV 24-bit, MP3 320kbps, and organized stems.',
    prh:'How my workflow works',
    p1t:'Diagnosis & Briefing',p1d:'You bring me the vision, the sonic and visual references, and the message the music needs to convey. I do an immediate mental mapping: which frequencies dominate, what the ideal dynamics are, and what texture will perfectly match your voice. It\'s a creative diagnosis before any note is played.',
    p2t:'Sound Architecture',p2d:'Within 72 hours, you receive the first complete draft. Every layer has a function: the kick that pulses in the chest, the synthesizer that creates atmosphere, the bass that moves the body. I use mixing references from the beat creation, building a solid foundation where every element has its right address.',
    p3t:'Sculpting & Revision',p3d:'This is where sound engineering refinement enters. We fine-tune arrangement, transitions, and texture together. I include up to 3 revision rounds to ensure the final result is exactly what your mind imagined.',
    p4t:'Finalization & Delivery',p4d:'The final process that ensures consistency on any sound system. I deliver files ready for the world: Stems, WAV 24-bit, and MP3 320kbps, all organized, labeled, and ready for distribution.',
    ch:'Let\'s build<br><em>something epic</em>',cs:'I\'m available for productions, remixes, exclusive beats, mix/master, and strategic partnerships. If you have a vision, I have the sonic tools and perception to materialize it.'
  }
};

// Helper: render tracks with covers and YouTube links
function renderTracks(containerId, filter) {
  const g = document.getElementById(containerId);
  if (!g) return;
  const f = filter || 'all';
  const list = f === 'all' ? DUCK_TRACKS : DUCK_TRACKS.filter(x => x.g === f);
  g.innerHTML = list.map(x => `
    <a href="${x.yt}" target="_blank" rel="noopener noreferrer" class="tc rv">
      <div class="tc-cover"><img src="${x.cover}" loading="lazy" alt="${x.t}"><div class="tc-play">▶</div></div>
      <span class="tc-g">${x.g.toUpperCase()}</span>
      <div class="tc-a">${x.a}</div>
      <div class="tc-t">${x.t}</div>
      <div class="tc-r">${x.r.map(r => `<span class="tc-rt">${r}</span>`).join('')}</div>
    </a>`).join('');
}

// Helper: render singles
function renderSingles(containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = DUCK_SINGLES.map(x => `
    <a href="${x.url}" target="_blank" rel="noopener noreferrer" class="s-card rv">
      <div class="s-cover"><img src="${x.cover}" loading="lazy" alt="${x.name}"></div>
      <div class="s-info">
        <span class="s-type">${x.type}</span>
        <div class="s-name">${x.name}</div>
        <div class="s-ft">${x.ft}</div>
      </div>
    </a>`).join('');
}

// Helper: render gallery
function renderGallery(containerId) {
  const g = document.getElementById(containerId);
  if (!g) return;
  g.innerHTML = DUCK_IMAGES.studio.map((img, i) => `
    <div class="gal-i rv"><img src="${img}" loading="lazy" alt="${DUCK_IMAGES.studioLabels[i]}"><div class="gal-cap">${DUCK_IMAGES.studioLabels[i]}</div></div>`).join('');
}

// Helper: set language
function setDuckLang(lang) {
  document.querySelectorAll('.langs button').forEach(b => b.classList.remove('on'));
  const btn = document.querySelector(`.langs button[data-lang="${lang}"]`);
  if (btn) btn.classList.add('on');
  const d = DUCK_I18N[lang];
  if (!d) return;
  document.querySelectorAll('[data-k]').forEach(el => { const v = d[el.dataset.k]; if (v !== undefined) el.innerHTML = v; });
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : lang;
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
