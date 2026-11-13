# DUCK - Produção Musical

Portfolio web de Duck (Duck4x), produtor musical, beatmaker e engenheiro de som de Aracaju, Sergipe, Brasil.

## Estrutura do Projeto

```
heyduck-rebuild/
├── index.html              ← Página principal
├── server.js               ← Servidor local (Node.js)
├── README.md
├── .gitignore
├── .nojekyll
├── .github/
│   └── workflows/
│       └── deploy.yml      ← GitHub Actions
├── css/
│   └── main.css            ← Estilos completos
├── js/
│   ├── data.js             ← Datos: singles, tracks, i18n
│   ├── main.js             ← Orchestrator
│   ├── animations.js       ← GSAP animations
│   ├── audio.js            ← Audio pad player
│   └── easter-egg.js       ← Easter egg waves
├── audio/
│   └── duck.mp3            ← Audio Duck
└── images/
    ├── logo-*.png          ← Logos
    ├── capa-*.jpg          ← Cover arts
    ├── covers/             ← Album covers
    └── studio/             ← Studio photos
```

## Tecnologías

- **HTML5** - Markup semántico
- **CSS3** - Custom Properties, Grid, Flexbox
- **JavaScript ES6+** - Modular, vanilla
- **GSAP 3.12** - Animaciones y scroll effects
- **i18n** - Multiidioma (PT/ES/EN)

## Funcionalidades

- Preloader animado con GSAP
- Cursor personalizado con dot + ring
- Ticker de scroll infinito
- Hero con parallax y text split
- Stats counters animados
- Galería 3D con hover effects
- Portfolio con filtros (Pop/Trap/MPB)
- Audio pad interactivo
- Easter egg sound wave
- Smooth scroll navigation
- Responsive (desktop/tablet/mobile)

## Ejecutar Local

```bash
node server.js
# → http://localhost:4242
```

## Deploy

- **GitHub Pages**: Push a `main` → deploy automático
- **Cloudflare Pages**: Conectar repo → deploy
- **Netlify**: Importar proyecto → deploy

## URLs de Producción

- https://belentani7.github.io/heyduck/
- https://heyduck.pages.dev (Cloudflare)
- https://heyduck.netlify.app (Netlify)

## Contacto

- Instagram: [@duck4s](https://instagram.com/duck4s)
- Email: duck-beats@hotmail.com
- WhatsApp: +55 79 99602-6590

## Licencia

© 2026 DUCK Produção Musical — Todos os direitos reservados
