export function isValidPvcUSphere(sphere: number, stock: number, minStock: number) {
  return Number.isInteger(sphere) && sphere >= 1 && sphere <= 7 && Number.isInteger(stock) && stock >= 0 && Number.isInteger(minStock) && minStock >= 0;
}

export function requiresPaymentApproval(actionType: string) {
  return actionType === "create_payment_request" || actionType === "create_invoice" || actionType === "send_payment" || actionType === "execute_charge";
}

export function isInternalRole(role: "owner" | "collaborator" | "client") {
  return role === "owner" || role === "collaborator";
}

export function canResolvePaymentRequest(role: "owner" | "collaborator" | "client", status: string) {
  return role === "owner" && status === "pending_approval";
}

export function canAccessClientProject(role: "owner" | "collaborator" | "client", projectClientId: number, viewerClientId: number | null) {
  return role !== "client" || (viewerClientId !== null && projectClientId === viewerClientId);
}

/**
 * Acciones de Superpowers que requieren aprobación explícita del dueño.
 * Ninguna acción de comunicación o generación ejecuta pagos.
 */
export const SUPERPOWERS_ACTIONS = {
  NOTIFY_OWNER_GMAIL: "notify_owner_gmail",
  NOTIFY_CLIENT_EMAIL: "notify_client_email",
  CREATE_GITHUB_ISSUE: "create_github_issue",
  GENERATE_SUNO_MUSIC: "generate_suno_music",
  DRIVE_LIST_CLIENT_FILES: "drive_list_client_files",
  COLAB_RUN_HEAVY_TASK: "colab_run_heavy_task",
} as const;

export type SuperpowersAction = typeof SUPERPOWERS_ACTIONS[keyof typeof SUPERPOWERS_ACTIONS];
