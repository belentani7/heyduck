# Registro de Decisiones Técnicas

| Fecha | Decisión | Justificación | Alternativa descartada |
|---|---|---|---|
| 2026-08-22 | Mantener React, tRPC, Drizzle y MySQL existentes | Permite mejorar el producto sin reescribir una base funcional ni cambiar el modelo de despliegue. | Migrar a Next.js, NestJS o microservicios sin necesidad probada. |
| 2026-08-22 | Separar DUCK Studio por módulos de dominio, acceso, validación, almacenamiento, catálogo y CoLab | Reduce el acoplamiento del router y permite pruebas unitarias focalizadas. | Mantener la lógica completa en un único router. |
| 2026-08-22 | Usar índices compuestos por propietario/proyecto y fecha | Coinciden con los patrones reales de lectura del workspace y mejoran listas y trazabilidad. | Indexar columnas sin evidencia de consulta frecuente. |
| 2026-08-22 | Carga diferida solo para rutas secundarias | Reduce el coste inicial sin degradar la entrada principal del workspace. | Diferir la ruta raíz y mostrar una pantalla de espera adicional. |
| 2026-08-22 | No incorporar Docker ni Kubernetes | El entorno administrado provee build, runtime y publicación; añadir contenedores no mejora este despliegue y aumentaría superficie operativa. | Entregar infraestructura ficticia no ejecutada. |
| 2026-08-22 | No convertir CoLab local en LLM sin una integración aprobada | Evita prometer aprendizaje, memoria o respuestas generativas no presentes. | Ocultar un asistente de reglas detrás de afirmaciones de IA entrenada. |
