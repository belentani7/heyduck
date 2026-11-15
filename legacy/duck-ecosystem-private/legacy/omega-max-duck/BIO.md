# Duck Ω-MAX Studio OS — BIO Profesional (Nivel Senior)

## Plataforma de Producción Musical y Operaciones con Superpowers MCP

Duck Ω-MAX Studio OS es una plataforma full-stack de nivel enterprise diseñada para
coordinar producción musical, CRM de clientes, operaciones de estudio, finanzas y
automatización. Construida con TypeScript, React 19, Express, tRPC y Drizzle ORM,
integra las **Superpowers MCP** de belentani-hub para capacidades de IA, almacenamiento,
comunicación y despliegue al máximo nivel.

## Capacidades Principales

### Inteligencia Artificial (Superpowers)
- **Gemini 2.0 Flash/Pro** como LLM primario vía MCP
- **GPT-4o** como fallback vía OpenAI/MCP
- **Generación de imágenes** (GPT Image 2 vía Forge)
- **Transcripción de voz** (Whisper vía Forge)
- **Generación de música** con Suno (letras + style_prompt)

### Almacenamiento y Comunicación
- **Google Drive** para archivos de clientes y entregables (vía MCP)
- **Gmail** para notificaciones, facturas y comunicación cliente (vía MCP)
- **Forge/Manus** como sistema legacy de notificaciones y storage

### DevOps y Despliegue
- **GitHub Issues** para tracking de errores de automatización (vía MCP)
- **GitHub PRs** para cambios de esquema y migraciones
- **Google Colab** para tareas de compute pesado (ML, video, audio)
- **Google Cloud** para proyectos y facturación (agentes-ia-497222)

### Módulos de Negocio
| Módulo | Función |
|--------|---------|
| CRM | Clientes, contactos, oportunidades, presupuestos, tareas |
| Portal | Proyectos, archivos, versiones, comentarios, entregables |
| Producción | Tracks, versiones, QC, cadenas de procesamiento, plugins |
| Finanzas | Facturas, solicitudes de pago, aprobación explícita |
| Inventario | Productos, validación PVC-U, stock, reposición |
| Automatización | Reglas por evento, ejecuciones trazables, auditoría |

## Regla de Oro

**Ninguna automatización ejecuta cobros.** Toda solicitud de pago requiere aprobación
explícita del dueño desde el módulo de Finanzas. Esto es innegociable.

## Stack Técnico

`TypeScript` `React 19` `Express` `tRPC` `Drizzle ORM` `MySQL` `Tailwind` `Radix UI`
`MCP Hub (24 tools)` `Gemini` `OpenAI` `Suno` `Google Drive` `Gmail` `GitHub` `Colab`

## Contacto

Duck/Lucas — Equipo de Producción  
Plataforma: Duck Ω-MAX Studio OS  
Ecosistema: Belentani
