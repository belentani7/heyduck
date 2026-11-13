import { notifyOwner, type NotificationPayload } from "./_core/notification";

export type OwnerAlertKind =
  | "lead_created"
  | "brief_submitted"
  | "feedback_received"
  | "milestone_approved"
  | "privacy_requested";

const ownerAlertCopy: Record<OwnerAlertKind, NotificationPayload> = {
  lead_created: {
    title: "Novo interesse no Duck Studio",
    content: "Há um novo contato para revisão no CRM. Nenhum dado pessoal é exibido nesta notificação.",
  },
  brief_submitted: {
    title: "Novo briefing recebido",
    content: "Um cliente enviou um briefing. Revise o escopo no portal antes de tomar qualquer ação externa.",
  },
  feedback_received: {
    title: "Novo feedback de projeto",
    content: "Há um novo comentário de cliente no portal. A resposta permanece sob decisão do operador.",
  },
  milestone_approved: {
    title: "Etapa aprovada pelo cliente",
    content: "Uma etapa foi aprovada no portal. Verifique o projeto antes de liberar entregas ou iniciar novos trabalhos.",
  },
  privacy_requested: {
    title: "Nova solicitação de privacidade",
    content: "Há uma solicitação de titular para revisão. Confirme a identidade antes de acessar, alterar ou excluir dados.",
  },
};

export function buildOwnerAlert(kind: OwnerAlertKind): NotificationPayload {
  return ownerAlertCopy[kind];
}

export async function notifyOwnerOf(kind: OwnerAlertKind): Promise<boolean> {
  try {
    return await notifyOwner(buildOwnerAlert(kind));
  } catch (error) {
    console.warn("[OwnerAlert] Falha ao enviar alerta ao proprietário:", error);
    return false;
  }
}
