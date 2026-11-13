# 01 — Portal Vivo · Rawls

## Propósito

Primer escaparate de DUCK Living Machine. Presenta en menos de dos segundos a Lucas “Duck” Belentani como productor musical brasileño, joven, tecnológico, divertido y profesional. La fotografía y el logo oficiales son la figura; el sistema, la tinta y la telemetría funcionan como fondo útil.

La escena empieza en morado profundo. Al avanzar, una forma incompleta de pato se cierra, el cubo cae, el pato lo golpea y la tinta verde transforma el estado global. No utiliza partículas ni bolas decorativas.

## Dependencia anterior

No existe módulo visual anterior. Rawls depende únicamente del orquestador para:

- insertar `artifact.html`;
- cargar `module.css`;
- disponer de Archivo Black, DM Mono y Manrope;
- cargar GSAP, ScrollTrigger y CustomEase antes de `mount()`;
- entregar un `EventTarget` compartido como `bus`.

Si GSAP no está disponible, el portal mantiene todo el contenido y activa un movimiento simplificado mediante `IntersectionObserver`. El fallo queda anunciado en el estado accesible y no bloquea los módulos siguientes.

## Salida para 02 — Bohr Identidad Orgánica

Evento principal: `duck:portal:state`.

```js
{
  module: "01",
  owner: "Rawls",
  identityLevel: 0.000, // 0..1
  inkProgress: 0.000,  // 0..1
  dominantColor: "purple" | "ink" | "green",
  motionMode: "full" | "paused" | "reduced"
}
```

Eventos complementarios:

- `duck:portal:ready`: el módulo ya puede ser observado.
- `duck:portal:activate`: el visitante activó el recorrido.
- `duck:motion:change`: cambió la preferencia o el control de movimiento.

Estado público mínimo en `document.documentElement.dataset`:

- `duckIdentityLevel`
- `duckInkProgress`
- `duckDominantColor`
- `duckMotionMode`

Bohr debe escuchar `duck:portal:state` y traducir color, intensidad y movimiento a su retrato orgánico. No debe importar `module.js` ni consultar nodos internos de Rawls.

## API

```js
import { mount, destroy } from "./module.js";
const bus = new EventTarget();
const root = document.querySelector('[data-duck-module="01"]');
const portal = mount(root, bus);
portal.getState();
destroy();
```

`mount(root, bus)` valida ambos argumentos, evita montajes duplicados, conecta controles, activa la coreografía y devuelve `getState()` más `destroy()`. `destroy()` elimina listeners, observadores y contexto GSAP.

## Gestalt y coherencia entre los cinco responsables

- Figura–fondo: Duck domina; la máquina explica sin competir.
- Cierre: el contorno del pato permanece incompleto y se completa perceptivamente.
- Continuidad: la barra inferior representa la señal que seguirá Bohr, Kant, Sartre y Hume.
- Proximidad: acción, explicación y resultado están juntos.
- Semejanza: verde indica activación; crema informa; negro estructura.
- Destino común: pato, cubo, impacto e inundación avanzan como una decisión única.
- Prägnanz: una figura, un titular y una acción principal.

El módulo entrega identidad a Bohr; anticipa el flujo de Kant mediante la señal continua; reserva el audio para Sartre; y evita mostrar singles o CTA final, responsabilidad de Hume.

## Accesibilidad

- Hero etiquetado por `aria-labelledby` y fotografía con texto alternativo.
- Controles nativos con foco visible y estado `aria-pressed`.
- Cambios importantes anunciados mediante `role="status"`.
- `prefers-reduced-motion` fija una composición legible y desactiva coreografía extensa.
- Contraste alto entre morado, verde ácido, crema y negro.
- El contenido permanece completo sin JavaScript ni animación.

## Rendimiento

- Una fotografía principal existente; no duplica recursos.
- Sin canvas, WebGL, audio ni temporizadores permanentes.
- GSAP queda encapsulado con `gsap.context()` y se revierte al desmontar.
- El fallback usa `IntersectionObserver`, no un listener de scroll continuo.
- Transformaciones y recortes se calculan mediante variables CSS del módulo.

## Pruebas ejecutables

```powershell
node --check .\module.js
```

Validación adicional requerida por el orquestador:

1. Resolver las dos rutas `../../../images/...` desde esta carpeta.
2. Montar el fragmento con un `EventTarget` y confirmar `duck:portal:ready`.
3. Recorrer de 0 a 100 % y confirmar límites 0..1.
4. Activar movimiento reducido y confirmar lectura completa sin desplazamiento coreografiado.
5. Ejecutar `destroy()` y comprobar que no quedan ScrollTriggers ni listeners del módulo.
