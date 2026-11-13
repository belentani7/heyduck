# DUCK Full Studio Pro — Brief de Producto

## Objetivo

Consolidar un espacio privado y gráfico para que DUCK organice producciones musicales, reciba stems, revise entregas por timestamp, gestione el estado de aprobación y mantenga un catálogo legal de herramientas relacionadas con FL Studio.

## Alcance incluido

El producto incluye autenticación mediante Manus OAuth, una interfaz en portugués, persistencia MySQL para proyectos, stems, comentarios y auditoría, almacenamiento de archivos con enlaces de descarga derivados, aislamiento por propietario, un portal interno de revisión y un asistente CoLab local de reglas explícitamente no entrenado. También incluye catálogo de referencias y rutas públicas de portfolio.

## Alcance excluido

Esta versión no controla hardware, PLC, IoT, pagos, correo, WhatsApp, agentes autónomos, LLM entrenado, portal externo por token, microservicios, Kubernetes ni Docker. Esas capacidades requieren requisitos de negocio, credenciales, datos, presupuesto, evaluación de seguridad y una arquitectura específica; no se simulan como disponibles.

## Criterios de aceptación

| Entregable | Criterio medible |
|---|---|
| Proyectos | Un usuario autenticado crea y consulta únicamente sus propios proyectos. |
| Stems | La subida valida MIME, tamaño y propiedad del proyecto; la clave interna no llega al navegador. |
| Revisión | Los comentarios con timestamp y estados de stem se persisten y generan auditoría. |
| Interfaz | Las rutas secundarias se cargan bajo demanda y el menú conserva los cinco módulos en móvil y escritorio. |
| Calidad | TypeScript, Vitest y build de producción finalizan correctamente. |

## Supuestos vigentes

La plataforma administrada proporciona OAuth, MySQL, almacenamiento y despliegue. DUCK opera el sistema mediante interfaz gráfica. Cualquier integración de terceros se añadirá solamente después de recibir permisos y credenciales explícitas.
