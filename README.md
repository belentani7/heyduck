# DUCK — Produção Musical, Beatmaker & Estúdio Interativo

<p><img src="https://github.com/belentani7/heyduck/actions/workflows/ci.yml/badge.svg" alt="CI" style="vertical-align:middle">
  <img src="https://github.com/belentani7/heyduck/actions/workflows/codeql.yml/badge.svg" alt="CodeQL" style="vertical-align:middle">
  <img src="https://img.shields.io/badge/dependabot-enabled-025e8c?logo=dependabot&style=flat-square" alt="Dependabot">
  <img src="https://img.shields.io/website?url=https%3A%2F%2Fbelentani7.github.io%2Fheyduck%2F&label=demo&style=flat-square&color=2bb673" alt="demo live"></p>

Portfolio interativo do produtor musical **Duck** (Lucas Belentani), baseado em Aracaju/SE. Beatmaker, mixagem e masterização com 36M+ streams e 40+ lançamentos oficiais.

🔗 **Live (Vercel):** https://heyduck.vercel.app/ — despliegue de producción. GitHub Pages no es el destino canónico.

## Features

- **Hero imersivo** com carousel de backgrounds e animação slime intro
- **Catálogo de singles** com covers e links para plataformas de streaming
- **Seção de serviços** — Beatmaking, Mixagem, Masterização
- **Estúdio interativo** com galeria de fotos e estações de trabalho
- **Sintetizador (Synth Lab)** — Web Audio API synth com oscilador, controle de frequência e volume
- **Metrónomo** — Tempo ajustável (40–240 BPM) com visualização
- **Vocal Booth** — Gravação de voz com FX chain (Radio, Robot, Reverb)
- **Player de áudio persistente** — Widget fixo com play/pause e controle de volume
- **Formulário de booking** — Envio por e-mail (mailto:)
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
| Hosting | Vercel (producción) |

## Integridade da mídia e material editorial

- O catálogo estruturado em `data.js` contém capas, fundos, artistas, serviços e estações de trabalho; a integridade das 19 referências de imagem é verificada contra os arquivos realmente presentes por `node --test tests/*.test.cjs`.
- Os fundos do hero e as fotografias de estúdio foram corrigidos para arquivos existentes, sem remover as estações e seus dados.
- Para `Slip N Slide`, que não tinha a capa incluída no repositório, usa-se `images/covers/slip-n-slide-placeholder.svg`. O arquivo está **expressamente rotulado como placeholder editorial, não capa oficial**. Substituir somente quando os direitos e a arte original forem confirmados.
- Alguns lançamentos continuam com `link: "#"` no catálogo estruturado. São **links ainda não verificados**, nunca URLs falsas de streaming; precisam de edição antes de prometer catálogo com todos os botões de escuta funcionais.
- Os números por faixa, depoimentos, equipamentos e condições comerciais em conteúdo editorial não foram individualmente comprovados neste lote. Validar licenças, autorizações e links com o artista antes de declarar uma publicação integral.
- O `index.html` histórico tem mais de 1 MB. O gate deste PR garante o catálogo de `data.js` e a existência do entrypoint, **não afirma** que toda referência interna desse HTML foi validada num navegador.

## Testes de contrato

```bash
node --check data.js
node --test tests/*.test.cjs
node .github/scripts/check-links.mjs
```

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

The live site is deployed via **Vercel** from the `main` branch. The optional GitHub Pages mirror is not the canonical URL.

- Production: https://heyduck.vercel.app/
- Push to `main` → Vercel builds and promotes the production deployment (confirm READY and correct route content).

## Project Structure

```
heyduck/
├── index.html          # Product entry page
├── producto.html       # Commercial plans and contact flow
├── ecosistema.html     # Music portfolio
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

Código do repositório sob a licença **MIT** (ver arquivo `LICENSE`, copyright Pedro Belentani, 2026). Músicas, capas, fotos, logotipos, nomes de artistas e gravações podem ter direitos autorais ou conexos independentes; a licença MIT do código **não** concede automaticamente direitos de exploração comercial desses ativos.

Produção e direção editorial de DUCK. Plataforma desenvolvida por [@belentani_](https://github.com/belentani7).
---

## Ficha del proyecto

| Campo | Valor |
|---|---|
| Autor | Belentani / NOIACORE |
| Época de desarrollo | 2026 |
| Contacto | [belentani7studio@proton.me](mailto:belentani7studio@proton.me) |
| Código | https://github.com/belentani7/heyduck |
| Demo desplegada | https://heyduck.vercel.app/ |

Quality baseline: CI + Dependabot + CodeQL + reglas de agentes por [premium-factory](https://github.com/belentani7/premium-factory-api).


## Uso

heyduck es un sitio estático y no requiere instalar dependencias. Para servirlo localmente:

```powershell
python -m http.server 8000
```

Abre `http://localhost:8000/`. La oferta comercial está en [heyduck.vercel.app/producto](https://heyduck.vercel.app/producto); los planes de pago se solicitan por correo y se confirman con factura. No hay checkout de tarjeta configurado.


## Producto
Página de producto: [`producto.html`](producto.html). Oferta, precios y contratación: [`plataforma/OFERTA.md`](plataforma/OFERTA.md), [`plataforma/precios.json`](plataforma/precios.json) y [`plataforma/COBRO.md`](plataforma/COBRO.md).
