# DUCK SYSTEM 2026

Repositorio privado de recuperación, comparación y consolidación del ecosistema DUCK. Esta edición reúne las funciones interactivas verificadas en las variantes recuperadas del Google Drive, conserva las fuentes originales y documenta explícitamente lo que es funcional, condicionado o no encontrado.

## Entrada recomendada

Abre [`DUCK-SYSTEM-2026.html`](./DUCK-SYSTEM-2026.html). Es la nueva capa consolidada basada en la consola funcional de DUCK, con la arquitectura 2026 registrada en `window.DUCK_SYSTEM_2026`. Mantiene el portfolio, servicios, navegación, piano Web Audio, caja de ritmos, voz sintetizada, grabador, efectos, Web MIDI, visuales y asistente local.

## Documentación de control

| Archivo | Propósito |
|---|---|
| [`DUCK-SYSTEM-2026.html`](./DUCK-SYSTEM-2026.html) | Entrada consolidada con las funciones interactivas recuperadas. |
| [`DUCK-MATRIZ-Y-ARQUITECTURA-2026.md`](./DUCK-MATRIZ-Y-ARQUITECTURA-2026.md) | Matriz de capacidades, comparación de versiones, arquitectura y límites reales. |
| [`DUCK-TECHNICAL-AUDIT.md`](./DUCK-TECHNICAL-AUDIT.md) | Inventario técnico de scripts, funciones, APIs, eventos, automatizaciones y URLs. |
| [`DUCK-BROWSER-TEST-2026.md`](./DUCK-BROWSER-TEST-2026.md) | Registro de ejecución y pruebas realizadas en navegador. |
| `index.html`, `app.js`, `data.js`, `styles.css` | Fuentes operativas separadas del portfolio y del catálogo. |
| `archive/` | Variantes originales (`DUCK-MEGA-UNIFICADO.html`, `DUCK-2026-ACTUALIZADO.html`, `02-DUCK-FUSIONADO-COMPLETO.html`, `legacy-studio-console.html`) conservadas fuera de la raíz. |

## Capacidades verificadas

La aplicación contiene funciones locales para piano y batería mediante Web Audio, controles de voz, grabación con `MediaRecorder`, efectos de audio, visualizaciones canvas, integración Web MIDI y un asistente DUCK AI basado en reglas locales. La prueba del navegador confirmó la carga de la página, la navegación al estudio, la respuesta visual del piano, la caja de ritmos y la inicialización del registro 2026 en consola.

## Límites explícitos

No se encontró backend, persistencia, autenticación ni API propia. El asistente DUCK AI no llama a un modelo remoto: responde con reglas y textos fijos. El micrófono y MIDI requieren permiso y compatibilidad del navegador. GSAP, ScrollTrigger, ScrollToPlugin, Lenis y las fuentes se cargan mediante CDN. Los módulos mencionados en guías —`gsap-scroll-enhancements.js`, `musical-tools.js`, `slime-gpu-optimizer.js`, `performance-utils.js` y `material-ui-components.css`— no fueron encontrados como archivos reales, por lo que no se declaran instalados.

## Assets

Los originales del Drive se conservaron y no se sobrescribieron. La copia de GitHub contiene el código y la documentación disponibles localmente; la carpeta binaria `images` debe copiarse desde Drive para reproducir todas las imágenes fuera de ese entorno. Antes de publicar el repositorio, revisa datos personales, enlaces de contacto y licencias de imágenes, música y fuentes.

## Desarrollo local

Desde la raíz del repositorio se puede servir el proyecto con `python3 -m http.server 8000` y abrir `http://127.0.0.1:8000/DUCK-SYSTEM-2026.html`. Para probar grabación o MIDI, concede los permisos solicitados por el navegador. La reproducción de audio necesita una acción explícita del usuario por las políticas de autoplay.
