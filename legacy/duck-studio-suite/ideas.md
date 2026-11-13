# Dirección de diseño — Duck Studio Suite

## Tres aproximaciones consideradas

| Theme Name | Very Brief Intro | Probability |
|---|---|---:|
| Consola de estudio ritual | Una estación de producción que toma prestada la precisión de una mesa de mezcla física y la vuelve táctil, con tipografía técnica y controles táctiles. | 0.07 |
| Archivo de samples editorial | Una aplicación de producción musical con el ritmo, la jerarquía y la amplitud de un suplemento cultural impreso. | 0.04 |
| Laboratorio de señal nocturna | Un entorno oscuro, sobrio y de alta concentración inspirado en instrumentación de audio, con verde esmeralda como señal activa. | 0.08 |

## Enfoque elegido: Laboratorio de señal nocturna

### Design Movement

**Diseño de instrumentación de precisión**: un lenguaje visual que combina consolas de audio, pantallas de osciloscopio y señalética de laboratorio contemporáneo.

### Core Principles

1. La información de creación musical debe leerse primero como señal y luego como interfaz; los indicadores, medidores y patrones son la narrativa principal.
2. Cada área de trabajo debe tener una jerarquía funcional clara: biblioteca, creación, secuencia y control de salida.
3. La densidad técnica se equilibra con respiración espacial, contraste alto y estados interactivos inequívocos.
4. La simulación se declara con honestidad: el producto es un prototipo interactivo de flujo de producción, no un motor de audio profesional.

### Color Philosophy

La base es carbón verdoso y casi negro para reducir fatiga visual y emular el entorno de un estudio oscuro. El **Verde Duck Signal** (#62F2A5) representa sonido activo, transporte y edición confirmada. Los tonos ámbar y coral se reservan para atención, solo y grabación, de modo que el color comunica estado antes que decoración.

### Layout Paradigm

Una estructura de **cabina de control**: barra de transporte superior, biblioteca lateral de samples, área central que cambia de herramienta y franja inferior de mezcla/telemetría. La aplicación evita el lienzo centrado; todo se organiza como un plano de trabajo continuo.

### Signature Elements

1. Motivo de retícula de señal con puntos de sincronía que recorre superficies y medidores.
2. Etiquetas monoespaciadas de canal, BPM y compás, similares a una pantalla de equipo de estudio.
3. Controles de fader y pads de pasos con un bisel físico suave y respuesta luminosa contenida.

### Interaction Philosophy

Las acciones frecuentes son directas e instantáneas: pulsar pads, silenciar, solar, cambiar una vista y ajustar un fader. Las acciones de contexto —como exportar o abrir ayudas— confirman su resultado con mensajes breves. La reproducción se representa con un cursor de compás y medidores vivos, no con animaciones ornamentales.

### Animation

La movilidad se limita a transformaciones y opacidad: los pads se contraen levemente al activarse, el cursor de reproducción recorre los compases y los medidores responden con variación suave. Las transiciones duran entre 120 y 220 ms y se desactivan para `prefers-reduced-motion`.

### Typography System

**Space Grotesk** estructura los títulos, controles y nombres de instrumentos con un carácter geométrico expresivo. **IBM Plex Mono** gobierna valores, métricas, teclas y rótulos de señal. Los títulos usan peso 600–700; los controles, 500–600; los metadatos, 400 en mayúsculas discretas.

### Brand Essence

**Duck Studio Suite es una estación visual para productores que quieren convertir una idea rítmica en una sesión clara y controlable, sin perder el impulso creativo.** Personalidad: precisa, rítmica, irreverente.

### Brand Voice

La voz es breve, técnica y cómplice; describe operaciones y evita promesas grandilocuentes. Ejemplos: “Pega el golpe. Deja que el compás responda.” y “Tu sesión está viva: escucha dónde empuja.”

### Wordmark & Logo

El símbolo es una cabeza de pato geométrica construida como una forma de onda corta, cortada por una muesca de play. El logotipo usa letras compactas y espaciadas, con el carácter de un rótulo de instrumento.

### Signature Brand Color

**Verde Duck Signal — #62F2A5.**

## Alcance de la transformación

El contenido original, concentrado en un único documento HTML extenso, se convierte en una aplicación React tipada y modular. Se amplían las áreas de **biblioteca de sonidos**, **secuenciador de 16 pasos**, **piano roll**, **playlist**, **mezclador**, **laboratorio vocal**, **atajos de teclado**, **telemetría de sesión** y **ayuda contextual**. Las interacciones son locales y demostrativas; no se procesará ni se exportará audio real en esta versión estática.

## Style Decisions

- **Color rule:** Verde Duck Signal `#62F2A5` domina los estados activos. El ámbar y el coral se reservan para atención, solo y grabación; los colores de instrumento son tintes secundarios y desaturados.
- **Viewport rule:** Cada vista se articula como una cabina continua: transporte superior, biblioteca lateral, área de creación y un plano inferior de telemetría, sin extensiones oscuras vacías.
- **Motif rule:** Retículas de calibración, marcas de compás, lecturas de canal, escalas de medidor y formas de onda construyen un sistema de señal coherente en toda la aplicación.
