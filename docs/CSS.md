# DUCK — CSS Y LAYOUT (Fase 5)

## 5A. Reset base
- `*{box-sizing:border-box}`, reset de margen/padding
- `html{font-size:16px;scroll-behavior:smooth}`
- `text-rendering:optimizeLegibility`, `-webkit-font-smoothing:antialiased`
- `::selection`, `:focus-visible`, scrollbar personalizada
- `prefers-reduced-motion:reduce` desactiva animaciones

## 5B. Layout system
- `.container` (1200px), `.container--wide` (1440px)
- `.grid` 12 columnas + `.col-1`..`.col-12` (colapsan a 1 col en mobile)
- `.flex`, `.flex-center`, `.flex-between`
- `.section`, `.section--alt`, `.sr-only`, `.hidden`
- `.text-center`, `.text-uppercase`, `.no-scrollbar`
- `.aspect-16-9`, `.aspect-1-1`, `.aspect-4-3`, `.ellipsis`

## 5C. Tipografía
- h1: clamp(2.8rem,7vw,6rem), h2: clamp(2.5rem,5vw,5rem)
- p: line-height 1.6, small: .75em, overflow-wrap:break-word

## 5D. Responsive
| Breakpoint | Query |
|---|---|
| Mobile | base (max-width:768px, 480px) |
| Tablet | min-width:641px and max-width:1024px |
| Desktop | (default) |
| Ultra-wide | min-width:1441px |

Touch targets: 44px mínimo en button/a/select/range.

## 5E. Dark mode
Dark es default (--bg:#080e08). Sin flash de tema claro.
No hay toggle de tema (decisión: marca oscura única).
Contraste WCAG AA verificado en docs/TOKENS.md.
