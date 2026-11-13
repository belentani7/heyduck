# DUCK Studio Maker — Exportación completa

Este paquete contiene el proyecto full-stack DUCK Studio Maker, los artefactos visuales disponibles, el historial local de versiones y una transcripción documentada de la conversación que dio origen al producto.

## Contenido

| Ruta | Descripción |
|---|---|
| `project/` | Código fuente completo del proyecto WebDev, excluyendo secretos y archivos de sesión. |
| `generated-assets/` | Assets originales y resultados generados durante el trabajo de flyers, tarjetas y QR. |
| `CHAT_TRANSCRIPT.md` | Transcripción reconstruida del contenido visible y relevante del chat. |
| `VERSIONS.md` | Historial de checkpoints y commits disponibles. |
| `SHA256SUMS` | Hashes SHA-256 de los archivos publicados. |
| `duck-studio-maker-source.bundle` | Bundle Git con el historial local del proyecto. |

## Ejecución local

Desde `project/`, instala dependencias con `pnpm install`, configura las variables requeridas por Manus/WebDev de forma segura y ejecuta `pnpm dev`. Para validación, ejecuta `pnpm test` y `pnpm check`.

## Seguridad

No se incluyen `.env`, credenciales, tokens, cookies ni secretos del entorno. Los assets se incluyen únicamente como archivos exportados; el proyecto mantiene la política de usar almacenamiento gestionado para archivos estáticos en despliegues.

## Destinos

El contenido se publica en un repositorio nuevo de GitHub con visibilidad privada y en Google Drive con los permisos de la cuenta autenticada. La publicación debe verificarse comparando los hashes de `SHA256SUMS`.
