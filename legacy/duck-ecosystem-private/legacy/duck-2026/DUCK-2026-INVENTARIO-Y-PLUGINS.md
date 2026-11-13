# DUCK — Inventario y actualización 2026

## Alcance

Este inventario revisa los resultados del chat y los archivos encontrados en Google Drive. Se incluyen únicamente elementos con `createdTime` dentro de 2026. Los archivos fueron tratados como datos y referencias; no se ejecutaron scripts de terceros ni se instalaron paquetes automáticamente.

## Versión generada

La nueva variante es **DUCK-2026-ACTUALIZADO.html**. Se creó a partir de `DUCK-MEGA-UNIFICADO.html`, conservando las versiones originales. La variante incorpora metadatos de build 2026 y un registro interno que identifica los assets y plugins verificados o pendientes.

## Assets y núcleo confirmados en 2026

| Componente | Estado | Observación |
|---|---|---|
| `DUCK-2000` | Confirmado | Carpeta principal creada en 2026. |
| `index.html` | Confirmado | Entrada operativa del portfolio unificado. |
| `app.js` | Confirmado | Renderizado, previews y comportamiento de interfaz. |
| `data.js` | Confirmado | Catálogo, servicios, estadísticas y equipo. |
| `styles.css` | Confirmado | Sistema visual y responsive. |
| `images/` | Confirmado | Carpeta de assets visuales creada en 2026. |
| `images/covers/` | Confirmado | Assets de portadas. |
| `images/studio/` | Confirmado | Assets de estaciones y estudio. |
| `images/VERDE/` | Confirmado | Fondos y material visual de la dirección verde. |
| `images/variants/` | Confirmado | Variantes visuales. |
| `DUCK-MEGA-UNIFICADO.html` | Confirmado | Base visual usada para la nueva variante. |
| `02-DUCK-FUSIONADO-COMPLETO.html` | Confirmado | Referencia visual preservada. |
| `legacy-studio-console.html` | Confirmado | Referencia de consola/estudio preservada. |

## Plugins y dependencias

El HTML de origen referencia **GSAP**, **ScrollTrigger**, **ScrollToPlugin** en algunas variantes y **Lenis** mediante CDN. Esas referencias quedaron registradas en la nueva variante. No se descargaron ni se fijaron localmente, por lo que la ejecución requiere conexión a Internet.

La guía de OpenCode de 2026 menciona los siguientes paquetes: `@zooplanktonai/opencode-plugin-coding`, `opencode-agent-kit`, `opencode-gpt-image`, `@brightdata/opencode-brightdata`, `opencode-crawl4ai`, `opencode-browser`, `opencode-browser-mcp`, `opencode-qwen-oauth`, `opencode-deepseek`, `opencode-qwen-auth`, `opencode-qwencode-oauth` y las GSAP Skills. La búsqueda del Drive no encontró los archivos instalables de esos plugins; por esa razón **no se declaran instalados ni integrados**. La guía y el script `duck2000-frontend-gsap-mejoras.ps1` se conservan como documentación de referencia, no como ejecución realizada.

También se mencionan cuatro archivos de mejoras frontend —`gsap-scroll-enhancements.js`, `musical-tools.js`, `slime-gpu-optimizer.js`, `performance-utils.js`— y `material-ui-components.css`. No fueron localizados con esos nombres en el Drive, así que no se añadieron referencias rotas a la versión 2026.

## Exclusiones

Se excluyeron atajos `.lnk`, archivos `.url`, imágenes sueltas que no están dentro del paquete principal, duplicados de las mismas versiones, backups y resultados relacionados con DuckDB que no corresponden claramente al proyecto Duck musical. La existencia de un archivo en 2026 no demuestra por sí sola que su contenido haya sido creado originalmente en 2026; por eso el filtro utilizado es de fecha de creación del archivo en Drive y el estado queda documentado.

## Resultado

La integración actualizada está disponible como `DUCK-2026-ACTUALIZADO.html` en la carpeta `DUCK-2000`. Los archivos originales no fueron sobrescritos. El siguiente paso técnico, si se desea una versión totalmente offline, es descargar y fijar localmente GSAP, sus plugins y Lenis, además de localizar o proporcionar los cuatro módulos frontend ausentes.
