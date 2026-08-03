# DUCK — DECISIONES DE ARQUITECTURA

| Fecha | Decisión | Motivo |
|---|---|---|
| 2026-08-01 | Estático single-file (DUCK-MEGA-UNIFICADO.html) | Proyecto heredado, deploy Netlify simple, sin build tooling |
| 2026-08-01 | data.js como fuente única de datos | Evita duplicación; 8 covers verificados |
| 2026-08-01 | Base = 02-DUCK-FUSIONADO-COMPLETO.html | 15 secciones, 85+ ids, más completa que la de 26-07 |
| 2026-08-01 | Librerías vía CDN (GSAP, Lenis) | Sin necesidad de bundler |

## Gaps detectados vs plan
- Plan esperaba `DUCK_TRACKS` >= 32 tracks; data.js real usa `singles[]` con 8 tracks.
- Plan esperaba 43 versiones; hay 51 HTML en la carpeta.
- No hay Three.js; el 3D tuning usa canvas 2D propio.
