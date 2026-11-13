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
