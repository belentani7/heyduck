# Contribuir a heyduck

Gracias por el interés. Este repositorio es un sitio estático: HTML, CSS y
JavaScript sin framework, sin paso de build y sin dependencias en tiempo de
ejecución. Esa restricción es deliberada y cualquier contribución debe
respetarla.

## Reglas del proyecto

1. **Cero dependencias en producción.** Nada de CDN, fuentes externas, analítica
   de terceros ni `node_modules` en el sitio publicado. Si una idea necesita una
   librería, primero demuestra con medidas por qué no basta la plataforma.
2. **Cero marcadores de posición.** Nada de `TODO`, `lorem ipsum` ni botones que
   no hacen nada. Si un enlace no está verificado, se muestra su estado real
   («pendiente de verificación»), no un botón decorativo.
3. **Accesibilidad no es opcional.** Teclado, foco visible, etiquetas
   accesibles, contraste suficiente, `prefers-reduced-motion`.
4. **Nada de cifras sin fuente.** Cualquier métrica (streams, lanzamientos)
   debe venir del artista o de una fuente citada en `docs/FUENTES.md`.
5. **La historia no se reescribe.** No se hace `force-push`, ni se borran
   archivos sin justificar, ni se renombra la rama principal.

## Antes de abrir un pull request

```bash
# 1. Sintaxis y contratos de datos
node --check data.js && for f in js/*.js; do node --check "$f"; done
node --test tests/*.test.cjs

# 2. Enlaces, anclas y recursos locales
node .github/scripts/check-links.mjs

# 3. Estructura HTML y accesibilidad
node scripts/audit-html.mjs --strict

# 4. Configuración de despliegue, CSP y secretos
node scripts/audit-config.mjs

# 5. Descubrimiento (canonical, sitemap, robots)
node scripts/verify-discovery.mjs

# 6. Suite completa en Python
python3 -m unittest discover -s tests -t . -v

# 7. Estado del repositorio
python3 scripts/doctor.py
```

`make check` ejecuta los pasos de Python; la CI ejecuta todos.

## Estilo de código

- JavaScript en ES5/ES2015 compatible con el navegador, sin transpilación.
  Módulos como *script clásico* que publican un global explícito.
- CSS con propiedades personalizadas, `clamp()` y grid; sin `@import`.
- HTML semántico: un `<main>`, un `<h1>` por página, un único enlace de salto.
- Nombres y comentarios en español; identificadores de código en inglés cuando
  son términos técnicos establecidos (`gain`, `fftSize`, `adsr`).

## Cómo se revisa un cambio

Un cambio se acepta cuando: la suite está verde, el HTML pasa la auditoría,
ningún número empeora sin justificación en el propio PR y el cambio no introduce
dependencias ni promesas no verificables.
