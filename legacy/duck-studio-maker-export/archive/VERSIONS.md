# DUCK Studio Maker — Historial de versiones

El repositorio local conserva el historial Git disponible al momento de la exportación. Los checkpoints de WebDev identificados se documentan a continuación.

| Identificador | Tipo | Descripción |
|---|---|---|
| `1f08d69a` | Checkpoint / commit | Bootstrap inicial del proyecto full-stack DUCK Studio Maker. |
| `a33fdc53` | Checkpoint / commit | Implementación inicial de la base de datos de proyectos, router tRPC, dashboard, generadores visuales, galería, i18n e integración de IA. |
| `2ff5da40` | Checkpoint / commit | Estado estable más reciente antes de esta exportación, con identidad visual DUCK, navegación lateral, exportación visual y pruebas ampliadas. |

## Historial Git

El archivo `duck-studio-maker-source.bundle` contiene el historial de objetos y referencias locales del proyecto para poder inspeccionarlo o clonarlo sin depender del repositorio original de WebDev.

## Alcance de esta versión

La exportación incluye el estado del código presente en el proyecto al iniciar la preparación. Los cambios de documentación de exportación y el presente manifiesto se añaden como material de distribución; no modifican la lógica de la aplicación.

## Integridad

El archivo `SHA256SUMS` permite comprobar que el contenido descargado desde GitHub o Drive coincide con el paquete preparado localmente.

## Seguridad

El historial se filtra para evitar publicar secretos de entorno. No se incluyen archivos `.env`, credenciales, cookies, tokens ni datos privados de autenticación.
