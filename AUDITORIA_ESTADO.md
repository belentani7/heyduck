# AUDITORIA_ESTADO — heyduck

- Cumplimiento: **77.5%** (31 ok / 9 incumple / 9 no evaluable)
- Paginas HTML muestreadas: 6
- Generado: 2026-11-07T15:18:51

## Reglas que incumple

| Regla | Detalle |
|---|---|
| COH-01 | variantes de marca: ['belentani', 'belentani7', 'belentani_', 'belentani_omega', 'belentaniexperience'] |
| DEV-05 | 2 archivos con console.log |
| DEV-06 | sin archivos duplicados/muertos |
| GH-08 | presente |
| SEO-01 | index.html: title 69 chars |
| SEO-03 | 404.html: title y h1 no comparten termino |
| WEB-06 | 404.html: sin <header> |
| WEB-21 | 15 archivos, 1 con sintaxis invalida |
| WEB-23 | magic/immersive.html: sin favicon |

## Reparacion

```bash
python _audit/reparar.py --apply --only heyduck
```
