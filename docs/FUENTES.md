# Fuentes

Cada afirmación técnica del repositorio procede de un lugar concreto. Lo que no
está en estas tablas no se afirma.

## Datos del repositorio

| Dato | Fuente | Fecha |
|---|---|---|
| Nombre y ruta | repositorio `belentani7/heyduck` | 2026-11-25 |
| Archivos, bytes y métricas | `node scripts/measure.mjs --json` (recorrido real del árbol) | 2026-11-25 |
| Catálogo de lanzamientos | `data.js`, contrastado con `tests/duck-data.test.cjs` | 2026-11-25 |
| Repositorios públicos del ecosistema | API de GitHub `GET /users/belentani7/repos` | 2026-11-25 |
| Ficha y precios | [`plataforma/FICHA.md`](../plataforma/FICHA.md), `plataforma/precios.json` | 2026-11-25 |
| Reglas y estado | `python3 scripts/doctor.py` + gates de la CI | ejecución de esta pasada |

## Fuentes técnicas consultadas

Usadas para implementar el motor de audio, el shader, las cabeceras y la
auditoría. La versión indicada es la que se consultó al escribir el código.

| Tema | Fuente | Versión / fecha de consulta |
|---|---|---|
| `AnalyserNode.frequencyBinCount` = `fftSize` / 2 | [MDN — AnalyserNode.frequencyBinCount](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode/frequencyBinCount) | consultado 2026-11-25 |
| `AnalyserNode` (FFT, `smoothingTimeConstant`, `getByteFrequencyData`) | [MDN — AnalyserNode](https://developer.mozilla.org/en-US/docs/Web/API/AnalyserNode) | consultado 2026-11-25 |
| Escalado de `getByteFrequencyData` a 0–255 entre `minDecibels` y `maxDecibels` | [W3C — Web Audio API 1.1, §1.8](https://www.w3.org/TR/webaudio-1.1/) | WD 1.1 |
| El `AudioContext` requiere gesto del usuario (estado `suspended`) | [Chrome — Autoplay policy changes](https://developer.chrome.com/blog/autoplay) / [PSA WebRTC](https://groups.google.com/g/discuss-webrtc/c/BwJOWloyS34) | política vigente desde Chrome 66/70 |
| `Content-Security-Policy: script-src` y `'unsafe-inline'` | [MDN — CSP: script-src](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src) | consultado 2026-11-25 |
| `.vercelignore` (excluir archivos del despliegue, sintaxis tipo `.gitignore`) | [Vercel — Exclude files with .vercelignore](https://vercel.com/docs/deployments/vercel-ignore) | doc. actualizada 2025-03-12 |
| `node:test` y `node --test` | [Node.js v22 — Test runner](https://nodejs.org/docs/latest-v22.x/api/test.html) | Node 22 (ejecutado: v22.22.3) |
| Pruebas de DOM sin navegador | [jsdom](https://github.com/jsdom/jsdom) | 25.0.1 (devDependency) |
| `prefers-reduced-motion` | [MDN — prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) | consultado 2026-11-25 |
| YAML: claves duplicadas en el mismo mapa son inválidas | [YAML 1.2.2 — §8.2.2 Mapping](https://yaml.org/spec/1.2.2/#822-block-mappings) | 1.2.2 |

## Limitaciones declaradas

- **No se pudo ejecutar Lighthouse ni Playwright.** El entorno de integración no
  trae navegador y la descarga de Chromium está bloqueada (`npx playwright
  install chromium` → *Download failure, code=1*). El presupuesto de rendimiento
  se mide con `node scripts/report-budget.mjs` (bytes crudos, gzip y brotli del
  camino crítico) y el DOM se prueba con jsdom. Ninguna cifra de Lighthouse se
  inventa.
- **Cifras de marketing del artista** (36M de streams, 40 lanzamientos)
  provienen de `data.js`, es decir, de lo que declara el propio estudio. No se
  han verificado contra las plataformas y así se etiqueta en la interfaz.
