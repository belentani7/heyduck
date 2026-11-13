# DUCK — auditoría comparativa de tres direcciones

Fecha: 2026-08-13

## Alcance y evidencia

Archivos auditados:

- `duck-ink-playground.html`, `duck-ink-playground.css`, `duck-ink-playground.js`
- `duck-human-studio.html`
- `duck-analog-console.html`
- `data.js` como fuente local de catálogo
- `images/duck-logo-desktop.png` como logo indicado por el cliente

Comprobaciones ejecutadas: existencia de recursos, referencias locales, estructura semántica básica, IDs duplicados, sintaxis JavaScript, presencia de alternativas de imagen, tecnologías de movimiento y audio, contenido visible y coherencia con las correcciones del cliente. No se ha cerrado aceptación visual de navegador, responsive real, audio real ni rendimiento: requieren una ronda visual interactiva sobre un servidor local o despliegue de prueba.

## Conclusión ejecutiva

Las tres versiones merecen conservarse porque responden a tres necesidades distintas y no deben volver a fusionarse en una plantilla única:

1. **Ink Playground — dirección principal de marca.** La más original y la más cercana al relato solicitado: morado inicial, accidente de tinta, transición verde, herramientas jugables, singles laterales y final generativo. Debe convertirse en la experiencia insignia.
2. **Human Studio — dirección de confianza y conversión.** La más clara para explicar quién es Duck, cómo trabaja y cómo iniciar un proyecto. Debe crecer como portfolio humano, no como revista ni escaparate corporativo.
3. **Studio After Dark — dirección de energía joven.** La más directa para público musical nocturno, sesiones y cultura de estudio. Debe mantener el juguete sonoro compacto sin convertirse en una consola técnica dominante.

No existe todavía una versión terminada. Las tres son prototipos estructuralmente válidos con distinta deuda de contenido, interacción, accesibilidad y validación visual.

## Comparación

| Criterio | Ink Playground | Human Studio | Studio After Dark |
|---|---:|---:|---:|
| Diferenciación conceptual | 9/10 | 8/10 | 8/10 |
| Claridad inmediata de Duck | 6/10 | 9/10 | 8/10 |
| Storytelling | 8/10 | 8/10 | 7/10 |
| Invitación a jugar | 9/10 | 3/10 | 7/10 |
| Profundidad del portfolio | 5/10 | 5/10 | 5/10 |
| Interacción funcional | 8/10 | 7/10 | 7/10 |
| Accesibilidad implementada | 7/10 | 5/10 | 5/10 |
| Riesgo de parecer plantilla | Bajo | Medio | Medio |
| Potencial como versión final | Muy alto | Alto | Alto como alternativa |

Las puntuaciones son una crítica de fuente y estructura, no una aceptación visual final.

## 1. Ink Playground

### Primera impresión

Es la única versión que propone un mundo propio completo. La estructura de diez secciones, dos canvas, GSAP, ScrollTrigger, Lenis y Web Audio permite convertir la identidad de Duck en una experiencia. El problema principal está en el primer mensaje: `O SOM ANTES DA FORMA` es una tesis creativa, pero no presenta a Duck con la claridad exigida. El hero debe decir DUCK, explicar en una frase qué hace y mostrar rostro, efecto y logo antes de pedir interpretación.

### Fortalezas

- Relato morado–tinta–verde ya representado en estructura.
- Escena del pato, cubo y golpe diferenciada de la animación de bolas rechazada.
- Secuenciador, sintetizador y mezclador funcionales mediante Web Audio.
- Seis singles y desplazamiento horizontal con ScrollTrigger.
- Skip link, `lang=pt-BR`, textos alternativos, responsive básico y modo de movimiento reducido.
- Logo correcto referenciado desde `images/duck-logo-desktop.png`.
- JavaScript externo válido y referencias locales existentes.

### Problemas críticos

- El hero no nombra DUCK como titular principal ni expone una subfrase de servicio inequívoca.
- La escena de tinta existe como mecanismo, pero todavía debe alcanzar calidad cinematográfica: peso, anticipación, contacto, salpicadura, impregnación y residuos persistentes.
- El final usa canvas 2D; el shader fantástico solicitado todavía no existe como shader WebGL.
- Los singles muestran catálogo, pero carecen de historia de producción, créditos confirmados, responsabilidad exacta, links definitivos y escucha consistente.
- `data.js` contiene cifras de streams y datos técnicos cuya veracidad no está demostrada en esta auditoría; no deben publicarse como hechos hasta documentar fuente.
- Dependencias GSAP y Lenis cargadas desde CDN: se necesita fallback, integridad o empaquetado local y prueba offline.
- Falta una ruta de conversión más humana después del juego.

### Dirección

Construirla como **portfolio-experiencia de autor**. La interacción debe demostrar sensibilidad musical, no exhibir controles. El juego es una puerta hacia la obra y la colaboración. Prioridad: hero claro, rostro, coreografía de tinta, catálogo documentado, shader final y QA visual.

## 2. Human Studio

### Primera impresión

La frase `DUCK tem rosto` corrige el problema de invisibilidad y abre con una persona, no con una tecnología. Tiene cinco secciones, nueve imágenes y un asistente local funcional. Es la versión más comprensible para alguien que llega sin conocer a Duck. Su riesgo es adquirir tono de editorial o revista si la fotografía y la tipografía dominan sin una voz personal y escenas concretas de trabajo.

### Fortalezas

- Hero centrado en identidad humana y fotografía.
- Proceso explicado en cuatro etapas legibles.
- Asistente flotante abre, cierra, acepta texto, ofrece respuestas locales y tiene rostro.
- Declara que el asistente no suplanta a Duck y que no envía datos.
- JavaScript inline válido, sin referencias locales rotas ni IDs duplicados.
- CTA de sesión y contacto social visibles.

### Problemas críticos

- Solo tres trabajos: catálogo insuficiente y poca evidencia de la aportación real de Duck.
- El chat no construye ni exporta un briefing; responde por palabras clave y puede parecer más inteligente de lo que es.
- Falta cerrar foco, retorno de foco, navegación por teclado, skip link y alternativa con JavaScript desactivado.
- No implementa `prefers-reduced-motion`.
- La biografía es breve; faltan decisiones, contexto, escucha, referencias, testimonios y escenas de proceso.
- El contacto se apoya demasiado en Instagram; falta email confirmado, disponibilidad, tipos de proyecto y expectativa de respuesta.
- Necesita una dirección visual más propia para evitar aspecto editorial genérico.

### Dirección

Construirla como **portfolio humano y documental**. Cada caso debe narrar una conversación, una decisión y un resultado, con créditos verificables. El asistente debe ser un preparador honesto de briefing, no una simulación de Duck.

## 3. Studio After Dark

### Primera impresión

La frase `DUCK FAZ O SOM TER CARA` presenta una promesa fuerte y juvenil. La fotografía a pantalla completa, la paleta negro–verde–crema y el ticker crean energía nocturna. El juguete de señal es más contenido que las consolas anteriores, pero aún necesita relacionarse mejor con una decisión musical real.

### Fortalezas

- Hero con rostro, logo y propuesta de valor.
- Paleta acotada y consistente.
- Dos escenas de estudio y un cierre fotográfico.
- Juguete sonoro Web Audio funcional con canvas, controles y pads.
- Seis secciones, nueve imágenes, JavaScript válido, recursos presentes e IDs únicos.
- Contacto directo por Instagram y correo.

### Problemas críticos

- Solo tres trabajos y ninguna página o expansión de caso.
- La afirmación `150+ faixas` y cualquier métrica asociada necesitan evidencia antes de publicación.
- El ticker continuo no respeta todavía movimiento reducido.
- Falta skip link y una navegación móvil explícita.
- El canvas reacciona visualmente, pero no comunica claramente qué aporta Duck a una producción.
- La sección de proceso puede parecer institucional si no se llena de decisiones, anécdotas y resultados propios.
- El email `duck@producao.com` debe confirmarse antes de tratarlo como contacto real.

### Dirección

Construirla como **estudio nocturno joven y directo**, con sesiones, fragmentos de proceso, artistas y obra. El laboratorio debe ser una microexperiencia de treinta segundos; la persona y los trabajos deben dominar el tiempo de lectura.

## Hallazgos transversales

### Contenido

- Falta una fuente canónica y verificable para créditos, roles, fechas, enlaces, previews, géneros, métricas y testimonios.
- Los tres prototipos reutilizan casi el mismo subconjunto de singles. Cada variante necesita presentar el catálogo con una lógica propia, pero compartir un único origen de datos validado.
- Debe diferenciarse producción, beat, mezcla, master, dirección y colaboración. `Production` genérico no basta.
- El idioma necesita decisión editorial: portugués brasileño consistente y traducción opcional solo si existe necesidad real.

### Diseño

- Logo confirmado: `images/duck-logo-desktop.png`; contiene lettering crema sobre fondo transparente/blanco visible según visor. Debe probarse sobre fondos oscuros y recortarse/optimizarse si conserva lienzo excesivo.
- Las tres variantes necesitan sistema de espaciado, tipografía, estados de interacción y reglas fotográficas documentadas.
- La fotografía debe mostrar a Duck repetidamente, pero con selección narrativa: rostro, escucha, manos, estudio, sesión y resultado.

### Interacción

- Ink ofrece la interacción más rica; Human ofrece conversación; After Dark ofrece gesto sonoro. No deben intercambiar estos núcleos.
- Todo audio debe comenzar por gesto del usuario, ofrecer estado visible, mute/parada inmediata y no reproducirse al cargar.
- Las herramientas deben terminar en una explicación o acción: qué cambió, qué aprendió el visitante y cómo llevar esa intención a Duck.

### Accesibilidad

- Ink tiene la base más completa, pero todavía requiere auditoría de foco, lectura de canvas, controles de audio y contraste real.
- Human y After Dark necesitan skip link, reducción de movimiento, foco visible consistente y pruebas completas de teclado.
- Canvas y experiencias sonoras necesitan alternativa textual equivalente.
- Los diálogos requieren gestión de foco y cierre accesible.

### Rendimiento y entrega

- Optimizar fotografías con `srcset`, tamaños declarados, formatos modernos y carga diferida fuera del hero.
- Reservar dimensiones para evitar saltos de diseño.
- Medir FPS, memoria, LCP, CLS e INP en móvil real antes de aprobar.
- Validar enlaces externos y previews desde un despliegue de prueba; la existencia del HTML local no demuestra funcionamiento público.

## Orden de desarrollo recomendado

1. Completar Ink Playground como dirección principal.
2. Completar Human Studio como alternativa de confianza y conversión.
3. Completar Studio After Dark como alternativa joven y nocturna.
4. Comparar las tres con la misma matriz de contenido, accesibilidad, rendimiento y conversión.
5. Elegir una dirección final solo después de revisión visual conjunta; conservar las otras dos como variantes, no como residuos mezclados.

## Puertas de aceptación comunes

- Fuente de cada claim y crédito registrada.
- Logo, fotografías y derechos de uso confirmados.
- Sin recursos rotos, errores de consola ni IDs duplicados.
- Interacción completa con ratón, teclado y táctil.
- Movimiento reducido y alternativa textual activos.
- Audio controlable y silencioso al inicio.
- Vista móvil, tablet y escritorio aceptada visualmente.
- Prueba en Chrome, Edge, Firefox y Safari/iOS.
- Rendimiento medido en un despliegue real.
- Aprobación explícita del cliente antes de sustituir `index.html` o publicar.
