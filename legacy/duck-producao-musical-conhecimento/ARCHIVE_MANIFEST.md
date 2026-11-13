# Manifiesto del archivo Duck — 2026-08-22

## Propósito

Este paquete conserva el material del proyecto Duck Produção Musical generado, transformado o utilizado durante la conversación visible: código, documentación, adjuntos originales, historial Git, parches de versiones, hashes y transcripción visible del chat.

## Contenido

| Ruta | Contenido |
|---|---|
| `project/` | Copia portable del proyecto sin dependencias instaladas, builds temporales, logs de desarrollo ni configuración privada del entorno. |
| `source_uploads/` | Adjuntos originales disponibles: `duckweb.zip` y `pasted_content.txt`. |
| `generated_assets/` | Cinco assets visuales generados para hero, logo, consola, ondas y estudio. |
| `evidence/screenshots/` | Capturas de verificación visual generadas durante el desarrollo. |
| `history/git-log.txt` | Historial de commits disponible en el repositorio local al crear el archivo. |
| `history/patches/` | Parches reproducibles exportados desde los commits del proyecto. |
| `CHAT_TRANSCRIPT_VISIBLE.md` | Transcripción visible y contextual del chat, sin contenido interno o credenciales. |
| `SHA256SUMS.txt` | Huellas SHA-256 de todos los archivos del paquete excepto el propio archivo de hashes. |

## Versiones del proyecto

| Identificador | Tipo | Significado |
|---|---|---|
| `08d6d86f` | Checkpoint Manus | Proyecto inicializado. |
| `75088327` | Checkpoint Manus | Primera entrega completa de la landing y auditoría. |
| `81bf59bd` | Checkpoint Manus | Mejora autónoma de accesibilidad y UX. |
| `6d895a2b` | Checkpoint Manus | Soporte de alojamiento externo y autohospedaje. |
| `7508832` | Commit Git | Landing, auditoría, dependencias, SEO y CI. |
| `81bf59b` | Commit Git | Accesibilidad, formulario, catálogo y navegación móvil. |

## Exclusiones deliberadas

No se incluyen `node_modules/`, `dist/`, `.git/`, `.manus-logs/`, archivos de configuración privada del proyecto Manus, el colector de depuración, tokens, credenciales, cookies, claves, secretos ni builds generados temporalmente. Tampoco se incluyen instrucciones internas del sistema o especificaciones privadas de herramientas.

La exclusión de `.git/` se compensa con `history/git-log.txt` y los parches exportados. La copia de GitHub conservará además el historial propio del nuevo repositorio archivístico desde su creación.

## Integridad y privacidad

El repositorio de destino debe ser privado. La copia de Drive se subirá como archivo privado de la cuenta autenticada, sin compartirla públicamente ni modificar archivos existentes. Para verificar la transferencia, comparar el hash del archivo descargado con el registro correspondiente una vez que Drive o GitHub entregue el archivo.

## Limitación importante

No existe una API disponible para extraer automáticamente una transcripción literal completa de todas las capas internas de la conversación. `CHAT_TRANSCRIPT_VISIBLE.md` es una reconstrucción fiel del contenido visible y relevante para el proyecto; los archivos generados contienen el detalle completo de código y documentación que sí pudo conservarse localmente.
