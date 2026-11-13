# Investigación técnica para la expansión DUCK

## GSAP

La documentación oficial de GSAP organiza el sistema alrededor de Tween y Timeline, con soporte para CSS properties, staggers, ticker con lag smoothing, context/revert y matchMedia para responsividad y accesibilidad. Para esta expansión se usará la misma idea de animación basada en transformaciones y opacidad, pero sin añadir una dependencia innecesaria: el efecto hover de singles se implementará con CSS/React y los controles de escena con requestAnimationFrame local. La referencia consultada es [GSAP Docs](https://gsap.com/docs/v3/).

## WebGL / GLSL

La guía de MDN “Hello GLSL” describe el patrón básico de un programa WebGL con vertex shader y fragment shader para dibujar una superficie. Para el sitio de Duck se usará un shader procedural opcional y ligero en un canvas de fondo, con fallback CSS si WebGL no está disponible. No se utilizará para contenido crítico ni para texto, y se respetará prefers-reduced-motion. La referencia consultada es [MDN — Hello GLSL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Hello_GLSL).

## Web Audio API

La expansión Studio empleará Web Audio API para crear un pequeño grafo local: osciladores sintéticos para pads, filtros y gain para efectos, analyser para visualizar niveles y MediaRecorder/getUserMedia para grabación cuando el navegador lo permita. Se requiere una acción explícita del usuario para iniciar audio o micrófono. No se subirá audio a ningún servidor y no se presentará como una DAW completa.

## Decisiones de producto

La experiencia de Singles mostrará créditos reales ya verificados desde el portafolio público de Duck. Las portadas se comportarán como objetos editoriales: el vinilo sale parcialmente por detrás, el conjunto responde al hover y los botones enlazan al destino público de escucha. La página Studio será un playground educativo y creativo; el generador lírico producirá solamente dos estrofas cortas y fragmentarias de inspiración, no canciones completas ni letras para publicar automáticamente.
