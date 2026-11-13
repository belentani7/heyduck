# DUCK — Matriz de recuperación y arquitectura 2026

## Matriz de capacidades

| Función | Versión | Calidad | Funciona | Reutilizable | Conservar |
|---|---|---:|---|---|---|
| Portfolio, servicios y contacto | `index.html` | Alta | Sí, carga con `app.js` y `data.js` | Sí | Sí |
| Catálogo y previews de audio | `index.html` + `app.js` | Alta | Sí con conexión y URLs válidas | Sí | Sí |
| Animaciones y scroll | Mega/Fusionado/Console | Alta | Sí si CDN disponible | Sí, consolidar una sola carga | Sí |
| Navegación multilingüe PT/ES/EN/FR | Mega/Fusionado/Console | Media-alta | Sí, reglas locales | Sí | Sí |
| Piano Web Audio | Mega/Fusionado/Console | Alta | Sí tras gesto del usuario | Sí | Sí |
| Caja de ritmos de 16 pasos | Mega/Fusionado/Console | Alta | Sí tras activar audio | Sí | Sí |
| Voz sintetizada | Mega/Fusionado/Console | Media | Parcial; depende de Web Audio y lógica local | Sí, auditar UX | Sí |
| Grabador de voz | Console | Alta | Condicionado a permiso de micrófono | Sí | Sí |
| Efectos de voz radio/robot | Console | Media-alta | Condicionado a grabación válida | Sí | Sí |
| Web MIDI | Console | Media-alta | Condicionado a navegador y hardware compatible | Sí | Sí |
| DUCK AI | Console | Baja-media | Sí como respuestas locales por palabras clave; no es API | Sí, reemplazar por adaptador real si se requiere | Sí, etiquetarlo como local |
| Canvas de tinta y visuales | Console | Media-alta | Sí visualmente | Sí | Sí |
| Galería y carruseles | Mega/Fusionado/Console | Media-alta | Depende de assets locales | Sí | Sí |
| SEO/JSON-LD | Mega/Console | Media | Presente, debe revisar datos y URLs | Sí | Sí |
| Persistencia local | Todas | Baja | No se encontró localStorage, IndexedDB ni backend | No aplica | No afirmar que existe |
| Backend/API propia | Todas | Nula | No se encontraron endpoints `fetch` ni servidor | No | No inventar |
| Plugins OpenCode | Guía `.md` | Documental | No comprobados como instalados | Solo como documentación | Sí como referencia |
| Módulos frontend de mejoras | Guía + `.ps1` | No verificable | No fueron encontrados como archivos reales | Pendiente | Documentar como ausentes |

## Comparación de versiones

`index.html` es la base más limpia y separada por datos, lógica y estilos. `DUCK-MEGA-UNIFICADO.html` aporta la mayor amplitud visual, SEO y herramientas de estudio. `02-DUCK-FUSIONADO-COMPLETO.html` comparte gran parte del sistema Mega y sirve como referencia intermedia. `legacy-studio-console.html` contiene la mayor concentración funcional: MIDI, grabación, efectos, Web Audio, caja de ritmos, sintetizador y el asistente local. La consolidación debe tomar **Console como fuente de funciones interactivas**, Mega como referencia visual y `index.html`/`data.js` como fuente de estructura y datos.

## Arquitectura final

| Capa | Responsabilidad | Implementación 2026 |
|---|---|---|
| **DUCK CORE** | Entrada, identidad, ciclo de vida, configuración y detección de capacidades | HTML consolidado + `data.js` |
| **DUCK UI** | Navegación, secciones, responsive, tema, galería y feedback visual | Console/Mega consolidado |
| **DUCK TOOLS** | Piano, caja de ritmos, voz, grabador y efectos | Funciones recuperadas de `legacy-studio-console.html` |
| **DUCK PLUGINS** | GSAP, ScrollTrigger, ScrollToPlugin y Lenis | Carga CDN única y registrada |
| **DUCK AUTOMATIONS** | Scroll animation, timers, RAF, observers y secuenciador | Scripts inline existentes, sin duplicar CDN |
| **DUCK DATA** | Catálogo, estadísticas, servicios, estaciones y equipo | `data.js` |
| **DUCK AGENTS** | Asistente DUCK AI local por reglas | `generateStudioResponse`; se etiqueta como local, no como API |

## Fallos y límites reales

No se encontró backend, persistencia, autenticación ni API propia. El asistente DUCK AI responde mediante reglas locales y contenido fijo. El grabador y MIDI requieren permisos y compatibilidad del navegador. Los assets binarios de `images` no están completos en el repositorio Git recuperado, por lo que la experiencia visual completa requiere copiarlos desde Drive. Los originales se conservan y esta consolidación se entrega como un archivo nuevo.
