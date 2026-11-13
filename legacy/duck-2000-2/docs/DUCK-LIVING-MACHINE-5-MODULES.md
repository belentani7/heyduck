# DUCK Living Machine — contrato canónico de cinco módulos

Fecha: 2026-08-13

## Propósito

Portfolio premium de Duck: productor brasileño joven, tecnológico, divertido y profesional. La página se percibe como una máquina viva porque imagen, tinta, sonido, datos y movimiento responden como un organismo coordinado. La tecnología demuestra sensibilidad musical; no sustituye a Duck ni domina su obra.

## Orden obligatorio en la página

### 01 — Portal Vivo

Función: presentar a Duck en dos segundos e iniciar la transformación morado–verde.

Artefacto: escaparate sensorial con rostro, logo, titular, marca Gestalt incompleta, cubo, pato, patada, tinta y transición de estado global.

Entrega a 02: `identityLevel`, `inkProgress`, `dominantColor`, `motionMode`.

### 02 — Identidad Orgánica

Función: demostrar quién es Duck mediante voz, fotografía y una identidad que reacciona.

Artefacto: retrato vivo que conecta joven, brasileño, tecnológico, divertido, humano y profesional sin parecer biografía corporativa.

Recibe de 01: color, intensidad y modo de movimiento. Entrega a 03: `identityTraits`, `selectedMood`, `visualRhythm`.

### 03 — Motor de Producción

Función: convertir conversación e intención en decisiones musicales visibles.

Artefacto: secuenciador conceptual de cuatro etapas — entender, encontrar, construir y entregar — recorrido por una señal continua.

Recibe de 02: rasgos y mood. Entrega a 04: `processStage`, `tempoHint`, `textureHint`, `spaceHint`.

### 04 — Laboratorio Sonoro

Función: permitir que el visitante toque el criterio de Duck.

Artefacto: instrumento Web Audio accesible con patrón, capas, textura, presión, espacio, reset, volumen y resultado traducido a lenguaje de briefing.

Recibe de 03: tempo, textura y espacio. Entrega a 05: `sonicFingerprint`, `activeLayers`, `briefingPhrase`.

### 05 — Discografía Viva y Conexión

Función: probar capacidad con obra real y convertir experiencia en conversación.

Artefacto: escaparate de singles con créditos, escucha, casos y shader final que utiliza la huella sonora para preparar un briefing.

Recibe de 04: huella y frase. Entrega final: selección de obra, briefing copiable y CTA humano.

## Contrato compartido

- Un único namespace de eventos: `duck:*`.
- Eventos entre módulos mediante `CustomEvent`; ningún módulo importa internamente otro módulo.
- Estado público mínimo en `document.documentElement.dataset`; sin estado duplicado.
- Cada módulo funciona aislado, falla de forma visible y no impide leer los siguientes.
- Movimiento con GSAP/ScrollTrigger y CustomEase; Lenis solo en el núcleo.
- Animación ligada a transformación y continuidad; sin partículas decorativas genéricas.
- Audio siempre apagado al cargar, iniciado por gesto y con parada inmediata.
- Canvas y WebGL pausados fuera del viewport y limitados por DPR.
- `prefers-reduced-motion`, teclado, foco visible y alternativa textual obligatorios.
- Paleta: morado profundo, verde ácido, crema y negro tinta.
- Tipografía: Archivo Black, DM Mono y Manrope ya presentes.
- Fotografía de Duck y logo oficial dominan la identidad.
- Todo claim, crédito, enlace y métrica debe tener fuente antes de publicación.
- Ningún agente modifica `index.html`, las variantes originales ni archivos de otro módulo.

## Principios Gestalt aplicados

- Figura–fondo: Duck es siempre figura; efectos y controles son fondo funcional.
- Proximidad: cada acción se agrupa con su explicación y resultado.
- Semejanza: estados equivalentes comparten forma, color y movimiento.
- Cierre: formas incompletas permiten que el visitante complete pato, onda y marca.
- Continuidad: una señal recorre los cinco módulos y explica el orden.
- Destino común: elementos que pertenecen a una decisión se mueven juntos.
- Prägnanz: cada escena tiene un foco dominante y una acción principal.

## Estructura de entrega por subagente

Cada responsable crea únicamente dentro de `living-machine/modules/NN-nombre/`:

- `artifact.html`: fragmento semántico autocontenido.
- `module.css`: estilos encapsulados bajo `[data-duck-module="NN"]`.
- `module.js`: módulo ES con `mount(root, bus)` y `destroy()`.
- `README.md`: propósito, entradas, salidas, eventos, estados, accesibilidad, rendimiento y pruebas.

## Integración

El orquestador principal revisa los cinco artefactos, resuelve conflictos, crea el núcleo compartido, integra en `duck-living-machine.html`, verifica sintaxis/recursos/IDs, ejecuta pruebas visuales y mantiene las variantes anteriores intactas.
