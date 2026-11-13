# Reality Check — DUCK Full Studio Pro

Este ledger mantiene una distinción estricta entre lo que el producto ejecuta de forma verificable y lo que continúa siendo una referencia o una limitación conocida. La actualización corresponde al pase de implementación de las peticiones del archivo adjunto.

## Implementado y verificable

| Área | Evidencia | Estado |
|---|---|---|
| Autenticación | `server/routers.ts`, `server/_core/oauth.ts`, `client/src/const.ts` y pruebas de logout | Real |
| Arquitectura | `server/duckStudio/` separa validación, autorización, almacenamiento, catálogo y CoLab; `duckStudioRouters.ts` conserva el adaptador tRPC | Real |
| Proyectos | `duckStudio.getProjects` y `duckStudio.createProject` consultan y escriben `duck_projects` mediante Drizzle/MySQL e índice por propietario/fecha | Real |
| Portal de clientes | `duckStudio.getClients` deriva sus datos de `duck_projects`; no usa clientes inventados en memoria | Real, con alcance interno |
| Stems | `uploadStem` valida formato y tamaño, sube bytes mediante `storagePut`, registra metadatos y devuelve acceso derivado | Real |
| Descarga | `getStems` utiliza `storageGet` y trata de generar `storageGetSignedUrl`; no devuelve la clave S3 cruda a la interfaz | Real, con fallback de proxy |
| Revisión | `updateStemStatus` persiste `enviado`, `aprovado` o `revisao_solicitada`, junto con nota y responsable | Real |
| Comentarios | `getComments` y `addComment` persisten texto y `timestampSeconds` en `duck_comments` | Real |
| Auditoría | Creación de proyecto, upload, cambio de estado y comentario escriben `duck_audit_logs` | Real |
| CoLab | `duckStudio.aiChat` responde por reglas locales en cinco idiomas y declara `mode: local-rule-based` | Real como asistente local; no es un LLM |
| Interfaz | `DuckFullStudioPro.tsx` contiene formularios, estados de carga/vacío/error, preview de audio, aprobación y comentarios | Real |
| Rendimiento | Las rutas públicas secundarias se cargan con `React.lazy`; el workspace principal permanece disponible en la entrada inicial | Real, con advertencia de bundle pendiente |
| Pruebas | Integración del router, validación, servicios extraídos, autenticación y contrato responsive | 6 archivos, 16 tests aprobados |

## Límites conocidos y no promesas

El CoLab no está entrenado con datos privados ni aprende automáticamente de las conversaciones. Su respuesta es una base local de reglas: puede servir como guía operativa, pero no sustituye la escucha, la mezcla ni una decisión profesional.

El Vault entrega un catálogo de referencias para FL Studio. Los enlaces GitHub se marcan cuando existe una fuente verificable; las entradas sin fuente son referencias de catálogo, no instaladores ni plugins reales. Los productos comerciales no se clonan, distribuyen ni presentan como incluidos en el workspace.

La integración con WhatsApp, email, pagos o servicios externos no se considera conectada solo porque existan enlaces de contacto. Para convertirla en automatización se requieren credenciales, consentimiento y una implementación específica revisable.

Los archivos de audio necesitan que el almacenamiento del entorno esté disponible. El portal muestra un enlace derivado o firmado; si la firma no está disponible, conserva el proxy de almacenamiento como fallback operativo sin exponer la clave interna.

La autorización privada ahora restringe proyectos, stems, comentarios, auditoría y generación de URLs firmadas mediante `ownerOpenId`. Aún no existe identidad externa de cliente, expiración ni revocación de tokens para publicar un portal fuera del workspace; esa ampliación queda explícitamente fuera de esta entrega.

El build de producción continúa informando chunks grandes de dependencias de edición y visualización. A carga diferida de rotas reduz o custo inicial das rotas secundárias, mas não permite afirmar métricas Core Web Vitals, Lighthouse acima de 90 ou bundle menor que 200 KB sem medição dedicada e novas mudanças de dependências.

## Criterio de entrega

No se utiliza la etiqueta “10/10” como afirmación técnica automática. Cada afirmación de funcionalidad debe tener una ruta, un procedimiento, una tabla, una prueba o un estado de error visible que la respalde.
