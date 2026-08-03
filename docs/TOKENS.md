# DUCK — TOKENS DE DESIGN SYSTEM (Fase 3)

## 3A. Color
| Token | Valor | Uso |
|---|---|---|
| --color-bg | #080e08 | Fondo principal (dark) |
| --color-bg-2 | #0a0f0a | Fondo secundario |
| --color-surface | #15210f | Cards |
| --color-surface-2 | #1e3018 | Superficie elevada |
| --color-text | #efe7d0 | Texto primario |
| --color-text-2 | rgba(239,231,208,.5) | Texto secundario |
| --color-accent | #9acb6b | Acento principal (verde) |
| --color-accent-2 | #22c55e | Acento secundario |
| --color-success | #22c55e | Estado success |
| --color-warning | #eab308 | Estado warning |
| --color-danger | #ef4444 | Estado danger |
| --color-border | rgba(154,203,107,.15) | Bordes |
| --color-overlay | rgba(0,0,0,.7) | Backdrop |
| --color-focus | #9acb6b | Focus ring |
| --color-accent-hover | #b4dc85 | Hover de acento |
| --color-accent-active | #7fae54 | Active de acento |

Contraste WCAG AA: texto #efe7d0 sobre bg #080e08 = ratio ~15.3:1 (pasa).
Acento #9acb6b sobre bg #080e08 = ratio ~8.9:1 (pasa para UI).

## 3B. Tipografía
- --font-display: 'Space Grotesk' (headings)
- --font-body: 'Inter' (body)
- --font-mono: 'JetBrains Mono' (labels técnicos)
- --fs-base: 16px, --lh-base: 1.6, --lh-heading: 1.1
- --ls-heading: -.02em, --ls-label: .22em

## 3C. Spacing y layout
- Escala 4px: --sp-1..10 (4,8,12,16,24,32,48,64,96,128)
- --container: 1200px, --container-wide: 1440px
- --radius-sm/md/lg/pill: 8/16/24/999px
- --shadow-1..4: elevación progresiva

## 3D. Motion
| Token | Valor |
|---|---|
| --dur-micro | 150ms |
| --dur-ui | 300ms |
| --dur-hero | 600ms |
| --dur-page | 800ms |
| --stagger | 60ms |
| --ease-out-expo | cubic-bezier(.16,1,.3,1) |
| --ease-micro | cubic-bezier(.4,0,.2,1) |
| --ease-ui | cubic-bezier(.23,1,.32,1) |

## Verificación
- 27 hex únicos en CSS; los principales tokenizados. Variantes de sombra/leds
  de módulos quedan como literales (aceptable para canvas/animation).
- Breakpoints usados: @media(max-width:768px) y otros existentes.
