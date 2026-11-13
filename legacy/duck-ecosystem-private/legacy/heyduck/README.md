# DUCK — Produção Musical, Beatmaker & Estúdio Interativo

Portfolio interativo do produtor musical **Duck** (Lucas Belentani), baseado em Aracaju/SE. Beatmaker, mixagem e masterização com 36M+ streams e 40+ lançamentos oficiais.

🔗 **Live:** [belentani7.github.io/heyduck](https://belentani7.github.io/heyduck/)

## Features

- **Hero imersivo** com carousel de backgrounds e animação slime intro
- **Catálogo de singles** com covers e links para plataformas de streaming
- **Seção de serviços** — Beatmaking, Mixagem, Masterização
- **Estúdio interativo** com galeria de fotos e estações de trabalho
- **Sintetizador (Synth Lab)** — Web Audio API synth com oscilador, controle de frequência e volume
- **Metrónomo** — Tempo ajustável (40–240 BPM) com visualização
- **Gerador de Letras (AI)** — Geração de letras por gênero (Trap, Pop, MPB, R&B)
- **Vocal Booth** — Gravação de voz com FX chain (Radio, Robot, Reverb)
- **Player de áudio persistente** — Widget fixo com play/pause e controle de volume
- **Formulário de booking** — Contato profissional com Formspree
- **Smooth scroll** com Lenis
- **Animações GSAP** com ScrollTrigger
- **Easter egg** — Seção hidden com parallax de ondas sonoras
- **Multi-idioma** — PT/ES/EN/FR
- **Design responsivo** e acessível (dark theme, #9acb6b accent)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 (semântico, Schema.org JSON-LD) |
| Styling | CSS3 (custom properties, grid, flexbox) |
| Animation | GSAP 3 + ScrollTrigger + ScrollToPlugin |
| Smooth Scroll | Lenis |
| Audio | Web Audio API (synth, metronome, vocal booth) |
| Fonts | Space Grotesk + Inter (Google Fonts) |
| Hosting | GitHub Pages |

## Local Development

```bash
# Clone the repo
git clone https://github.com/belentani7/heyduck.git
cd heyduck

# Serve locally (any static server works)
npx serve .
# or
python -m http.server 8000
```

Open `http://localhost:8000` (or the port your server uses).

## Deploy

The site deploys automatically via **GitHub Pages** from the `main` branch.

- URL: `https://belentani7.github.io/heyduck/`
- Push to `main` → GitHub Pages rebuilds automatically

## Project Structure

```
heyduck/
├── index.html          # Main portfolio (3500+ lines)
├── data.js             # Structured data (tracks, services, bio)
├── sitemap.xml         # SEO sitemap
├── robots.txt          # Crawl directives
├── js/
│   ├── gsap.min.js
│   ├── ScrollTrigger.min.js
│   ├── ScrollToPlugin.min.js
│   ├── lenis.min.js
│   └── lenis.css
├── images/
│   ├── covers/         # Single/album artwork (256px)
│   ├── studio/         # Studio photography
│   ├── VERDE/          # Hero backgrounds (green theme)
│   └── logo*.png       # Brand logos (multiple sizes)
└── magic/              # Experimental features
```

## License

© 2026 DUCK Produção Musical. All rights reserved.
Built with maestria by [@belentani_](https://github.com/belentani7).
