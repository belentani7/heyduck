# 04 — Sartre / Laboratorio Sonoro

## Propósito

Instrumento Web Audio que permite tocar el criterio de Duck sin convertir el portfolio en una consola técnica. La composición produce una huella breve y una frase utilizable por el siguiente módulo.

## Archivos

- `artifact.html`: fragmento semántico del laboratorio.
- `module.css`: diseño encapsulado bajo `[data-duck-module="04"]`.
- `module.js`: módulo ES con `mount(root, bus)` y `destroy()`.

## Dependencia de Kant / 03 Motor de Producción

Escucha `duck:process-output` en el `EventTarget` entregado como `bus`. El evento puede incluir:

```js
{
  processStage: "construir",
  tempoHint: 96,
  textureHint: 64,
  spaceHint: 38
}
```

- `tempoHint`: BPM limitado entre 64 y 148.
- `textureHint`: apertura del filtro, de 0 a 100.
- `spaceHint`: proporción espacial, de 0 a 100.
- `processStage`: etiqueta breve visible, máximo 24 caracteres.

Si 03 todavía no ha emitido estado, el laboratorio conserva una configuración inicial musical: 96 BPM, apertura 64 y espacio 38. No importa código ni consulta estado privado de Kant.

## Salida para Hume / 05 Discografía Viva y Conexión

Emite `duck:sonic-output` al montar y después de cada decisión confirmada:

```js
{
  module: "04",
  owner: "Sartre",
  sonicFingerprint: "DRF-PB-426438",
  activeLayers: ["pulse", "body"],
  briefingPhrase: "Un pulso elástico con cuerpo preciso, textura definida y aire para respirar."
}
```

Hume puede usar `sonicFingerprint` como semilla visual, `activeLayers` para filtrar obra y `briefingPhrase` como inicio del briefing. El estado público mínimo se refleja en `document.documentElement.dataset`: `duckAudio`, `duckSonicFingerprint` y `duckActiveLayers`.

## Montaje

```js
import { mount, destroy } from "./module.js";

const bus = new EventTarget();
const root = document.querySelector('[data-duck-module="04"]');
mount(root, bus);

// Al desmontar la página:
destroy();
```

`mount` también acepta un contenedor que incluya el fragmento. Una nueva llamada destruye primero la instancia anterior.

## Artefacto musical

- Patrones: Deriva, Salto e Impulso.
- Capas: Pulso secuenciado, Cuerpo sostenido, Aire sostenido y Gesto digital secuenciado.
- Controles: presión, apertura, espacio, volumen, mute y reset.
- Salida: frase humana y huella determinista.
- Cadena: entrada, mezcla seca/delay, ganancia maestra, compresor y analizador.
- Nivel máximo de la ganancia maestra: `0.34`; un compresor final limita picos combinados.

## Accesibilidad

- Audio apagado inicialmente y creado solo al activar el laboratorio mediante botón.
- Todos los controles usan elementos HTML nativos accesibles por teclado.
- Foco visible, `aria-pressed`, salida `aria-live` y texto alternativo del estado.
- `prefers-reduced-motion` elimina órbitas y respiración; el instrumento conserva toda su función.
- En ausencia de Web Audio, aparece un fallo visible y la huella visual sigue operativa.
- El botón Silenciar lleva el master a cero inmediatamente mediante una rampa corta anti-click.

## Rendimiento y ciclo de vida

- Secuenciador con reloj Web Audio y ventana de anticipación de 120 ms.
- Canvas limitado a DPR 1.5 y sin dibujo efectivo fuera del viewport.
- Un solo `AudioContext`; osciladores transitorios se detienen tras su envolvente.
- `destroy()` retira listeners, desconecta `IntersectionObserver`, cancela canvas, detiene voces sostenidas y cierra el contexto.
- Sin dependencias externas ni acceso de red.

## Coherencia con los cinco responsables

- Rawls / 01: conserva morado profundo, verde ácido, crema y tinta negra; la señal superior continúa la transformación global.
- Bohr / 02: la máquina deja a Duck como autor; el texto habla de criterio y sensibilidad, no de especificaciones.
- Kant / 03: convierte tempo, textura, espacio y etapa en una configuración audible sin duplicar su estado.
- Sartre / 04: agrupa cada acción con su resultado, aplica continuidad a la onda y cierre a la forma incompleta del núcleo.
- Hume / 05: entrega una huella compacta y una frase directamente reutilizable en obra y briefing.

## Pruebas esperadas

1. Importar `module.js` como ES module sin errores de sintaxis.
2. Montar el fragmento y confirmar `data-module-state="ready"`.
3. Confirmar que no existe `AudioContext` antes del gesto.
4. Activar: escuchar salida sin distorsión y obtener `duckAudio="active"`.
5. Emitir `duck:process-output` y verificar BPM, apertura, espacio y etapa.
6. Cambiar patrón, capas y controles; comprobar `duck:sonic-output`.
7. Silenciar: salida inmediata a cero; recuperar sonido sin recrear contexto.
8. Reiniciar: valores iniciales, manteniendo el laboratorio encendido.
9. Desmontar: contexto cerrado, animación cancelada y datasets retirados.
