# DUCK 2000 - cierre local

Estado: canon estático consolidado y corregido. Sin publicación.

## Canon

- `index.html`
- `styles.css`
- `data.js`
- `app.js`

Las variantes históricas permanecen intactas. La imagen recibida el 8 de agosto queda en `images/variants/` como referencia, fuera del canon.

## Corrección aplicada

El catálogo no se renderizaba: `data.js` declaraba `DUCK_DATA` con `const`, mientras `app.js` exigía `window.DUCK_DATA`. Los datos ahora se publican explícitamente en `window.DUCK_DATA`. Los scripts canónicos incluyen versión de caché para impedir que un navegador reutilice el archivo anterior.

## Verificación fresca

- `node --check data.js`: correcto.
- `node --check app.js`: correcto.
- `git diff --check`: correcto.
- servidor local `http://127.0.0.1:5541/index.html`: HTTP 200.
- referencias locales del HTML: presentes.
- cuatro previews Apple/iTunes: HTTP 200 y contenido de audio.
- estructura accesible visible: salto al contenido, regiones tituladas, control de sonido con estado, enlaces de contacto y navegación.
- lógica de interacción revisada: mouse, teclado Enter/Espacio, pointer táctil, arrastre entre tarjetas, cancelación y parada al ocultar la página.

## Límite de aceptación

La primera inspección real demostró el fallo del catálogo. Después de corregirlo, el control externo de Chrome perdió estabilidad durante la carga y no permitió completar una segunda aceptación visual, reproducción audible ni emulación táctil. Esas tres comprobaciones siguen siendo la puerta previa a cualquier publicación.

## Publicación

No se ejecutó `push`, despliegue ni cambio remoto. Los datos comerciales, cifras públicas, enlaces y derechos sobre previews deben ser confirmados por el propietario antes de publicar.
