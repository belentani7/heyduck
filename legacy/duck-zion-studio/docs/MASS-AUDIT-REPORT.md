# Informe de auditoría masiva local

## Alcance

La auditoría cubrió el repositorio `DUCK-ZION-UNIFIED` sin ejecutar binarios, plugins, hooks Git, instaladores ni scripts de terceros. Se excluyeron artefactos generados (`node_modules`, `.next`, `.git` y `release`) para evitar ruido y para mantener el análisis reproducible.

| Indicador | Resultado |
|---|---:|
| Archivos auditados | 342 |
| Bytes auditados | 15.663.779 |
| Binarios o bases de datos | 1 |
| Archivos comprimidos | 0 |
| Ejecutables marcados | 1 |
| Manifests de dependencias | 5 |
| Señales de secretos | 14 |
| Plugins en catálogo FL Studio | 20 |

## Interpretación de señales

Las 14 señales no equivalen automáticamente a credenciales comprometidas. El detector encontró nombres de variables, referencias de configuración, textos de documentación y posibles placeholders. Deben revisarse antes de publicar. El archivo `.env` local no se incluye en el paquete ni en el commit; la auditoría registra solo rutas y hashes de líneas señaladas, nunca valores completos.

La única base de datos detectada es `apps/studio-os/db/custom.db`. El único ejecutable marcado procede de permisos de archivo y no fue lanzado. No se detectaron archivos FLP, FST, DLL, VST, VST3, CLAP, AAX, AU, SF2 ni SFZ dentro del paquete unificado; por ello, el catálogo añadido es de metadatos y no una colección de binarios instalables.

## FL Studio

El catálogo contiene 20 candidatos abiertos o descubiertos mediante OpenAudio. Cada entrada declara formato, plataforma, fuente, categoría y estado `pending`. La compatibilidad se divide en cuatro comprobaciones independientes: formato soportado por FL Studio, arquitectura y plataforma, licencia/procedencia, y estabilidad dentro de un proyecto real. Solo tras superar las cuatro se debe cambiar a `verified`.

En Windows se priorizan VST3 y CLAP; en macOS se contempla además AU. Los plugins VST2 antiguos no se descartan automáticamente, pero requieren una revisión específica de arquitectura y bridging. El catálogo no instala nada ni trata un repositorio de código como instalador confiable.

## Asistente local

Se añadió un cliente de diálogo local para modelos GGUF servidos por un endpoint OpenAI-compatible en loopback. El valor recomendado es Qwen2.5-0.5B-Instruct-GGUF, con conocimiento musical local curado, temperatura 0,2, historial máximo de 12 mensajes y salida máxima de 500 tokens. La ruta registra cada ejecución en `AuditLog` con modo, modelo, conocimiento y tamaño de mensaje, sin guardar el texto completo en el registro técnico.

Si el servidor local no está disponible, la ruta devuelve `503` y no intenta conectarse a Internet. La interfaz arranca en modo local y permite alternar al asistente existente solo de forma explícita.

## Verificación

`npm run build` pasa después de incorporar el catálogo, la ruta `/api/plugins/catalog`, la ruta `/api/local-assistant/chat`, el cliente local, la base de conocimiento y el selector de modo en el widget. La disponibilidad real de inferencia no se pudo probar en este entorno porque no hay `llama-server`, `llama-cli`, Ollama ni LM Studio instalados; por eso el modelo se deja como configuración y no como binario incluido.

## Siguiente control recomendado

Antes de aceptar plugins, generar hash del artefacto descargado, revisar firma y licencia, abrirlo en un perfil de FL Studio aislado, comprobar carga/guardado de presets, automatización, latencia, estabilidad y consumo de CPU, y registrar el resultado en el ledger. Antes de usar el modelo local, verificar el hash del GGUF y ejecutar el servidor con permisos de usuario sin acceso innecesario al sistema de archivos.
