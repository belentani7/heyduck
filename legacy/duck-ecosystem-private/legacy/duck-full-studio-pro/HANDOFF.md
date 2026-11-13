# Handoff Operativo — DUCK Full Studio Pro

## Estado entregado

El workspace privado está activo en la ruta raíz. Los proyectos, stems, comentarios, estados de revisión y eventos de auditoría utilizan procedimientos tRPC persistentes. La arquitectura del módulo se encuentra en `server/duckStudio/` y el router actúa como adaptador de transporte.

## Cómo continuar

Para introducir una nueva capacidad del estudio, primero se define el contrato Zod en `server/duckStudio/validation.ts`, después se ubica la regla en un módulo de dominio o de acceso y finalmente se conecta el procedimiento en `server/duckStudioRouters.ts`. Todo flujo con datos privados debe validar la propiedad antes de consultar, mutar o generar un enlace de archivo.

## Validación requerida

Antes de publicar cambios se ejecutan `pnpm check`, `pnpm test` y `pnpm build`. Las pruebas de regresión de proyectos, stems, comentarios, autorización y navegación responsive se localizan en `server/duckStudio.test.ts`, `server/duckStudio/validation.test.ts` y `client/src/pages/duckWorkspaceContract.test.ts`.

## Trabajo futuro explícito

La carga multipart de stems, el portal externo con tokens revocables, pagos, notificaciones y una integración LLM real requieren diseño adicional, secretos, consentimiento y pruebas específicas. No se consideran parte de esta entrega.
