# Prueba de navegador DUCK — 2026-08-22

## Resultado de carga

La variante `DUCK-2026-ACTUALIZADO.html` cargó correctamente desde el servidor local después de recuperar el repositorio de GitHub. El título observado fue `DUCK — Produção Musical | Studio Interactivo`.

## Funciones visibles confirmadas

La página mostró navegación para Sobre, Serviços, Portfolio, Estúdio, Instrumentos, Galeria y Contato. También mostró botones de exploración del estudio y contratación, lanzamientos con enlaces externos, teclado de piano interactivo, caja de ritmos, controles de voz, canvas de grabación y controles de efectos.

## Interacción ejecutada

El botón `EXPLORAR ESTÚDIO` desplazó la página hasta la zona de instrumentos. Se hizo clic en una tecla del piano y el visualizador respondió mostrando barras de actividad. Esto confirma que el bloque de audio Web Audio está conectado al evento de tecla en el navegador.

## Consola

La consola mostró el mensaje `DUCK 2026 build loaded`, sin errores JavaScript visibles durante la carga y la prueba inicial.

## Limitaciones observadas

La prueba no concede permisos de micrófono ni MIDI automáticamente, por lo que la grabación y el hardware MIDI requieren autorización manual del navegador. Las imágenes locales no están incluidas en la copia recuperada de GitHub; por eso algunos elementos visuales pueden aparecer vacíos fuera de Google Drive. La página también depende de GSAP y Lenis cargados desde CDN.

## Caja de ritmos

El control `ALEATÓRIO` cambió el patrón visual de la caja de ritmos y el botón `TOCAR` quedó disponible para iniciar la secuencia. La interfaz responde a los eventos, pero la reproducción de audio depende de la política de autoplay y de la activación previa del contexto de audio por el usuario.

## DUCK SYSTEM 2026 consolidado

La nueva variante `DUCK-SYSTEM-2026.html`, construida a partir de `legacy-studio-console.html`, cargó correctamente en el navegador local. La interfaz mostró portfolio, servicios, navegación, piano, caja de ritmos, voz, grabador y controles de efectos. La consola mostró `DUCK SYSTEM 2026 loaded` y no mostró errores JavaScript visibles durante la carga.
