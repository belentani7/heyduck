# Auditoría Duck Produção Musical

## Recopilación
- [ ] Revisar todos los archivos disponibles en Google Drive.
- [ ] Integrar y contrastar la guía técnica adjunta.
- [ ] Inventariar el proyecto, dependencias y assets actuales.

## Auditoría 10 dimensiones
- [ ] Frontend y UX.
- [ ] Backend y límites del proyecto estático.
- [ ] Validación de datos y formularios.
- [ ] Plugins y dependencias actuales.
- [ ] Assets visuales y rendimiento.
- [ ] Persistencia y estrategia de datos.
- [ ] Seguridad e identidad.
- [ ] CI/CD y control de versiones.
- [ ] Observabilidad y rendimiento.
- [ ] Accesibilidad, SEO y cumplimiento.

## Correcciones y validación
- [ ] Implementar mejoras frontend permitidas por el alcance estático.
- [ ] Documentar backend recomendado sin inventar capacidades no presentes.
- [ ] Ejecutar type-check, build y revisión visual.
- [ ] Revisar licencias y actualidad de plugins/assets.
- [ ] Crear repositorio privado en GitHub solo si las validaciones pasan.
- [ ] Entregar auditoría final con evidencias, puntuación y pendientes reales.

> No declarar una dimensión 10/10 sin evidencia verificable.
> No tocar la carpeta `server/` del proyecto frontend-only.
> No borrar datos de Drive ni crear información ficticia.

## Estado
- Fase actual: recopilación y definición de criterios.
- Última revisión: 2026-08-18.
- Autor: Manus AI.

## Fuentes a consultar
- Google Drive del usuario mediante gws.
- Documentación oficial de React, Vite, Tailwind y dependencias del proyecto.
- Documentación oficial WCAG, web.dev y OWASP.
- NPM registry/GitHub para versiones y mantenimiento.
- Bancos de assets con licencias verificables, solo si hacen falta.

## Riesgos
- El proyecto actual es web-static y no tiene backend real; no debe presentarse como full-stack.
- La guía adjunta contiene recomendaciones, no evidencia de implementación.
- Las puntuaciones finales deben reflejar el estado validado, no una aspiración.
- No publicar hasta superar build, type-check, revisión visual y revisión de secretos.

## Definition of Done
- [ ] Todas las dimensiones tienen evidencia, puntuación y limitaciones.
- [ ] La interfaz está funcional y responsive.
- [ ] Los assets no se almacenan localmente en el proyecto.
- [ ] Las dependencias tienen estado documentado.
- [ ] GitHub contiene el código correcto y es privado.
- [ ] El informe final se adjunta al repositorio y se entrega al usuario.

## Revisión de alcance
- [ ] Si se requiere backend real, pedir confirmación antes de cambiar de `web-static` a `web-db-user`.
- [ ] Si hay una tienda o pagos, confirmar arquitectura antes de activar integraciones.
- [ ] Si el usuario pide publicar/desplegar, crear checkpoint y pedir que use Publish en la UI; no publicar automáticamente.

## Checklist de seguridad
- [ ] No hay secretos en el repositorio.
- [ ] No se ejecutan scripts descargados de fuentes no confiables.
- [ ] No se borran archivos de Drive de forma permanente.
- [ ] Se usan fuentes oficiales para validar afirmaciones técnicas.
- [ ] Se mantiene la trazabilidad de cambios.

## Checklist de GitHub
- [ ] Verificar organización/owner y nombre del repositorio.
- [ ] Usar repositorio privado por defecto.
- [ ] Añadir README, LICENSE y auditoría final.
- [ ] Evitar incluir `.env`, credenciales, builds y logs.
- [ ] Ejecutar `git status` y revisar diff antes de push.
- [ ] Confirmar URL final del repositorio al usuario.

## Criterio para 10/10
- [ ] La dimensión solo puede recibir 10/10 cuando existe evidencia automática o documental suficiente.
- [ ] Si una dimensión no aplica, marcar N/A y explicar por qué; nunca inflar la nota.
- [ ] Separar estado implementado, estado recomendado y estado no verificable.
- [ ] Incluir fecha de corte de versiones y enlaces a documentación oficial.

## Actualización final
- [ ] Reescribir el informe final completo, no entregar el borrador.
- [ ] Asegurar que el informe contiene References y enlaces.
- [ ] Adjuntar informes y archivos relevantes en el mensaje final.
- [ ] Adjuntar checkpoint manus-webdev://... si se crea uno.
- [ ] Confirmar que no se ha publicado en Manus automáticamente.

## Decisiones explícitas
- [ ] Mantener el estilo Dark Cinematic elegido para la web.
- [ ] No usar contenido inventado de clientes, reseñas o testimonios.
- [ ] No usar los términos prohibidos indicados en las preferencias del proyecto.
- [ ] Mantener una experiencia profesional en español o portugués coherente con la marca.

## Validación del usuario
- [ ] Pedir confirmación si el material de Drive contiene requisitos contradictorios.
- [ ] Pedir confirmación si el repo debe estar en una organización concreta.
- [ ] Pedir confirmación si el término "publicarlo" significa GitHub o también hosting.

## Próximo paso
- [ ] Ejecutar `gws --help` y listar archivos de Drive.
- [ ] Inspeccionar estado del proyecto y preparar inventario.
- [ ] Buscar fuentes actuales y guardar hallazgos.
- [ ] Corregir por lotes.
- [ ] Validar y publicar el repo privado.

## Bloqueos
- [ ] Resolver acceso a Drive si no hay archivos visibles.
- [ ] Resolver incompatibilidades de dependencias solo con cambios justificables.
- [ ] No añadir backend real sin upgrade/confirmación del usuario.

## Nota de auditoría
Esta lista es un registro operativo; la auditoría final debe reescribirse como documento legible y con evidencia.

## Iteración autónoma 2026-08-20
- [ ] Ejecutar audit, type-check y build después de los cambios de accesibilidad.
- [ ] Revisar visualmente desktop y mobile y confirmar que no hay regresiones.
- [ ] Sincronizar el commit de mejoras con el repositorio privado de GitHub.
- [ ] Actualizar el checkpoint del proyecto después de validar la iteración.

## Archivado solicitado por el usuario
- [ ] Inventariar todos los archivos generados y excluir secretos, dependencias y builds temporales.
- [ ] Preparar una copia del historial y de las versiones exportables del proyecto.
- [ ] Crear una transcripción del chat visible y un manifiesto de limitaciones.
- [ ] Crear un repositorio nuevo y privado de GitHub para el archivo.
- [ ] Subir el paquete archivístico a Google Drive sin eliminar ni modificar datos existentes.
- [ ] Verificar hashes, enlaces y completitud de ambas copias.
