# Versiones canónicas de DUCK

Este repositorio mantiene cada dirección completa y separada. Ninguna variante debe sobrescribirse para mezclar estilos.

## 1. `legacy-studio-console.html`

- Rol: consola técnica y experimental.
- Origen: `index.html` anterior del checkout `main` en `8a37fe8`.
- Preservación: renombrado local antes de crear el nuevo master.
- SHA-256 antes del renombrado: `0BF34BA832D1A2265B89B4B2CC5C78C8B6C2CF7A16D81A6D437B601FC496947B`.
- Cambio de preservación: solo se añadió un comentario HTML inicial que identifica el canon legacy.

## 2. `02-DUCK-FUSIONADO-COMPLETO.html`

- Rol: versión densa, editorial y fusionada.
- Estado: conservada sin edición en esta intervención.
- SHA-256 verificado antes de trabajar: `85E39983DF05207778E23110A4529A74A380C58622B7E37A338E438D0FF32BBE`.

## 3. `index.html`

- Rol: master actual, limpio y orientado a conversión.
- Arquitectura: HTML semántico + `styles.css` + `app.js`; GSAP, ScrollTrigger y Lenis por CDN con degradación funcional.
- Instrumentos: secuenciador de 16 pasos, tres voces de batería sintetizadas, sintetizador de 12 notas, filtro/delay XY, osciloscopio y grabación local con MediaRecorder.
- Accesibilidad: skip link, landmarks, navegación y secuenciador por teclado, foco visible, estados accesibles, controles de al menos 44 px y reduced motion.

## Referencia adicional

`DUCK-MEGA-UNIFICADO.html` permanece como archivo visual de consulta. No se mezcló ni sobrescribió. SHA-256 inicial: `F95A915849A901DB529F35F5C18F39E4A930116A2EE61699108A8FEE77B12D7E`.

## Política de cambio

1. Editar `index.html`, `styles.css` y `app.js` para evolucionar el master.
2. Mantener las otras variantes completas y con sus nombres estables.
3. Crear otro archivo si una dirección visual nueva requiere cambiar la identidad de una variante.
4. Verificar sintaxis, diff y navegador antes de publicar. Esta intervención no publica ni despliega.
