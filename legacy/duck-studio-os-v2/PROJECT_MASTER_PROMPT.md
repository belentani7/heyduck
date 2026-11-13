# PROJECT_MASTER_PROMPT — DUCK STUDIO OS — sistema profesional de producción musical

**Canon estratégico individual · 22/10/2026 · belentani7/duck-studio-os-v2**

## 1. Contexto comprobado / límites de evidencia

Repositorio que reúne paquete fuente en source/, evidencia de capturas en evidence/, docs y manual PDF. README apunta a dashboard operativo, canal de cliente, herramientas de audio y flujo de revisión. No afirmar que toda integración sea funcional por el mero hecho de existir una pantalla o manual.

## 2. Máximo potencial: dirección de producto

Transformar Duck Studio OS en **estudio de producción musical integrado y comercializable**: cartera de artistas, proyectos, briefs, sesiones, referencias, entregables, revisiones con timestamps, contratos/estado de derechos y comunicación de clientes, con experiencia premium y atención real al workflow musical.

## 3. UX y funciones máximas deseadas

Inicio con tablero de sesiones y proyectos activos, ficha de canción (bpm, tono, versión, stems, master), mensajes del cliente, hitos y entregas con revisión A/B y notas por timecode. Permitir cargar audio con consentimiento y visualizar formas de onda reales; herramientas de conversión y análisis honestas, sin reetiquetar demos. Cliente solo ve sus entregas.

## 4. Arquitectura evolutiva

Conservar fuente en source/ y componentes studio-shell, client-portal, tools y project-detail. Separar dominio artista/proyecto/track/revisión/asset/derecho/cliente; acceso por propietario y cliente; subida/resume segura de ficheros grandes y URLs firmadas solo si backend configurado. Cuentas, storage y facturación no se fingen: desplegar por etapas en infraestructura y cuota comprobadas.

## 5. Roadmap ejecutable

1. Inspeccionar package.json y arrancar desde source/ correctamente, aclarando ubicación respecto a README. 2. Completar un ciclo proyecto→entrega→feedback→nueva versión, aunque inicialmente local. 3. Añadir validación de medios reales y errores. 4. Roles y almacenamiento protegido antes de portal multiusuario. 5. Verificar tests, exportables y coste real de storage/transcoding.

## 6. Lo que no debe hacerse

No mostrar artistas, cifras de streaming, derechos ni valoraciones inventadas. No subir stems privados ni emitir links públicos sin autorización. No confundir capturas de manual con pruebas de producción.

## Ejecución para agentes
Lee este canon junto con README, código, cambios recientes y pruebas. Distingue implementado, parcial y propuesto; jamás conviertas deseos en hechos. No crees otro repositorio ni mezcles productos por analogía. Trabaja por incrementos **end-to-end**: contexto → contrato → interfaz → lógica → datos, si hacen falta → estados de error → pruebas → entrega validada. Respeta secretos, permiso, usuario, derechos y arquitectura existente. Prioriza el mayor valor verificable, no un informe o rediseño vacío. Un agente nunca tiene permiso implícito para divulgar datos, desplegar, gastar o ejecutar acciones irreversibles.

**Prompt operativo:** «Trabaja como equipo senior de estrategia, producto, diseño, ingeniería, seguridad y QA exclusivamente de ESTE proyecto. Recupera el contexto de sus archivos y haz crecer su visión hasta su máximo potencial **mediante cambios reales comprobados**. Elige y completa la siguiente entrega de mayor impacto sin falsificar funciones o registros. Conserva el concepto canónico, preserva la historia y deja pruebas, criterios de aceptación y límites explícitos».
