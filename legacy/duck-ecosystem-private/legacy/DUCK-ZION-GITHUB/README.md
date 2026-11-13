# DUCK ZION Unified · GitHub Edition

Esta es la **variante alternativa preparada para GitHub** de DUCK ZION Unified. Mantiene Studio OS como núcleo, incorpora el catálogo de plugins compatibles con FL Studio y añade el modo de diálogo local para producción musical. Esta edición no contiene secretos, bases de datos locales, dependencias generadas ni binarios de plugins.

## Contenido

| Ruta | Propósito |
|---|---|
| `apps/studio-os` | Núcleo Next.js + Prisma + API + interfaz Duck. |
| `packages/ecosystem` | Módulo Ecosystem y contratos. |
| `packages/gema-toolkit` | Toolkit autónomo Gema. |
| `packages/experiencia-inmersiva` | Experiencia web visual. |
| `apps/studio-os/src/data/fl-studio-plugin-catalog.json` | Catálogo de metadatos de plugins, sin instaladores. |
| `apps/studio-os/src/app/api/local-assistant` | API de diálogo local loopback. |
| `docs` | Arquitectura, auditoría, privacidad y operación. |
| `research` | Inventario de 300 repositorios y fuentes FL Studio. |

## Arranque

```bash
cd apps/studio-os
npm install
npm run db:generate
npm run db:push
npm run build
npm run dev
```

Copia `.env.example` a `.env` y configura el servidor local del modelo únicamente en loopback:

```env
LOCAL_LLM_BASE_URL="http://127.0.0.1:8080/v1"
LOCAL_LLM_MODEL="Qwen2.5-0.5B-Instruct-GGUF"
```

El asistente no tiene fallback remoto en la ruta local. Si el servidor no está disponible, devuelve un error controlado. El modelo y sus pesos deben descargarse desde la fuente oficial, verificarse por hash y ejecutarse con permisos mínimos; no se incluyen binarios ni pesos en este repositorio.

## Plugins FL Studio

El catálogo es de **solo metadatos**. No instala DLL, VST3, CLAP o AU. Cada entrada está marcada como `pending` hasta revisar licencia, procedencia, hash, arquitectura, firma, carga en FL Studio, automatización, guardado de presets, latencia, estabilidad y consumo de CPU. FL Studio soporta distintos formatos según la plataforma; consulta `research/fl-studio-sources.md` antes de clasificar un plugin como compatible.

## Auditoría

Ejecuta la auditoría local con:

```bash
python3 tools/mass_audit.py
```

Los resultados se escriben en `research/mass-audit/`. No se ejecutan binarios, hooks, instaladores ni plugins durante la auditoría. Los archivos `.env`, bases de datos y artefactos generados están excluidos del control de versiones.

## Licencia y procedencia

Antes de añadir código externo, revisa su licencia y conserva la atribución correspondiente. Los repositorios incluidos en `research/` son referencias de investigación y no implican que su código se haya incorporado al núcleo.
