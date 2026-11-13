# 05 Hume — Discografia Viva e Conexão

## Propósito

Último módulo de DUCK Living Machine. Transforma a experiência acumulada em prova de obra e numa ação humana: escolher uma referência, copiar um briefing e contactar Duck. A tecnologia permanece como infraestrutura sensível; capas, títulos e decisão do visitante continuam como figura principal.

## Arquivos

- `artifact.html`: fragmento semântico do escaparate, caso expandido, síntese visual, briefing e contacto.
- `module.css`: estilos integralmente encapsulados sob `[data-duck-module="05"]`.
- `module.js`: módulo ES que exporta `mount(root, bus)` e `destroy()`.
- `README.md`: contrato, dependências, saídas, limites editoriais e testes.

## Dependência do módulo anterior

Responsável anterior: **04 Sartre — Laboratório Sonoro**.

Evento primário consumido:

```text
duck:module:04:output
```

Payload esperado:

```js
{
  sonicFingerprint: string | Record<string, string | number>,
  activeLayers: string[],
  briefingPhrase: string
}
```

También se acepta `duck:lab:output` con el mismo contrato para facilitar la integración del orquestador. Si 04 todavía no emitió datos, Hume permanece legible, utiliza un estado neutro y no bloquea catálogo ni contacto. Como recuperación, lee `document.documentElement.dataset.duckSonicFingerprint`, `duckActiveLayers` y `duckBriefingPhrase` sin duplicarlos internamente como estado público.

## Montaje

```js
import { mount, destroy } from "./modules/05-discografia-conexion/module.js";

const root = document.querySelector('[data-duck-module="05"]');
mount(root, duckBus);

// Al desmontar la experiencia:
destroy();
```

`duckBus` debe implementar `EventTarget`. Si se omite, se utiliza `document`.

## Salidas finales

Eventos emitidos:

- `duck:work:selected`: cambia la obra de referencia.
- `duck:briefing:copied`: confirma copia por gesto explícito.
- `duck:contact:intent`: registra la intención de abrir el correo, sin enviar nada automáticamente.
- `duck:module:05:output`: salida consolidada para el orquestador.

Payload final:

```js
{
  selectedWork: string | null,
  briefingPhrase: string,
  contactChannel: "email"
}
```

Estado público mínimo escrito:

- `document.documentElement.dataset.duckSelectedWork`
- `document.documentElement.dataset.duckBriefingReady`

Ambos valores se eliminan en `destroy()`.

## Datos editoriales

Las seis obras, títulos, artistas y portadas proceden del `data.js` canónico local:

1. Posturadona — Luiz Cinnamon.
2. Tititi — Leones.
3. De Fininho — Leones.
4. I Wrote a Song — Belentani.
5. Lento — Belentani.
6. Mon Amour — Belentani.

No se muestran streams, BPM, tonalidades, fechas ni créditos específicos porque carecen de fuente primaria consolidada. Las dos previsualizaciones ya presentes en el inventario respondieron HTTP 206 a una petición parcial el 2026-08-13; esto prueba disponibilidad técnica en esa fecha, no autoría ni créditos. El email usado es el contacto del `index.html` canónico: `duck-beats@hotmail.com`.

## Coherencia con los otros cuatro responsables

- **01 Rawls / Portal Vivo:** conserva la continuidad morado profundo, verde ácido, crema y negro tinta. La señal superior completa visualmente la secuencia 01–05.
- **02 Bohr / Identidad Orgánica:** Duck y su obra siguen siendo figura; el shader actúa como fondo reactivo, nunca como protagonista.
- **03 Kant / Motor de Producción:** la interfaz mantiene causa y efecto: elegir referencia modifica caso, briefing, estado público y evento.
- **04 Sartre / Laboratorio Sonoro:** la huella, capas y frase se convierten en síntesis visual y texto accionable sin reinterpretar ni ocultar su origen.
- **05 Hume:** cierra el ecosistema con evidencia honesta, selección, briefing y CTA humano; no exige un sexto módulo.

## Gestalt

- Figura–fondo: portadas y título dominan sobre scan, shader y controles.
- Proximidad: escucha, identidad y estado pertenecen a la misma tarjeta.
- Semejanza: las seis obras comparten estructura y estados equivalentes.
- Cierre: el shader y la secuencia 01–05 completan la máquina sin dibujar un diagrama literal.
- Continuidad: la huella de 04 recorre indicador, shader, briefing y CTA.
- Destino común: selección, expansión y briefing cambian como una sola decisión.
- Prägnanz: catálogo, caso y contacto mantienen un único foco por escena.

## Accesibilidad

- Región titulada y lista semántica de obras.
- Botones reales con `aria-pressed`, nombres accesibles y foco visible.
- Audio apagado por defecto, iniciado solo por gesto y detenido al destruir.
- Estado de reproducción y copia anunciado con `aria-live`.
- `prefers-reduced-motion` elimina barridos y mantiene un frame estático del shader.
- Fallback visual cuando WebGL no existe.
- Alto contraste, soporte de `forced-colors`, teclado y diseño responsive.

## Rendimiento y aislamiento de fallos

- Canvas limitado a DPR 1.5.
- Shader pausado fuera del viewport mediante `IntersectionObserver`.
- Una única previsualización puede sonar a la vez.
- Sin listeners anónimos imposibles de retirar; `destroy()` limpia eventos, GSAP, observador, WebGL y audio.
- GSAP, ScrollTrigger y CustomEase se usan cuando el núcleo los proporciona. Sin ellos, el módulo conserva contenido e interacción.
- Ningún fallo de audio o WebGL oculta catálogo, briefing o contacto.

## Verificación prevista

1. `node --check module.js` debe terminar con código 0.
2. Las seis rutas locales de portada deben existir.
3. `artifact.html` debe tener IDs únicos.
4. Todos los selectores CSS deben permanecer bajo `[data-duck-module="05"]` salvo `@media` y `@keyframes`.
5. `mount()` debe devolver el estado final inicial; `destroy()` debe poder ejecutarse más de una vez.
6. La prueba de navegador debe cubrir teclado, movimiento reducido, pérdida de WebGL, fallo de audio, viewport móvil y recepción real del evento de 04.

## Límite de responsabilidad

Este módulo no modifica `index.html`, variantes existentes, documentos, núcleo ni carpetas 01–04. El orquestador decidirá cómo insertar el fragmento y cargar sus estilos y módulo ES en `duck-living-machine.html`.
