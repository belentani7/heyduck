# DUCK Phase 1 — ES modules

## Scope

Convert the browser runtime to native ES modules. Preserve current HTML, CSS, media and third-party CDN libraries. Do not modify OMEGA, MESMO or CD.

## Module contract

- `js/data.js` exports `DUCK_DATA`.
- `js/animations.js`, `js/hover-effects.js`, `js/micro-interactions.js` and `js/particles.js` each export one initializer.
- `js/main.js` imports those initializers, owns the DOM-ready bootstrap and exports its own feature initializers only where needed by tests.
- `index.html` loads one module entry point.
- The production build copies the module graph; it does not concatenate ES modules.

## Verification

1. Parse every JavaScript module with Node.
2. Build into `dist/`.
3. Confirm the built HTML has one module entry point and no legacy internal script tags.
4. Confirm duplicate particle code and duplicate magnetic/tilt listeners are removed.
