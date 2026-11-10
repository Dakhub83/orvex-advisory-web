import { INQUIRIES_EMAIL } from "@/lib/site";
import type { Inquiry } from "./schema";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

const VOLUME_LABELS: Record<Inquiry["scope"], string> = {
  "": "",
  trial: "5 kg – 10 kg (Trial Allocation)",
  standard: "10 kg – 50 kg (Standard Commercial Mandate)",
  institutional: "50 kg+ (Institutional Off-Take Agreement)",
};

function formatBody(inquiry: Inquiry, locale: string) {
  return [
    ["Name", inquiry.fullName],
    ["Organization", inquiry.organization],
    ["Role", inquiry.role],
    ["Email", inquiry.email],
    ["Phone", inquiry.phone],
    ["Country", inquiry.country],
    ["Counterparty type", inquiry.counterpartyType],
    ["Service", inquiry.service],
    ["Indicative volume", VOLUME_LABELS[inquiry.scope]],
    ["Language", locale],
    ["Message", `\n${inquiry.message}`],
  ]
    .map(([label, value]) => `${label}: ${value || "-"}`)
    .join("\n");
}

/**
 * Emails an inquiry to the firm, and throws if it could not be delivered, so
 * that a visitor is never told an inquiry was received when it was not.
 *
 * Without RESEND_API_KEY, development logs the inquiry and production fails.
 */
export async function deliverInquiry(inquiry: Inquiry, locale: string): Promise<void> {
  const text = formatBody(inquiry, locale);
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("RESEND_API_KEY is not set");
    }
    console.info(`[inquiry] RESEND_API_KEY is not set, so this was logged and not sent:\n${text}`);
    return;
  }

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.INQUIRY_FROM ?? "Orvex Website <website@orvexco.com>",
      to: [process.env.INQUIRY_TO ?? INQUIRIES_EMAIL],
      reply_to: inquiry.email,
      subject: `New inquiry: ${inquiry.organization} (${inquiry.counterpartyType})`.replace(/\s+/g, " "),
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Resend responded with ${response.status}`);
  }
}
