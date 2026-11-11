# AUDITORIA_ESTADO — heyduck

- Cumplimiento: **92.5%** (37 ok / 3 incumple / 9 no evaluable)
- Paginas HTML muestreadas: 6
- Generado: 2026-11-07T18:29:43

## Reglas que incumple

| Regla | Detalle |
|---|---|
| COH-01 | variantes de marca: ['belentani', 'belentani7', 'belentani_', 'belentani_omega', 'belentaniexperience'] |
| DEV-06 | sin archivos duplicados/muertos |
| WEB-06 | 404.html: sin <header> |

## Reparacion

```bash
python _audit/reparar.py --apply --only heyduck
```
