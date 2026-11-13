# Plan de Evolución Verificable

| Hito | Estado | Evidencia |
|---|---|---|
| Inventario de peticiones del adjunto y delimitación de alcance | Completado | `todo.md`, `PROJECT-BRIEF.md` |
| Separación del router DUCK Studio por responsabilidades | Completado | `server/duckStudio/` |
| Extracción de esquemas Zod, autorización y adaptación de S3 | Completado | `validation.ts`, `access.ts`, `stemStorage.ts` |
| Carga diferida de rutas secundarias | Completado | `client/src/App.tsx` |
| Índices de consultas frecuentes | Completado | `drizzle/schema.ts` y migración SQL segura aplicada |
| Pruebas de dominio y regresión | Completado | `pnpm test` |
| Documentación de arquitectura, modelo y contratos | Completado | `docs/` |
| Validación final y publicación | Pendiente | Checkpoint posterior a la verificación final |

## Riesgos y alternativas

La carga de archivos por base64 consume memoria del servidor. El límite de 125 MB es una contención operativa; para archivos de producción más grandes, la alternativa será una carga multipart o directa a almacenamiento con autorización temporal. El portal actualmente es interno; una extensión externa necesitará tokens revocables y caducidad por proyecto.
