# Matriz de Auditoría Suprema — DUCK Full Studio Pro

Esta auditoría utiliza una matriz de evidencia práctica inspirada en calidad de producto, control de acceso, mantenibilidad y trazabilidad. No convierte automáticamente un módulo en “10/10”: cada resultado se limita a lo que puede verificarse en el código, la base de datos, los tests y la interfaz.

## Matriz actualizada

| Dimensión | Evidencia revisada | Resultado |
|---|---|---|
| Persistencia | `drizzle/schema.ts`, tablas `duck_projects`, `duck_stems`, `duck_comments`, `duck_audit_logs`, índices por propietario/proyecto/fecha y SQL seguro aplicado | Verificado |
| Backend | `server/duckStudioRouters.ts` compone módulos de validación, acceso, almacenamiento, catálogo y CoLab para proyectos, stems, comentarios, estados y auditoría | Verificado con límites documentados |
| Almacenamiento | `storagePut`, `storageGet` y `storageGetSignedUrl`; claves internas no se envían al cliente | Verificado |
| Validación | Zod limita nombres, BPM, timestamp, MIME, tamaño de archivo y contenido de comentarios | Verificado |
| Autorización | `protectedProcedure`, `ownerOpenId`, filtro por propietario y validación antes de generar URLs firmadas | Verificado para el propietario autenticado; portal externo aún no habilitado |
| Frontend | `DuckFullStudioPro.tsx` conecta queries y mutaciones reales, estados de carga/vacío/error, upload gráfico, preview, aprobación y comentarios | Verificado |
| Cliente | El portal deriva clientes/proyectos del banco persistente; no se mantienen tarjetas estáticas anteriores | Verificado como portal interno |
| CoLab | Respuestas locales en PT, ES, EN, FR e IT con `mode: local-rule-based` y límites explícitos | Verificado; no es LLM |
| Catálogo | Referencias legales y enlaces GitHub identificados; entradas sin fuente se presentan como referencias | Verificado con alcance de catálogo |
| Auditoría | Eventos de creación, upload, comentario y cambio de estado se registran en `duck_audit_logs` | Verificado |
| Pruebas | Router, validación, servicios extraídos, autenticación y contrato responsive | 6 archivos, 16 tests aprobados |
| UX responsive | Navegación móvil explícita, contrato `duckWorkspaceContract.ts`, Vitest incluido para cliente y pruebas de cinco módulos; screenshot desktop/móvil revisado | Verificado por contrato y revisión visual; E2E DOM no instalado |

## Riesgos residuales

El aislamiento por propietario está implementado en el workspace mediante `ownerOpenId`. Para un portal externo de clientes todavía se necesita un token de acceso por proyecto con expiración, revocación y una política específica; no se presenta como entregado.

El upload recibe el archivo en memoria antes de enviarlo al almacenamiento. El límite actual de 125 MB reduce el riesgo operativo, pero un flujo de producción de archivos muy grandes debería usar carga directa o multipartes.

El catálogo contiene referencias de alta confianza y entradas de referencia sin fuente individual. No debe interpretarse como una instalación de 400 plugins, una valoración editorial o una distribución de software comercial.

El build continúa reportando chunks grandes de dependencias de edición y visualización. La carga diferida de rutas se aplicó a módulos secundarios, pero no se ejecutó una auditoría Lighthouse ni mediciones de Web Vitals; por tanto, no se declara un objetivo de bundle ni una puntuación de rendimiento como verificados.

## Criterio de aceptación

El pase se considera aceptado cuando TypeScript no presenta errores, Vitest mantiene la cobertura del flujo proyecto → stem → comentario → aprobación, la base contiene las columnas usadas por Drizzle, los errores del navegador desaparecen y la interfaz no oculta los estados de ausencia o fallo.
