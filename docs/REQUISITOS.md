# DUCK — REQUISITOS (Fase 1C)

## Definición de web terminada (paso 61)
1. Carga sin errores JS en consola
2. Todos los recursos locales (img/css/js) resuelven a 200
3. 0 IDs duplicados en el documento
4. Todas las secciones del portfolio visibles y funcionales
5. Instrumentos interactivos reproducen audio (Web Audio API)
6. Grabador de voz funcional (MediaRecorder)
7. i18n en 4 idiomas (PT/ES/EN/FR) con switcher funcional
8. Responsive en 4 breakpoints (mobile/tablet/desktop/ultra-wide)
9. SEO tags esenciales (title, description, og:, twitter) presentes
10. Accesibilidad WCAG AA (contrastes, alt, aria, keyboard)

## Audiencia (paso 62)
Fans de música, sellos discográficos, artistas independientes y
productores que buscan colaboración en Aracaju y mercados globales.

## Objetivo (paso 63)
Portfolio + branding + booking: mostrar el trabajo de DUCK como
productor musical y convertir visitas en colaboraciones.

## Secciones obligatorias (paso 64)
Hero, Discografía/Tracks, Studio/Equipo, Sobre/Contacto.

## Funcionalidades interactivas (paso 65)
Sintetizador Web Audio, Piano, Grabador de voz + visualizador,
Navegación con scroll suave (Lenis).

## Idiomas (paso 66)
PT-BR, ES, EN, FR.

## Navegadores objetivo (paso 68)
Chrome, Firefox, Safari, Edge (últimas 2 versiones estables).

## Breakpoints (paso 69)
Mobile 0-640, tablet 641-1024, desktop 1025-1440, ultra 1441+.

## Criterios de calidad (pasos 70-78)
- Lighthouse: >= 90 en perf/a11y/best-practices/SEO
- WCAG AA obligatorio
- Rendimiento: LCP < 2.5s, CLS < 0.1, INP < 200ms
- i18n: todas las claves en los 4 idiomas
- Audio: Web Audio sin errores
- PWA: SW registrado, offline básico
- Seguridad: sin keys expuestas
- Contenido: copy revisado sin typos

## Riesgos técnicos (paso 79)
1. Web Audio requiere gesto de usuario en mobile
2. WebGL/Canvas en low-end puede degradar FPS
3. GSAP + Lenis pueden conflictuar sin init ordenado
4. MediaRecorder no soportado en algunos browsers antiguos
5. Fuentes de CDN pueden fallar offline

## Dependencias externas (paso 80)
- GSAP 3.12.5 (cdnjs) + ScrollTrigger + ScrollToPlugin
- Lenis 1.3.25 (unpkg)
- Google Fonts: Space Grotesk, JetBrains Mono

## Decisiones de arquitectura (pasos 81-84)
- Estático single-file (DUCK-MEGA-UNIFICADO.html): sin build tooling,
  sin Vite. Razón: proyecto heredado, deploy en Netlify con click.
- Librerías vía CDN con SRI cuando sea posible.
- data.js como fuente única de datos.

## Estructura de carpetas (paso 85)
```
DUCK/
  DUCK-MEGA-UNIFICADO.html
  data.js
  images/
  docs/
  BACKUPS/
  css/  (destino de extracción si aplica)
  js/   (destino de extracción si aplica)
```

## Convenciones (pasos 86-89)
- Archivos: kebab-case
- Clases CSS: BEM (bloque__elemento--modificador)
- Funciones JS: camelCase
- Commits: conventional (feat/fix/chore)
