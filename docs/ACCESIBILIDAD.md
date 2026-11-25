# Accesibilidad

Objetivo: **WCAG 2.2 AA** en las superficies públicas. Lo que sigue es lo que el
código hace, no lo que se espera que haga.

## Mecanismos implementados

| Requisito | Implementación | Dónde |
|---|---|---|
| 1.3.1 Información y relaciones | HTML semántico: `header`/`nav`/`main`/`section`/`footer`, un solo `main` por página | todas las páginas |
| 1.4.3 Contraste | Texto `#f4efe7` sobre `#0b0a09` (≈17:1) y `--dim` `#b4aa9b` (≈8:1); el acento se usa para texto sobre fondo oscuro | `assets/site.css` |
| 2.1.1 Teclado | Controles nativos (`button`, `input`, `select`, `a`), sin `div` clicables | `index.html` |
| 2.4.1 Evitar bloques | Un único enlace de salto `#contenido`, verificado por `scripts/audit-html.mjs` | todas |
| 2.4.7 Foco visible | `:focus-visible` con contorno de 3 px y `outline-offset` | `assets/site.css` |
| 3.3.2 Etiquetas | Cada control tiene `label` asociada (`for`/`id`) o nombre ARIA | `index.html` |
| 4.1.2 Nombre, función, valor | `aria-pressed` en los botones de la estación, `role="status"` + `aria-live` para anunciar el estado de audio | `js/studio.js` |
| 4.1.3 Mensajes de estado | `#studio-status` anuncia «Sintetizador activo», «Metrónomo detenido», etc. | `js/studio.js` |
| 2.3.3 Animación por interacción | `prefers-reduced-motion`: sin bucle de shader, sin animación del analizador | `js/hero-gl.js`, `js/studio.js` |
| 1.1.1 Contenido no textual | `alt` descriptivo en portadas y estaciones; canvas del hero `aria-hidden`; analizador con `role="img"` y `aria-label` | `js/site.js`, `index.html` |
| 2.5.8 Tamaño del objetivo | Controles de al menos 44 px de alto | `assets/site.css` |

## Límites declarados

- **El canvas del hero es decorativo** (`aria-hidden="true"`): no aporta
  información que no esté en el texto.
- **El analizador de espectro no es accesible por lector de pantalla por
  naturaleza**: se declara con `role="img"` y una etiqueta que describe qué es,
  y el estado relevante (reproduciendo/detenido) se comunica por texto.
- **El audio no arranca solo**: requiere un gesto, por política del navegador.

## Cómo se comprueba

```bash
node scripts/audit-html.mjs --strict   # estructura, ids, etiquetas, saltos de encabezado
python3 -m unittest discover -s tests -t . -v   # contratos de accesibilidad por página
```

`scripts/audit-html.mjs` verifica, página por página: `doctype`, `lang`,
`viewport`, exactamente un `main` y un `h1`, ids únicos, destino del enlace de
salto, `<a>` con `href`, `alt` en imágenes, etiquetas de control, `role="img"`
con nombre accesible y orden de encabezados. La CI lo ejecuta en modo estricto.

## Pendiente

- Revisión manual con lector de pantalla real (NVDA/VoiceOver) en la estación de
  audio. No se ha podido hacer en este entorno y no se declara como hecha.
- Medición de contraste automatizada completa (solo se ha calculado a mano sobre
  los pares principales de la paleta).
