# Arquitectura

Sitio estático, sin framework y sin paso de build. Este documento describe cómo
se compone de verdad, no cómo nos gustaría que fuese.

## Capas

```text
Páginas           index.html · producto.html · ecosistema.html · docs.html · legales · 404
                  HTML semántico, CSS enlazado, JS con `defer`.
      │
Modelo de datos   data.js  → catálogo, servicios, estaciones, testimonios.
                  CommonJS para Node, `window.DUCK_DATA` para el navegador.
      │
Comportamiento    js/audio-core.js  matemática pura (sin DOM, sin Web Audio)
                  js/studio.js      grafo de Web Audio + metrónomo + analizador
                  js/hero-gl.js     shader WebGL del hero
                  js/site.js        render progresivo desde data.js
      │
Presentación      assets/site.css (base y componentes compartidos)
                  assets/producto.css · assets/ecosistema.css (por página)
      │
Verificación      scripts/ (gates) · tests/ (Node + Python) · .github/workflows/
```

## Decisiones y su razón

| Decisión | Motivo |
|---|---|
| Comportamiento en módulos separados, no inline | Permite una CSP estricta (`script-src 'self'`), caché inmutable y pruebas en Node. |
| `audio-core.js` sin DOM ni Web Audio | La matemática de audio es lo único con riesgo real de error y así se prueba sin navegador. |
| El `AudioContext` se crea en el primer clic | Es la política de autoplay de los navegadores; crearlo antes solo produce un contexto suspendido y un error en consola. |
| Un `<canvas>` para el hero y otro para el analizador | El de fondo usa WebGL (generativo, barato) y el del analizador Canvas 2D (texto nítido, sin shaders). |
| Un solo `site.css` para la base | Evita el efecto «cada página inventa sus tokens» que rompió el sitio anterior. |
| Render del catálogo en JS desde `data.js` | Una única fuente de verdad, con `<noscript>` que mantiene el contenido legible sin JS. |
| `.vercelignore` generado | `legacy/` (2,3 GB) y 181 activos no referenciados no deben viajar al CDN. |

## Estados y degradación

| Situación | Comportamiento |
|---|---|
| Sin JavaScript | El contenido principal sigue en el HTML; catálogo en `<noscript>`; los controles de audio no se muestran como funcionales. |
| Sin WebGL o contexto perdido | `.hero--fallback` pinta un degradado CSS equivalente; se anuncia por consola, no se lanza error. |
| Sin Web Audio API | La estación deshabilita sus botones y muestra un aviso (`#studio-notice`), sin prometer sonido. |
| `prefers-reduced-motion` | Hero con un frame estático, analizador sin bucle, animaciones a 0,001 ms. |
| Pestaña oculta | `AudioContext.suspend()` y cancelación del `requestAnimationFrame`. |
| Enlace de streaming sin verificar | Se muestra «pendiente de verificación» con `role="note"`; nunca un `<a>` muerto. |

## Presupuesto

Camino crítico de la portada, medido con `node scripts/report-budget.mjs`:

| Archivo | Crudo | gzip | brotli |
|---|---|---|---|
| `index.html` | 12,3 kB | 3,9 kB | 3,3 kB |
| `assets/site.css` | 13,9 kB | 3,5 kB | 3,0 kB |
| `js/audio-core.js` | 8,5 kB | 3,4 kB | 3,1 kB |
| `js/site.js` | 8,2 kB | 2,6 kB | 2,2 kB |
| `js/studio.js` | 18,0 kB | 5,2 kB | 4,6 kB |
| `js/hero-gl.js` | 8,5 kB | 3,1 kB | 2,7 kB |
| **Total** | **69,4 kB** | **21,6 kB** | **18,8 kB** |

Presupuesto: 60 kB gzip. Uso: 36 %.

## Archivo histórico

`legacy/` contiene 19.092 archivos y 2,3 GB de exportaciones anteriores del
proyecto (ZIPs, DLLs, PDFs, prototipos). Se conserva porque es la memoria del
trabajo, pero **no se publica**: `.vercelignore` lo excluye y
`scripts/audit-config.mjs` verifica que siga excluido.
