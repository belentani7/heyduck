/**
 * Motor de automatización mejorado con Superpowers MCP.
 * Nuevas acciones disponibles:
 *  - notify_owner_gmail: notifica al dueño vía Gmail (además de in-app)
 *  - notify_client_email: envía email al cliente vía Gmail
 *  - create_github_issue: crea issue en GitHub para errores de automatización
 *  - generate_suno_music: genera música para un proyecto de producción
 *  - drive_save_file: guarda archivo en Google Drive
 *  - colab_run_task: ejecuta tarea pesada en Colab
 *
 * Todas las nuevas acciones son no-destructivas y requieren aprobación
 * explícita para acciones financieras (mantenido el guard existente).
 */

import { and, eq, sql } from "drizzle-orm";
import { automationRuns, automations, clients, communications, paymentRequests, projects, replenishmentProposals, tasks } from "../../drizzle/schema";
import { getDb } from "../db";
import { ENV } from "../_core/env";
import { notifyOwner, notifyOwnerDualChannel } from "../_core/notification";
import { gmailSend } from "../_core/gmail";
import { createAutomationIssue } from "../_core/github";
import { sunoGenerateForProject } from "../_core/suno";
import { colabRunHeavyTask } from "../_core/colab";
import { driveList, driveFindClientFiles } from "../_core/googleDrive";
import { requiresPaymentApproval } from "./guards";

type EventPayload = {
  projectId?: number;
  productId?: number;
  productName?: string;
  clientEmail?: string;
  clientName?: string;
};

type ActionSpec = {
  type: string;
  payload?: Record<string, unknown>;
  requiresApproval?: boolean;
};

export async function runEventAutomations(trigger: string, payload: EventPayload, onlyAutomationId?: number) {
  const db = await getDb();
  if (!db) return;
  const criteria = [eq(automations.trigger, trigger), eq(automations.enabled, true)];
  if (onlyAutomationId) criteria.push(eq(automations.id, onlyAutomationId));
  const rules = await db.select().from(automations).where(and(...criteria));

  for (const rule of rules) {
    const action = rule.action as ActionSpec;
    let status: "success" | "failed" | "skipped" | "awaiting_approval" = "success";
    let detail = "";
    try {
      // --- Acciones existentes (mantener compatibilidad) ---
      if (action.type === "create_task" && payload.projectId) {
        await db.insert(tasks).values({ projectId: payload.projectId, title: String(action.payload?.title || `Automatización: ${rule.name}`), priority: "medium" });
        detail = "Tarea operativa creada.";
      } else if (action.type === "create_replenishment_proposal" && payload.productId) {
        const quantity = Math.max(1, Number(action.payload?.quantity || 1));
        await db.insert(replenishmentProposals).values({ productId: payload.productId, proposedQuantity: quantity, reason: `Propuesta creada por la regla «${rule.name}».`, status: "proposed", createdByAutomationId: rule.id });
        detail = "Propuesta de reposición creada; no se emitió ninguna orden de compra.";
      } else if (requiresPaymentApproval(action.type)) {
        const amount = Number(action.payload?.amount || 0);
        if (amount > 0) {
          await db.insert(paymentRequests).values({
            sourceAutomationId: rule.id,
            title: String(action.payload?.title || `Propuesta de cobro: ${rule.name}`),
            amount: String(amount.toFixed(2)),
            currency: String(action.payload?.currency || "EUR"),
            rationale: `Generada por automatización «${rule.name}». No se ejecutó ningún cobro.`,
            status: "pending_approval",
          });
          detail = "Solicitud financiera creada y bloqueada hasta aprobación explícita.";
        } else {
          detail = "Acción financiera detectada sin importe: ninguna solicitud ni cobro fue ejecutado.";
        }
        status = "awaiting_approval";
      } else if (action.type === "notify_owner") {
        const title = String(action.payload?.title || `Ω-MAX · ${rule.name}`);
        const body = String(action.payload?.body || `La regla «${rule.name}» se activó por ${trigger}.`);
        const channels = await notifyOwnerDualChannel({ title, content: body });
        await db.insert(communications).values({ projectId: payload.projectId, audience: "owner", channel: "in_app", title, body });
        detail = channels.forge || channels.gmail ? "Aviso enviado por al menos un canal (Forge/Gmail) y registrado." : "Aviso registrado; ningún canal de entrega disponible.";
      } else if (action.type === "notify_client") {
        if (!payload.projectId) {
          status = "skipped";
          detail = "No hay proyecto asociado para identificar al cliente destinatario.";
        } else {
          const [project] = await db.select({ clientId: projects.clientId }).from(projects).where(eq(projects.id, payload.projectId)).limit(1);
          const [client] = project ? await db.select({ portalUserId: clients.portalUserId }).from(clients).where(eq(clients.id, project.clientId)).limit(1) : [];
          const title = String(action.payload?.title || `Actualización de proyecto`);
          const body = String(action.payload?.body || `Hay una actualización disponible en tu proyecto dentro de Duck Ω-MAX.`);
          await db.insert(communications).values({ projectId: payload.projectId, recipientUserId: client?.portalUserId ?? null, audience: "client", channel: "in_app", title, body });
          // Nuevo: también enviar email al cliente si tiene email
          if (client?.portalUserId && payload.clientEmail) {
            await gmailSend(payload.clientEmail, title, body);
            detail += " Email enviado al cliente.";
          } else {
            detail = "Mensaje interno registrado para el portal del cliente.";
          }
        }
      // --- Nuevas acciones con Superpowers MCP ---
      } else if (action.type === "notify_owner_gmail") {
        const title = String(action.payload?.title || `Ω-MAX · ${rule.name}`);
        const body = String(action.payload?.body || `La regla «${rule.name}» se activó por ${trigger}.`);
        const ownerEmail = String(action.payload?.email || ENV.ownerOpenId || "");
        if (ownerEmail && ownerEmail.includes("@")) {
          const sent = await gmailSend(ownerEmail, title, body);
          if (sent.ok) {
            await db.insert(communications).values({ projectId: payload.projectId, audience: "owner", channel: "email", title, body });
            detail = "Aviso enviado al dueño vía Gmail.";
          } else {
            status = "failed";
            detail = `Gmail falló: ${sent.error}`;
          }
        } else {
          status = "skipped";
          detail = "No hay email configurado para el dueño (OWNER_OPEN_ID).";
        }
      } else if (action.type === "notify_client_email") {
        if (!payload.clientEmail) {
          status = "skipped";
          detail = "No hay email de cliente en el payload.";
        } else {
          const title = String(action.payload?.title || `Actualización de proyecto`);
          const body = String(action.payload?.body || `Hay una actualización en tu proyecto.`);
          const sent = await gmailSend(payload.clientEmail, title, body);
          if (sent.ok) {
            await db.insert(communications).values({ projectId: payload.projectId, audience: "client", channel: "email", title, body });
            detail = "Email enviado al cliente.";
          } else {
            status = "failed";
            detail = `Gmail falló: ${sent.error}`;
          }
        }
      } else if (action.type === "create_github_issue") {
        const title = String(action.payload?.title || `Automatización fallida: ${rule.name}`);
        const body = String(action.payload?.body || `La regla «${rule.name}» se activó por ${trigger} y encontró un error.\n\nPayload: ${JSON.stringify(payload, null, 2)}`);
        const issue = await createAutomationIssue(title, body);
        if (issue.ok) {
          await db.insert(communications).values({ projectId: payload.projectId, audience: "owner", channel: "github", title, body });
          detail = `Issue de GitHub creado#${issue.issueNumber ?? "desconocido"}.`;
        } else {
          status = "failed";
          detail = `GitHub issue falló: ${issue.error}`;
        }
      } else if (action.type === "generate_suno_music") {
        const projectName = String(action.payload?.projectName || payload.productName || "Proyecto Ω-MAX");
        const genre = String(action.payload?.genre || "pop");
        const mood = String(action.payload?.mood || "energético");
        const song = await sunoGenerateForProject(projectName, genre, mood);
        if (song.ok) {
          await db.insert(communications).values({ projectId: payload.projectId, audience: "owner", channel: "suno", title: `Música generada: ${song.title}`, body: song.style_prompt.substring(0, 500) });
          detail = `Música generada para Suno: estilo "${song.style}", emoción "${song.emotion}".`;
        } else {
          status = "failed";
          detail = `Suno falló: ${song.error}`;
        }
      } else if (action.type === "drive_list_client_files") {
        if (!payload.clientName) {
          status = "skipped";
          detail = "No hay nombre de cliente para buscar archivos en Drive.";
        } else {
          const files = await driveFindClientFiles(String(payload.clientName));
          detail = `Se encontraron ${files.length} archivos en Drive para el cliente.`;
        }
      } else if (action.type === "colab_run_heavy_task") {
        const taskType = String(action.payload?.taskType || "data-analysis");
        const notebookId = String(action.payload?.notebookId || "");
        if (!notebookId) {
          status = "skipped";
          detail = "No hay notebookId de Colab configurado.";
        } else {
          const result = await colabRunHeavyTask(notebookId, taskType as any, payload);
          if (result.ok) {
            detail = `Tarea de Colab ejecutada: ${result.message}`;
          } else {
            status = "failed";
            detail = `Colab falló: ${result.message}`;
          }
        }
      } else {
        status = "skipped";
        detail = "La regla no tiene datos suficientes para ejecutar una acción segura.";
      }
    } catch (error) {
      status = "failed";
      detail = error instanceof Error ? error.message.slice(0, 1000) : "Error no identificado durante la automatización.";
    }

    await db.insert(automationRuns).values({ automationId: rule.id, status, detail, payload });
    await db.update(automations).set({ runs: sql`${automations.runs} + 1`, lastRunAt: new Date() }).where(eq(automations.id, rule.id));
  }
}
