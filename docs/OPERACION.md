# Operación

## Rutina

| Cuándo | Qué | Comando |
|---|---|---|
| Antes de cambiar | Línea base | `make check` |
| Durante | Un cambio verificable por vez | `node --test tests/*.test.cjs` |
| Antes de entregar | Gates + suite + doctor | `make check` |
| Al publicar | Confirmar despliegue READY y cabeceras | `curl -sI https://heyduck.vercel.app/` |
| Tras añadir o quitar páginas | Actualizar sitemap y catálogo medido | `node scripts/measure.mjs` |
| Tras cambiar imágenes o referencias | Regenerar el manifiesto de despliegue | `node scripts/deploy-manifest.mjs` |

## Publicación (Vercel)

1. El proyecto despliega desde `main`. Un pull request no publica.
2. Vercel respeta `.vercelignore` **generado**; no editarlo a mano.
3. Verificar tras el despliegue:
   - `https://heyduck.vercel.app/` responde 200 y la estación suena tras un clic.
   - `https://heyduck.vercel.app/sitemap.xml` lista las 7 páginas públicas.
   - Las cabeceras incluyen `Content-Security-Policy` en `/` y
     `Permissions-Policy: geolocation=(), camera=(), microphone=()`.
   - `/legacy/` **no** es accesible (debe dar 404).

## Incidentes

1. Reproducir con el mínimo caso.
2. Comprobar si el gate lo detectaba; si no, añadir la comprobación **antes** del
   arreglo, para que no vuelva.
3. Corregir, volver a ejecutar `make check`, anotar en `CHANGELOG.md`.

Historial relevante: cuatro workflows estuvieron rotos por YAML inválido y el
comando de pruebas documentado ejecutaba cero pruebas. Ambos casos ya tienen su
comprobación en `scripts/audit-config.mjs` y `tests/test_contracts.py`.

## Copias y archivo

- Nada se borra de la historia: `legacy/` se conserva íntegro y queda fuera del
  despliegue.
- Las copias de seguridad se hacen por Git, no por duplicados manuales.
- Los artefactos locales (`*.log`, `node_modules/`, `.vercel`, `.env*`) están en
  `.gitignore` y en `.vercelignore`.

## Costes y límites

- El sitio no tiene backend, base de datos ni servicios de terceros: no hay
  coste variable por uso ni datos personales almacenados.
- El único servicio externo es el hosting estático.
