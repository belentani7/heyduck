# Arquitectura de unificación

## Decisión central

Se adopta `apps/studio-os` como aplicación única porque ya concentra autenticación de demostración, clientes, proyectos, versiones, archivos, control de calidad, facturación, plugins, DAW Bridge, automatizaciones, cadenas, calendario, analytics, auditoría y capacidades. El Portal de Clientes se integra como superficie de rol y distribución; no se mantiene como segundo servidor independiente.

| Capa | Fuente principal | Integración prevista |
|---|---|---|
| Interfaz y navegación | Studio OS | Una navegación con vistas de propietario y cliente, identidad visual DUCK/ZION y accesibilidad consistente. |
| Dominio y persistencia | Prisma de Studio OS | Adaptadores para entidades adicionales del Portal; no se duplican modelos `Client`, `Project`, `Invoice` ni `Notification`. |
| Automatizaciones | Rutas `automations`, `chains` y `cron/checks` | Registro versionado de triggers, acciones, permisos, simulación y auditoría. |
| Plugins | Rutas `plugins` y clones de Tauri | Contrato de plugin con manifest, permisos mínimos, health check, versión y rollback. |
| Experiencia inmersiva | `packages/experiencia-inmersiva` | Se publica como módulo de presentación y se invoca desde el núcleo; no modifica el dominio. |
| Toolkit Gema | `packages/gema-toolkit` | Se mantiene autónomo y se enlaza desde Herramientas mediante una ruta segura. |
| Distribución | `packages/portal-clientes` | Adaptadores para escritorio, móvil y Android; el backend permanece en el núcleo. |
| Observabilidad y gobierno | Auditoría + Validation Ledger | Cada acción de plugin, automatización o IA genera un envelope verificable. |

## Priorización de mejoras

| Prioridad | Mejora | Resultado esperado | Criterios de aceptación |
|---:|---|---|---|
| P0 | Contrato de módulos y manifest de capacidades | El núcleo descubre módulos sin acoplarse a cada implementación. | Manifest versionado, permisos explícitos, health check y error aislado. |
| P0 | Validation Ledger para IA y automatizaciones | Trazabilidad de intención, entrada, salida, decisión y acción. | Registro inmutable lógico, correlación por ejecución y política de retención. |
| P0 | Unificación de clientes, proyectos e invoices | Una sola fuente de verdad para el portal y Studio OS. | Migración idempotente, ausencia de rutas duplicadas y pruebas de regresión. |
| P1 | Command Center con capacidades y estado | Mejor aspecto y utilidad operativa. | Estado de módulos, automatizaciones fallidas, salud, actividad y accesos rápidos. |
| P1 | Sistema de plugins seguro | Extensibilidad sin copiar repositorios completos. | Sandbox, allowlist de permisos, firma/versionado y rollback. |
| P1 | Automatizaciones visuales | Flujos reutilizables para proyectos, QA, notificaciones y entregas. | Trigger, condiciones, acciones, simulación y auditoría. |
| P2 | Experiencia inmersiva y Toolkit como superficies | Una marca coherente con herramientas especializadas. | Rutas o tarjetas de acceso, assets con hash y carga sin bloquear el núcleo. |
| P2 | Adaptadores desktop/mobile | Distribución multiplataforma con backend común. | Build reproducible, configuración por entorno y sin credenciales embebidas. |

## Repositorios candidatos

La investigación pública produjo 300 candidatos clasificados en capacidad, aspecto, automatizaciones, plugins, utilidad y complementarios. La integración inicial debe concentrarse en patrones y contratos de proyectos como **Nx** para organización, **Windmill** o **Automatisch** para automatizaciones, **Theia**, **Continue** y **OpenHands** para extensibilidad asistida, **shadcn/ui** y **Radix** para consistencia visual, y **OpenTelemetry** o herramientas de observabilidad para trazabilidad. La decisión final depende de licencia, compatibilidad de runtime, seguridad y coste de mantenimiento.

## Límites de seguridad

No se ejecuta código de los clones investigados ni se incorporan lockfiles, binarios, hooks Git o scripts de instalación sin revisión. Todo módulo nuevo debe pasar análisis estático, revisión de dependencias, pruebas unitarias, prueba de integración aislada y verificación de que no expone secretos ni permite acciones irreversibles sin confirmación.
