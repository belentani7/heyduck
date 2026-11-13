import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn(),
}));

import { notifyOwner } from "./_core/notification";
import { buildOwnerAlert, notifyOwnerOf, type OwnerAlertKind } from "./ownerAlerts";

const alertKinds: OwnerAlertKind[] = [
  "lead_created",
  "brief_submitted",
  "feedback_received",
  "milestone_approved",
  "privacy_requested",
];

afterEach(() => {
  vi.clearAllMocks();
});

describe("alertas ao proprietário", () => {
  it("produz uma mensagem não vazia para cada evento supervisionado", () => {
    for (const kind of alertKinds) {
      const alert = buildOwnerAlert(kind);

      expect(alert.title.length).toBeGreaterThan(0);
      expect(alert.content.length).toBeGreaterThan(0);
    }
  });

  it("não inclui e-mail ou conteúdo privado de clientes nos alertas", () => {
    for (const kind of alertKinds) {
      const alert = buildOwnerAlert(kind);
      const text = `${alert.title} ${alert.content}`;

      expect(text).not.toMatch(/\S+@\S+/);
      expect(text).toMatch(/operador|proprietário|CRM|portal|identidade/i);
    }
  });

  it("não interrompe o fluxo quando o canal de notificação falha", async () => {
    vi.mocked(notifyOwner).mockRejectedValueOnce(new Error("Serviço indisponível"));

    await expect(notifyOwnerOf("feedback_received")).resolves.toBe(false);
  });
});
