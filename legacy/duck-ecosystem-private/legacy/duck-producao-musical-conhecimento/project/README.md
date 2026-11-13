# Duck Produção Musical

Landing editorial para Duck Produção Musical, construida como **web-static frontend-only** con React, Vite, Tailwind CSS y una dirección visual Dark Cinematic. El sitio comunica producción musical, mixagem, masterização, dirección vocal, sound design y consultoría desde Aracaju, Brasil.

> **Dirección de diseño:** interfaz de estudio cinematográfica, base negro tinta, verde lima como señal, titulares grotescos sobredimensionados, microetiquetas técnicas, linework inspirado en waveforms/DAW y fotografía real de estudio.

## Estado de entrega

El frontend está implementado y verificado en escritorio y móvil. El type-check y el build de producción pasan. El escaneo `pnpm audit` devuelve cero avisos en el árbol directo actual. La página principal usa navegación por secciones, menú móvil, selector de escenas, catálogo enlazado a plataformas, formulario de briefing con validación HTML y una página 404 con escape de retorno.

El proyecto sigue siendo estático por decisión de alcance. No se inventa autenticación, base de datos, API, recepción persistente del formulario ni dashboard. El formulario valida la entrada en el navegador y abre el contacto de Instagram; para persistencia real hay que evolucionar a `web-db-user` y elegir proveedor de datos antes de implementar backend.

## Comandos

```bash
pnpm install
pnpm dev
pnpm check
pnpm build
pnpm audit
pnpm format
```

El build genera `dist/public`. El servidor placeholder original se mantiene fuera del type-check y no forma parte de la ruta de build de esta versión static-only.

## Arquitectura

| Área | Decisión | Evidencia |
|---|---|---|
| UI | React 19 + Wouter + CSS propio | `client/src/pages/Home.tsx`, `client/src/index.css` |
| Estilos | Tailwind 4 importado en CSS + sistema visual custom | `client/src/index.css`, `vite.config.ts` |
| Motion | CSS transitions/keyframes; `prefers-reduced-motion` | `client/src/index.css` |
| Assets | URLs de almacenamiento gestionado, sin media pesada dentro del repo | `Home.tsx`, `index.html` |
| Accesibilidad | skip link, labels, alt, focus-visible, navegación por botones | `Home.tsx`, `index.css` |
| Datos | Sin persistencia; links externos de catálogo y contacto | `Home.tsx` |
| CI | Type-check, build y audit automatizados | `.github/workflows/ci.yml` |

## Assets y licencias

Los assets principales fueron preparados para el proyecto y se referencian mediante URLs de almacenamiento gestionado: hero de productor, consola de mezcla, estudio panorámico, ondas de audio y mark de Duck. Las imágenes se usan con `alt`, `loading="lazy"` en contenido no hero y no se duplican como placeholders entre secciones. Antes de una campaña publicitaria o una migración de dominio debe confirmarse la licencia comercial y sustituir cualquier asset cuya licencia no esté documentada.

Las tipografías se cargan desde Google Fonts: Space Grotesk, Inter e IBM Plex Mono. Para un lanzamiento que requiera máxima privacidad o funcionamiento offline, conviene autoalojarlas con sus licencias y declarar `font-display: swap`.

## Auditoría

La auditoría completa está en [`auditoria_10_dimensiones.md`](./auditoria_10_dimensiones.md). Las fuentes externas y decisiones de persistencia están en [`research_findings.md`](./research_findings.md). El proceso operativo y los riesgos están en [`todo.md`](./todo.md). El material bruto de Drive no se necesita para ejecutar la web y no se incluye en el repositorio final para evitar duplicar contenido interno.

## Fuentes técnicas actuales

- [Tailwind CSS con Vite](https://tailwindcss.com/docs/installation/using-vite)
- [Vite](https://vite.dev/guide/)
- [React](https://react.dev/)
- [Core Web Vitals](https://web.dev/articles/vitals)
- [PostgreSQL 18 documentation](https://www.postgresql.org/docs/current/index.html)
- [Redis 8.4 documentation](https://redis.io/docs/latest/develop/whats-new/8-4/)
- [pnpm 10 settings](https://pnpm.io/10.x/settings)

## Próxima evolución backend

Si el briefing debe persistir, la arquitectura recomendada es PostgreSQL como sistema de registro, autenticación gestionada y almacenamiento de objetos para entregas, con Redis solo para rate limiting, caché o colas si el volumen lo justifica. Esa evolución requiere confirmación de proveedor, modelo de datos, migraciones, políticas de acceso, backups y pruebas; no se simula en este repositorio estático.
