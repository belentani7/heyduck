// DUCK — Musical Producer Portfolio Data
// Data.js - All project data for the Duck website (Primary Language: Portuguese pt-BR)

const DUCK_DATA = {
  // Basic Info
  name: "Duck",
  realName: "Lucas Belentani",
  handle: "@duck4s",
  creator: "@belentani_",
  location: "Aracaju, Sergipe, Brasil",
  coordinates: { lat: -10.9091, lng: -37.0671 },
  node: "ARACAJU-STUDIO-PRIMARY",
  status: "ONLINE / GRAVANDO",
  bio: "Lucas (Duck) é produtor musical, beatmaker e engenheiro de som com mais de 12 anos de estrada. Com visão sinestésica e foco em arquitetura sonora de alta precisão, soma mais de 36 milhões de streams e 40+ lançamentos oficiais entre Trap, Boom Bap, MPB, Pop e R&B.",
  
  // Stats
  stats: {
    streams: 36000000,
    releases: 40,
    followers: 1400,
    yearsActive: 12,
    startYear: 2012
  },
  
  // Hero Backgrounds
  heroBackgrounds: [
    "images/VERDE/capa-1920x1080.jpg",
    "images/VERDE/capa-3-1920x1080.jpg",
    "images/VERDE/capa-4-1920x1080.jpg",
    "images/VERDE/setup-2-1920x1280.jpg",
    "images/VERDE/mix-3-1920x1280.jpg"
  ],

  // Beat Store / License Packages
  beatStore: [
    {
      id: "basic",
      name: "Licença Básica MP3",
      price: "$29 / R$149",
      features: ["Arquivo MP3 320kbps", "Até 10.000 streams", "Uso não exclusivo", "Créditos: Prod. Duck"]
    },
    {
      id: "premium",
      name: "Licença Premium WAV + STEMS",
      price: "$99 / R$499",
      features: ["WAV 24-bit + Stems separados", "Até 100.000 streams", "Performances ao vivo", "Contrato assinado"]
    },
    {
      id: "exclusive",
      name: "Direitos Exclusivos (Full Ownership)",
      price: "$499 / R$2.499",
      features: ["Posse exclusiva do beat", "Streams ilimitados", "MasterStems + Arquivo de Projeto", "Retirada do catálogo"]
    }
  ],
  
  // Services
  services: [
    {
      id: 1,
      title: "Beatmaking Customizado",
      description: "Criação de beats inéditos do zero em Trap, Boom Bap, Pop, MPB, Funk e R&B. Cada produção é um arranjo sob medida projetado para a identidade do artista.",
      icon: "🎹"
    },
    {
      id: 2,
      title: "Mixagem de Elite",
      description: "Equalização cirúrgica e dinâmica, compressão paralela, automação de panning e espacialização 3D. Cada instrumento ocupa exatamente seu espaço perfeito no espectro.",
      icon: "🎚️"
    },
    {
      id: 3,
      title: "Masterização Competitiva",
      description: "Loudness otimizado e competitivo para Spotify, Apple Music, YouTube e rádios. O acabamento analógico e digital que separa produções amadoras de hits de nível mundial.",
      icon: "🔊"
    },
    {
      id: 4,
      title: "Arranjo & Direção Musical",
      description: "Transformo ideias brutas e vozes guia em produções épicas completas. Direção de vozes, instrumentação avançada e estrutura harmônica.",
      icon: "🎵"
    },
    {
      id: 5,
      title: "Sound Design & Trilha Sonora",
      description: "Composição de trilhas sonoras, vinhetas, sound design e mixagem para audiovisual, jogos, filmes e campanhas publicitárias.",
      icon: "🎬"
    },
    {
      id: 6,
      title: "Mentoria & Consultoria de Produção",
      description: "Sessões individuais de mentoria para artistas e beatmakers emergentes. Análise técnica de mixagem, identidade de som e posicionamento no mercado.",
      icon: "💡"
    }
  ],
  
  // Singles & Major Releases
  singles: [
    {
      id: 1,
      title: "Slip N Slide",
      artist: "Duck4x, Naeedy, Luh One, Maal4km",
      type: "SINGLE",
      cover: "images/covers/track_slip-n-slide.jpg",
      link: "https://music.apple.com/us/album/slip-n-slide/1747165417",
      genre: "Trap",
      streams: "1.2M",
      bpm: "140 BPM",
      key: "F# Minor"
    },
    {
      id: 2,
      title: "Cold",
      artist: "feat. Big Murdda",
      type: "SINGLE",
      cover: "images/covers/cold-feat-duck4x.jpg",
      link: "https://music.apple.com/us/album/cold-feat-duck4x/1895058889",
      genre: "Hip-Hop / Drill",
      streams: "850K",
      bpm: "142 BPM",
      key: "C Minor"
    },
    {
      id: 3,
      title: "Posturadona",
      artist: "Luiz Cinnamon",
      type: "PRODUCTION",
      cover: "images/covers/posturadona-256x255.png",
      link: "#",
      genre: "MPB / Afrobeat",
      streams: "2.4M",
      bpm: "105 BPM",
      key: "A Minor"
    },
    {
      id: 4,
      title: "Tititi",
      artist: "Leones",
      type: "PRODUCTION",
      cover: "images/covers/tititi-254x256.png",
      link: "#",
      genre: "Pop Funk",
      streams: "1.8M",
      bpm: "130 BPM",
      key: "D Minor"
    },
    {
      id: 5,
      title: "De Fininho",
      artist: "Leones",
      type: "PRODUCTION",
      cover: "images/covers/leones-254x256.png",
      link: "#",
      genre: "Pop Urban",
      streams: "950K",
      bpm: "124 BPM",
      key: "G Minor"
    },
    {
      id: 6,
      title: "I Wrote a Song",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/whrote-256x255.png",
      link: "#",
      genre: "R&B / Soul",
      streams: "3.1M",
      bpm: "88 BPM",
      key: "E Minor"
    },
    {
      id: 7,
      title: "Lento",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/lento-256x256.jpg",
      link: "#",
      genre: "R&B / Slow Trap",
      streams: "1.5M",
      bpm: "75 BPM",
      key: "B Minor"
    },
    {
      id: 8,
      title: "Mon Amour",
      artist: "Belentani",
      type: "PRODUCTION",
      cover: "images/covers/heart-256x255.png",
      link: "#",
      genre: "R&B / Pop",
      streams: "4.2M",
      bpm: "92 BPM",
      key: "F Major"
    }
  ],
  
  // Tools/Ecosystem
  tools: [
    { icon: "🎛️", title: "MESA MIDI LAUNCHPAD", description: "AKAI MPK Mini & Launchpad 16-Pads para programação de ritmos e synths em tempo real." },
    { icon: "🎚️", title: "CONSOLA DE MIXAGEM", description: "Focusrite Scarlett 18i20 com 18 entradas e 20 saídas analógicas/digitais para sessões completas." },
    { icon: "🔊", title: "MONITORES DE REFERÊNCIA", description: "Genelec 8040B & Yamaha HS8 para resposta de frequência ultra precisa e campo estéreo cirúrgico." },
    { icon: "🎹", title: "SINTETIZADOR ANALÓGICO", description: "Moog Sub 37 para graves orgânicos quentes, sub-bass 808 agressivo e texturas analógicas únicas." },
    { icon: "🥁", title: "DRUM MACHINE ELEKTRON", description: "Elektron Digitakt para sequenciamento avançado de bateria, micro-timing e manipulação de samples." },
    { icon: "🎤", title: "CABINE DE GRAVAÇÃO PROFISSIONAL", description: "Tratamento acústico completo com Neumann U87 Ai, Shure SM7B e pré-amplificadores vintage." },
    { icon: "💻", title: "ESTAÇÃO DAW MULTI-ENGINE", description: "Ableton Live 12 Suite + Logic Pro X + FL Studio 24 para criação, arranjo e mixagem acelerada." },
    { icon: "🎧", title: "MONITORAMENTO DE FONES", description: "Beyerdynamic DT 990 Pro & Sennheiser HD650 para verificação espacial e detalhes de micro-edits." },
    { icon: "📡", title: "INTERFACE APOLLO X8", description: "Universal Audio Apollo x8 com conversores AD/DA de resolução 192kHz/24-bit e DSP analógico UAD." },
    { icon: "🎸", title: "GUITARRAS & BAIXOS", description: "Fender Stratocaster & Jazz Bass para riffs, acordes e grooves gravados de forma direta e orgânica." },
    { icon: "🎻", title: "BIBLIOTECAS ORQUESTRAIS", description: "Spitfire Audio Chamber Strings & Hans Zimmer Percussion para arranjos cinematográficos épicos." },
    { icon: "🎛️", title: "SINTETIZADOR MODULAR EURORACK", description: "Módulos Eurorack customizados para síntese de ruídos, modulação caótica e sound design avançado." }
  ],
  
  // Studio Stations
  stations: [
    {
      id: 1,
      name: "HOME STUDIO PRINCIPAL",
      description: "O centro nervoso de criação. Tratamento acústico cirúrgico, acústica balanceada e monitores Genelec.",
      image: "images/studio/setup-2-1440x960.jpg",
      specs: ["Genelec 8040B", "Universal Audio Apollo Twin X", "Tratamento Acústico Pro"]
    },
    {
      id: 2,
      name: "ESTAÇÃO DE MIXAGEM",
      description: "Engenharia de áudio com cadeia híbrida (digital + outboard analógico). EQ dinâmico e saturação analógica.",
      image: "images/studio/setup-3-1440x960.jpg",
      specs: ["Yamaha HS8", "Focusrite Scarlett 18i20", "SSL Bus Compressor"]
    },
    {
      id: 3,
      name: "LABORATÓRIO DE SÍNTESE",
      description: "Sintetizadores analógicos, módulos Eurorack e drum machines. Onde timbres inusitados ganham vida.",
      image: "images/studio/setup-4-1440x960.jpg",
      specs: ["Moog Sub 37", "Elektron Digitakt", "AKAI MPK Mini"]
    },
    {
      id: 4,
      name: "CABINE DE GRAVAÇÃO DE VOZ",
      description: "Isolamento acústico total para captação transparente e calorosa de vozes e instrumentos acústicos.",
      image: "images/studio/setup-5-1440x960.jpg",
      specs: ["Neumann U87 Ai", "Shure SM7B", "Filtro Anti-reflexo"]
    },
    {
      id: 5,
      name: "BANCADA DE PROCESSAMENTO FX",
      description: "Efeitos espaciais, reverbs de convolução, delays de fita e compressores multibanda para profundidade 3D.",
      image: "images/studio/mix-3-1440x960.jpg",
      specs: ["Soundtoys 5", "FabFilter Total Bundle", "Slate Digital VTM"]
    },
    {
      id: 6,
      name: "ESTAÇÃO DE MASTERIZAÇÃO FINAL",
      description: "Finalização cirúrgica de loudness, limitação transparente e maximização estéreo para distribuição global.",
      image: "images/studio/mix-6-1440x960.jpg",
      specs: ["iZotope Ozone 11 Advanced", "Weiss DS1-MK3", "TC Electronic Clarity M"]
    }
  ],
  
  // Gear Categories
  gear: {
    microphones: [
      { name: "Neumann U87 Ai", type: "Condensador Valvulado / Voz Principal" },
      { name: "Shure SM7B", type: "Dinâmico Cardióide / Broadcast & Vocais Agressivos" }
    ],
    monitors: [
      { name: "Genelec 8040B", type: "Referência Ativa de Estúdio" },
      { name: "Yamaha HS8 + Sub HS8S", type: "Near-field / Verificação de Sub-bass" }
    ],
    instruments: [
      { name: "Moog Sub 37", type: "Sintetizador Parafônico Analógico" },
      { name: "Elektron Digitakt", type: "Sampler & Drum Machine de 8 Faixas" }
    ],
    plugins: [
      { name: "FabFilter Total Bundle", type: "EQ Cirúrgico, Compressão & Limiter" },
      { name: "Universal Audio UAD-2 Custom", type: "Emulações Analógicas Vintage (Neve, SSL, Universal Audio)" }
    ]
  },
  
  // Testimonials
  testimonials: [
    {
      quote: "O Duck não apenas produz beats, ele constrói universos sonoros vivos. Cada frequência no arranjo tem uma razão de existir.",
      author: "Luiz Cinnamon",
      track: "Posturadona"
    },
    {
      quote: "A sensibilidade do Duck em captar a intenção do artista e transformar em um hit pronto para as plataformas é incomparável.",
      author: "Leones",
      track: "Tititi / De Fininho"
    },
    {
      quote: "Engenharia de som de nível internacional. O processo de mixagem e masterização elevou meu trabalho a um patamar profissional de mercado.",
      author: "Belentani",
      track: "I Wrote a Song / Mon Amour"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = DUCK_DATA;
}
