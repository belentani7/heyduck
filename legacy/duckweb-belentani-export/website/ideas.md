# Ideas de diseño para Duckweb

## Enfoque 1: Archivo Cinético

**Introducción breve:** Una identidad editorial de archivo cultural: brutalismo tipográfico, negro carbón, rojo lacre y composiciones de catálogo. La interfaz se siente como una publicación independiente que documenta música, tecnología y pensamiento.

**Probabilidad:** 0.07

## Enfoque 2: Estudio Solar Modular

**Introducción breve:** Una dirección luminosa y humana inspirada en estudios de diseño europeos, con marfil, azul tinta y acentos naranja. El objetivo es acercar la obra de Belentani a un público amplio mediante claridad, calidez y ritmo visual.

**Probabilidad:** 0.04

## Enfoque 3: Terminal Roja Autárquica

**Introducción breve:** Un espacio nocturno de alta intensidad que mezcla estética cyberpunk sobria, archivo musical y consola de investigación. No busca el brillo fácil: utiliza rojo señal, verde ácido muy dosificado y superficies oscuras para expresar independencia, precisión y energía creativa.

**Probabilidad:** 0.08

# Dirección elegida: Terminal Roja Autárquica

## Movimiento de diseño
Neo-brutalismo editorial mezclado con cyberpunk de archivo: interfaces de terminal, señalética industrial, portadas musicales y una estructura de revista cultural. La experiencia debe sentirse como entrar en un estudio privado donde una obra artística se convierte en sistema.

## Principios centrales
1. **Precisión sobre ornamento.** Cada línea, etiqueta y bloque de texto tiene una función; el contraste y la jerarquía sustituyen a la decoración gratuita.
2. **Tensión entre archivo y futuro.** La composición combina fichas documentales, metadatos y paneles de consola con imágenes grandes y gestos cinematográficos.
3. **Autarquía como atmósfera.** La independencia se expresa mediante una interfaz contenida, clara y autosuficiente, no mediante frases grandilocuentes.
4. **Oscuridad legible.** El fondo carbón sostiene el sistema, pero la tipografía, los bordes y los acentos mantienen contraste WCAG y una lectura cómoda.

## Filosofía cromática
El carbón profundo funciona como una sala de control y reduce el ruido visual. El rojo señal, propio de Duck Prod, aparece como una decisión y no como un gradiente decorativo: marca acciones, estados activos y momentos de energía. El blanco humo permite una lectura editorial, mientras el verde ácido se reserva para datos de sistema y microseñales. La paleta busca intensidad controlada, no espectáculo permanente.

## Paradigma de layout
La página se organiza como una secuencia editorial asimétrica: una barra lateral de índice, un hero dividido en narrativa e imagen, y módulos que se desplazan entre columnas de distinto peso. No se usa una cuadrícula centralizada uniforme; los bloques parecen hojas de un dossier vivo, conectadas por líneas de señalética y numeración.

## Elementos distintivos
- Un **índice lateral vertical** con numeración de archivo, que permanece visible en escritorio y se convierte en una barra superior compacta en móvil.
- Un **marco de escáner** en torno a la imagen hero, con coordenadas, estado de transmisión y una retícula muy sutil.
- **Tarjetas de obra** con bordes angulares, etiquetas de archivo y acentos rojos que reaccionan al hover.

## Filosofía de interacción
Las interacciones deben parecer instrumentos, no adornos. Los botones responden con compresión ligera; las tarjetas revelan metadatos; el reproductor cambia de estado de forma clara. El sitio debe ofrecer rutas directas para escuchar, conocer el manifiesto y explorar los proyectos sin forzar un embudo de conversión.

## Animación
Las entradas utilizan deslizamientos cortos y opacidad, con una cadencia escalonada de 40–70 ms entre módulos. La retícula hero puede desplazarse lentamente, pero nunca debe competir con el texto. Los estados hover usan transformaciones de 2–4 px y cambios de borde; no se animan dimensiones que provoquen saltos de layout. Todas las animaciones no esenciales respetan `prefers-reduced-motion`.

## Sistema tipográfico
- **Display:** Space Grotesk, con pesos 500–700, para titulares y numeración de alto impacto.
- **Texto:** IBM Plex Sans, para párrafos, navegación y metadata técnica.
- **Mono:** IBM Plex Mono, para etiquetas, estados del sistema, fechas y coordenadas.

Los titulares se mantienen compactos, con interlineado de 0.92–1.05. El cuerpo usa una medida cómoda y un interlineado amplio. La mezcla tipográfica debe diferenciar voz artística, contenido explicativo y datos.

## Esencia de marca
**Posicionamiento:** Duck Prod es el laboratorio independiente de Pedro Marcos Santos Belentani: música, sistemas y pensamiento para personas que prefieren construir su propia frecuencia. **Personalidad:** preciso, intenso, independiente.

## Voz de marca
Los titulares son afirmativos y concretos; las CTA son invitaciones directas, nunca promesas vacías. El microcopy suena como una etiqueta de estudio: breve, humano y atento al detalle.

Ejemplos:
- “Escucha el archivo que convirtió la presión en forma.”
- “Abrir la señal / Conocer el sistema.”

## Wordmark y logo
El símbolo será una **D geométrica abierta**, formada por dos barras rojas que dejan un corte central como una pista de audio. No se dependerá de una tipografía generada para el logotipo: el símbolo funcionará de forma independiente como favicon y marca de navegación. El wordmark Duck Prod se compondrá en Space Grotesk con una modificación de espaciado y una barra de corte roja.

## Color de marca
**Rojo Señal Duck — `#FF3B30`.** Es la firma visual propia: no invade toda la interfaz, sino que aparece cuando algo está activo, vivo o listo para ser escuchado.

## Recordatorio de implementación
Toda decisión visual debe responder a esta pregunta: **¿refuerza la idea de un archivo creativo autárquico y legible, o la diluye en una estética cyberpunk genérica?**

## Decisiones de estilo
- La interfaz será oscura, editorial y asimétrica, con rojo señal como acento principal.
- El sitio hablará de música, sistemas y visión de marca sin presentar afirmaciones clínicas o diagnósticos como hechos.
- La experiencia priorizará escucha y exploración; los elementos sin destino real se marcarán como “próximamente” mediante una microinteracción discreta.
- No se usarán los términos “soberano”, “vikingo” ni “viking”; el concepto de independencia se expresará con “autárquico”, “independiente” y “propio”.

## Guía por archivo
- `client/src/index.css`: tokens oscuros, tipografía, textura, retícula y animaciones globales.
- `client/src/pages/Home.tsx`: composición editorial asimétrica, hero, archivo musical, proyectos y manifiesto.
- `client/src/App.tsx`: entrada de la experiencia, theme oscuro y rutas.
- `client/index.html`: metadata de marca y carga tipográfica.
- `client/src/components/ui/*`: reutilizar primitives existentes para botones y controles cuando corresponda.

---

**Dirección comprometida:** Terminal Roja Autárquica. Se aplicará de forma estricta en todo el sitio.
