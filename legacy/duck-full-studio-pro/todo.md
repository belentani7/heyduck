# Project TODO - Duck Ecosystem

- [x] Configurar esquema Drizzle con tablas para tracks, proyectos, clientes, auditoría y notas
- [x] Implementar routers tRPC para catálogo, gestión de producciones y chat IA local multilingüe
- [x] Configurar integración con S3 para subida de stems, portadas y audios
- [x] Desarrollar la landing inmersiva con GSAP y ScrollTrigger (transición morado oscuro a verde)
- [x] Integrar el selector multilingüe completo (PT, ES, EN, FR, IT) en toda la interfaz
- [x] Implementar reproductor de audio integrado y Smartwatch interactivo para los singles de Duck
- [x] Construir los instrumentos musicales interactivos al final de la página con Web Audio API
- [x] Desarrollar el chat IA flotante multilingüe con personalidad profesional y divertida, sin API externa, con conexión a WhatsApp y email
- [x] Construir el panel fullstack privado de gestión para Duck (catálogo, proyectos, subida de archivos, auditoría de versiones)
- [x] Añadir pruebas unitarias con Vitest y verificar compilación exitosa

# RE-AUDIT & REUSE REAL MATERIAL (USER REJECTION FIX)
- [x] Mapear y extraer imágenes de estudio, portadas y fotos del autor desde /home/ubuntu/duck_extracted/
- [x] Copiar activos multimedia a almacenamiento web y assets públicos reutilizables
- [x] Rediseñar completamente `Home.tsx` con dirección visual editorial, tipografía cinética y material real de Duck
- [x] Conectar reproductor de audio, Smartwatch y galería inmersiva con fotos y portadas reales
- [x] Validar la transición morado-verde con ScrollTrigger y diseño libre de placeholders

# VISUAL CORRECTION V2 (AFTER USER REJECTION)
- [x] Cambiar ThemeProvider a dark y corregir variables semánticas para eliminar paneles gris claro
- [x] Reforzar el verde eléctrico como señal de marca y reducir el efecto SaaS redondeado
- [x] Dar más peso editorial a portadas, fotos reales y catálogo sin apariencia de tabla
- [x] Rehacer Smartwatch y player para que el estado real de audio sea visible

# REMAINING VISUAL GAPS AFTER V2 REVIEW
- [x] Reducir de verdad el lenguaje SaaS: revisar radios, superficies y bordes en Home.tsx con menos tarjetas uniformes
- [x] Reestructurar la discografía con jerarquía editorial real: destacados, bloques visuales, portadas auténticas y menos repetición
- [x] Sincronizar smartwatch y reproductor con una fuente real, progreso, portada, título y controles Prev/Next coherentes

# SOURCE-AWARE PLAYER PASS
- [x] Conectar cada single/track a una referencia original verificable y sincronizar fuente local, título, portada, progreso y controles

# SHARED PREVIEW DISCLOSURE PASS
- [x] Dejar explícito que el reproductor usa un único preview local compartido cuando no existe audio local por track y separar ese preview de las referencias externas originales
- [x] Sincronizar el estado del player con el item seleccionado sin presentar el preview compartido como si fuera el master del track

# GITHUB FL STUDIO TOOLS INTEGRATION
- [x] Añadir los repositorios reales de GitHub (butterdawg, flskinner, organizadores, presets) a duckStudioRouters.ts
- [x] Mostrar enlaces oficiales directos en la interfaz de Vault Plugins
- [x] Verificar pruebas y TypeScript OK

# SUPREME AUDIT & GITHUB PRIVATE DEPLOYMENT
- [x] Crear la Matriz de Auditoría Suprema (ISO/IEC 25010 + OWASP ASVS + NASA) en SUPREME_AUDIT.md
- [x] Verificar que todo el código cumpla con los estándares 10/10 en backend, frontend, utilidad, relevancia, potencial e identidad
- [x] Crear un nuevo repositorio privado en GitHub con `gh repo create`
- [x] Sincronizar y publicar el código auditado en el nuevo repositorio privado

# HONEST AUDIT RESOLUTION
- [x] Realizar una auditoría real y trazable por módulo con evidencia archivo por archivo en SUPREME_AUDIT.md y REALITY_CHECK.md
- [x] Corregir cualquier afirmación exagerada de 10/10 en la documentación para reflejar el estado real verificado
- [x] Sincronizar el repositorio privado en GitHub con la versión auditada y honesta

# REAL IMPLEMENTATION PASS (SQL, S3, TIMESTAMP COMMENTS)
- [x] Actualizar `drizzle/schema.ts` con tablas `duck_projects`, `duck_stems`, `duck_comments` y `duck_audit_logs`
- [x] Aplicar migración SQL mediante `webdev_execute_sql`
- [x] Implementar helpers y routers tRPC persistentes en `server/duckStudioRouters.ts` conectados a la BD y S3 (`storagePut`, `storageGet`)
- [x] Conectar la interfaz de DuckFullStudioPro.tsx con mutaciones y queries tRPC reales para proyectos, subida de stems y comentarios por timestamp
- [x] Añadir pruebas unitarias y verificar TypeScript y Vitest
- [x] Ejecutar ALTER TABLE en MySQL y resolver ER_BAD_FIELD_ERROR para tracks y projects
- [x] Verificar pruebas unitarias Vitest exitosas (auth.logout.test.ts y duck.test.ts)
- [x] Sincronizar todos los cambios al repositorio privado de GitHub

# PETICIONES DEL ARCHIVO ADJUNTO — APLICACIÓN 2026-08-20
- [x] Auditar y documentar el material adjunto reutilizable sin duplicar ni inventar activos
- [x] Mejorar el portal de producción con flujo real de subida, consulta y descarga segura de stems mediante S3
- [x] Ampliar el portal de cliente con revisión de stems, comentarios por timestamp y estados de aprobación persistentes
- [x] Ampliar CoLab con respuestas locales verificables sobre catálogo, servicios y flujo de producción, manteniendo límites honestos
- [x] Conectar el catálogo de audio con previews reales disponibles y estados claros cuando no exista master local
- [x] Revisar y corregir la experiencia visual responsive del workspace y sus estados de carga, vacío y error
- [x] Validar autenticación, autorización, acceso a proyectos y exposición de URLs de archivos
- [x] Añadir pruebas específicas del flujo proyecto → stem → comentario → aprobación y verificar TypeScript/Vitest
- [x] Actualizar REALITY_CHECK.md y SUPREME_AUDIT.md con evidencias de las peticiones aplicadas
- [x] Guardar checkpoint final y sincronizar la versión actualizada con el repositorio privado de GitHub

# PETICIONES NO EJECUTABLES COMO PROMESA AUTOMÁTICA
- [x] Revisar y posponer integraciones externas de WhatsApp, email o pagos hasta contar con credenciales y consentimiento explícito
- [x] Evaluar y limitar la investigación online e importación adicional de activos a fuentes autorizadas y licencias verificables
- [x] Mantener fuera del producto clones o copias de plugins comerciales; incluir solo enlaces, metadatos y herramientas legales verificables

# HISTORIAL DE VALIDACIÓN
- [x] Archivo adjunto leído completamente como texto y convertido en alcance accionable
- [x] Se conservaron las afirmaciones honestas: no se trataron previews compartidos, chat local ni catálogo legal como masters, IA entrenada o plugins comerciales reales

# PENDIENTE DE IMPLEMENTACIÓN — DETALLE TÉCNICO
- [x] Sustituir fallbacks estáticos en duckStudioRouters.ts por consultas persistentes o estados vacíos honestos
- [x] Añadir flujo UI real para crear proyecto, seleccionar proyecto, subir stem y comentar en timestamp
- [x] Añadir flujo UI real de aprobación/rechazo de stems y persistirlo
- [x] Añadir prueba de contrato para los procedimientos duckStudio de proyectos, stems y comentarios
- [x] Verificar en navegador desktop y móvil la pantalla de workspace y sus estados
- [x] Comprobar git status, tests, build y sincronización del repositorio privado antes del checkpoint

> Nota: Las tareas de integración externa requieren credenciales del usuario y consentimiento para no prometer conexiones que todavía no existen.

# GAPS IDENTIFICADAS POR LA REVISIÓN FINAL
- [x] Añadir control de acceso por proyecto mediante propietario antes de exponer stems a terceros; el token de portal externo queda pospuesto
- [x] Asegurar que las URLs firmadas de stems solo se generen tras validar el acceso al proyecto
- [x] Añadir una prueba reproducible de los estados responsive del workspace y su navegación móvil
- [x] Ejecutar una verificación final con todos los tests, build y estado de GitHub antes del checkpoint

# PETICIONES ARQUITECTÓNICAS DEL ARCHIVO ADJUNTO — APLICACIÓN 2026-08-22
- [x] Crear un paquete de entrega portable con PROJECT-BRIEF.md, PLAN.md, DECISIONS.md y HANDOFF.md adaptado al estudio DUCK
- [x] Documentar arquitectura, modelo de dominio, mapa de datos y contrato tRPC con diagramas Mermaid y límites honestos
- [x] Separar el router monolítico de DUCK Studio en módulos de aplicación, dominio e infraestructura sin alterar los contratos tRPC
- [x] Extraer validaciones Zod y reglas de autorización de proyecto a módulos reutilizables y cubiertos por pruebas
- [x] Aplicar carga diferida de rutas no esenciales del portfolio para reducir la carga inicial del workspace
- [x] Añadir índices no destructivos para consultas frecuentes por propietario, proyecto y fecha en la base de datos
- [x] Añadir cobertura de pruebas para validaciones, aislamiento por propietario y contratos de servicios extraídos
- [x] Actualizar README, REALITY_CHECK y SUPREME_AUDIT con el alcance real de esta arquitectura y sus límites operativos
- [x] Verificar TypeScript, Vitest, build de producción, responsividad y estado del repositorio antes del checkpoint

# COBERTURA DIRECTA DE SERVICIOS EXTRAÍDOS
- [x] Añadir pruebas unitarias directas de catálogo, CoLab, acceso y adaptación segura de stems

# CIERRE DE SINCRONIZACIÓN ARQUITECTÓNICA
- [x] Guardar checkpoint, confirmar el commit y sincronizar la refactorización con el repositorio privado de GitHub

# PETICIONES EVALUADAS Y DELIBERADAMENTE FUERA DEL ALCANCE DEL ESTUDIO DUCK
- [x] No implementar módulos industriales, PLC/IoT, cadena de suministro, gemelo físico, modelos ML entrenados, microservicios, Kubernetes ni Docker: no corresponden al producto de gestión musical ni son compatibles con su despliegue administrado actual
- [x] No prometer SSR, 99.99% SLA, WCAG AAA, cobertura superior al 90%, LLM entrenado, pagos, WhatsApp, correo, RPA o agentes autónomos sin requisitos, datos, credenciales, presupuesto y validación específica
