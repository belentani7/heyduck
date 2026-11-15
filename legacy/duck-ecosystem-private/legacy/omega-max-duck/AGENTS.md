# AGENTS.md — Duck Ω-MAX Studio OS (omega-max-duck)

Archivo único de instrucciones para todos los agentes que trabajen en este repositorio.
Fuente de la verdad: este archivo.

## 1. QUÉ ES ESTE PROYECTO

Duck Ω-MAX Studio OS es una plataforma full-stack exclusiva de Duck/Lucas para coordinar:
- Relación con clientes (CRM)
- Producción musical (operaciones, inventario, catálogo de plugins)
- Finanzas (facturas, solicitudes de pago con aprobación explícita)
- Automatización (reglas por evento, ejecuciones trazables, auditoría)

Stack: React 19 · TypeScript · Tailwind · Radix UI · Express · tRPC · Drizzle ORM · MySQL · S3/Drive · OAuth JWT

## 2. SUPERPOWERS INTEGRADAS (MCP Hub)

Este proyecto está integrado con el servidor MCP `belentani-hub` que expone 24 herramientas:

| Grupo | Herramientas |
|-------|-------------|
| Google | gcloud_projects, gcloud_billing_accounts, gcloud_enabled_apis, google_cloud_enable_api, google_oauth_setup, google_drive_list, google_drive_read, google_gmail_list, gmail_read, gmail_send, google_gemini_generate, google_colab_notebooks, google_colab_execute |
| GitHub | github_codespaces, github_repositories, github_issues, github_pull_requests |
| IA | openai_chat, google_gemini_generate, suno_generate |
| Social | linkedin_profile, linkedin_post, distrokid_artist, distrokid_release |

### Cómo usar las superpowers desde el servidor

Importar desde `server/_core/mcpClient.ts`:

```ts
import { mcpGeminiGenerate, mcpGmailSend, mcpSunoGenerate, mcpDriveList, mcpGithubIssues } from "./mcpClient";
```

### Archivos clave de superpowers

- `server/_core/mcpClient.ts` — Cliente JSON-RPC stdio hacia belentani-hub
- `server/_core/llm.ts` — LLM con Gemini (primario), OpenAI (fallback), Forge (legacy)
- `server/_core/googleDrive.ts` — Almacenamiento en Google Drive
- `server/_core/gmail.ts` — Envío de emails vía Gmail
- `server/_core/github.ts` — Issues y PRs en GitHub
- `server/_core/suno.ts` — Generación de música para Suno
- `server/_core/colab.ts` — Ejecución de celdas en Colab
- `server/_core/notification.ts` — Notificaciones dual-canal (Forge + Gmail)
- `server/domain/automationEngine.ts` — Motor de automatización con acciones MCP

## 3. VARIABLES DE ENTORNO (.env)

Copia `.env.example` a `.env` y rellena:

- `GOOGLE_APPLICATION_CREDENTIALS` — Ruta al JSON de cuenta de servicio de Google
- `GEMINI_API_KEY` — Clave de Gemini (AI Studio)
- `OPENAI_API_KEY` — Clave de ChatGPT (fallback)
- `GITHUB_TOKEN` — Token de GitHub (scopes: repo, workflow)
- `SUNO_API_KEY` — Clave de Suno (opcional)
- `LINKEDIN_ACCESS_TOKEN` — Token de LinkedIn (opcional)
- `DISTROKID_API_KEY` — Clave de DistroKid (opcional)

### Autorización Google OAuth (requerida para Drive/Gmail/Gemini)

Ejecuta en PowerShell:

```
gcloud auth login --scopes "https://www.googleapis.com/auth/drive.readonly https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/generativelanguage.retriever"
```

## 4. REGLAS DE AUTOMATIZACIÓN (invariantes)

1. **Ninguna automatización ejecuta cobros.** Como máximo crea `payment_requests` con estado `pending_approval`.
2. **Aprobación explícita requerida** para: `create_payment_request`, `create_invoice`, `send_payment`, `execute_charge`.
3. **Solo el dueño (role=owner)** puede aprobar solicitudes de pago pendientes.
4. **Las acciones de Superpowers (gmail, github, suno, colab, drive)** son no-destructivas y no ejecutan pagos.
5. **Toda acción de automatización queda registrada** en `automationRuns` y `communications`.

## 5. ESTRUCTURA DEL REPOSITORIO

```
server/_core/        — Utilidades centrales (env, llm, mcpClient, gmail, drive, github, suno, colab, notification)
server/domain/       — Lógica de negocio (automationEngine, guards)
server/routers/      — Routers tRPC (studio, public)
server/_core/systemRouter.ts — Endpoints de sistema (health, notifyOwner)
client/src/          — Frontend React 19 + Tailwind + Radix UI
drizzle/schema.ts    — Modelo de datos (clientes, proyectos, tareas, facturas, automatizaciones)
```

## 6. COMANDOS DE DESARROLLO

```bash
pnpm dev        # Servidor de desarrollo (Vite + tsx)
pnpm build      # Build de producción (Vite + esbuild)
pnpm check      # TypeScript (tsc --noEmit)
pnpm test       # Tests (vitest)
pnpm format     # Prettier
pnpm db:push    # Migraciones Drizzle
```

## 7. CÓDIGO Y SECRETOS

- Nunca commitees `.env`, `.pem`, `*.key`, `credentials*.json`.
- Las claves de API van en `.env` (no tracked) o en variables de entorno del despliegue.
- El archivo JSON de cuenta de servicio de Google (`gen-lang-client-...json`) vive en `C:\Users\USER\Downloads\` y se referencia por `GOOGLE_APPLICATION_CREDENTIALS`.

## 8. EVIDENCIA Y VERIFICACIÓN

Cada cambio debe ser verificable:
- `pnpm check` debe pasar (0 errores de TypeScript)
- `pnpm test` debe pasar (tests verdes)
- Las nuevas acciones de automatización deben registrar entrada en `automationRuns`

## 9. RECURSOS EXTERNOS

- MCP Hub: `C:\Users\USER\workspace\agent-mcp-hub\server.mjs` (registrado en Claude Desktop como `belentani-hub`)
- Google Cloud proyecto activo: `agentes-ia-497222`
- Cuenta Gmail: `belentani7pedro@gmail.com`
- GitHub: `github.com/belentani7` (scopes: codespace, delete_repo, gist, read:org, repo, user, workflow)
