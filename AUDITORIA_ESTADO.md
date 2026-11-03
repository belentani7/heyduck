# AUDITORIA_ESTADO — heyduck

> Repositorio físico: `belentani-ecosystem/arte-musica/heyduck`

## Situación actual

| Indicador | Valor |
|-----------|-------|
| Categoría | arte-musica |
| Lenguaje | HTML |
| Rama | main |
| package.json | No |
| Python | No |
| Docker | No |
| README | Sí |
| AGENTS.md | No |
| Tests | No |
| CI | Sí |

## Comentarios

- Hub web del universo DUCK: apps, música y herramientas de producción.
- Repo curado (categoría creative).
- Hallazgo veracidad: index.html tiene cifras sin fuente (R3): "1400+ ABONNÉS, 1400+ FOLLOWERS, 1400+ SEGUIDORES".

## Comando para arreglar y elevar

```bash
# 1. Corregir cifras sin fuente en index.html (añadir fuente o eliminar)
# 2. HTML estático: copiar archivos al servidor
# 3. Crear AGENTS.md con reglas del ecosistema belentani7
# 4. Crear tests básicos (validación HTML, enlaces rotos)
gitleaks detect --source .