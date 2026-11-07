import { z } from "zod";

export const COUNTERPARTY_TYPES = ["refinery", "institutionalBuyer", "miningInvestor", "other"] as const;
export const SERVICES = ["doreSourcing", "permitJv", "unsure"] as const;

const optionalText = (max: number) => z.string("required").trim().max(max, "tooLong");
const requiredText = (max: number) => optionalText(max).min(1, "required");

/** Issue messages are error codes; the form translates them under `form.errors`. */
export const inquirySchema = z.object({
  fullName: requiredText(120),
  organization: requiredText(160),
  role: optionalText(120),
  email: requiredText(254).pipe(z.email("email")),
  phone: optionalText(40),
  country: requiredText(80),
  counterpartyType: z.enum(COUNTERPARTY_TYPES, "invalid"),
  service: z.enum(SERVICES, "invalid"),
  scope: optionalText(200),
  message: requiredText(5000),
  consent: z.literal("on", "consent"),
});

export type Inquiry = z.infer<typeof inquirySchema>;
export type InquiryField = keyof Inquiry;
export type FieldErrorCode = "required" | "email" | "tooLong" | "invalid" | "consent";

export type InquiryState =
  | { status: "idle" }
  | { status: "success" }
  | {
      status: "error";
      code: "validation" | "rateLimited" | "delivery";
      fieldErrors: Partial<Record<InquiryField, FieldErrorCode>>;
      /** Echoed back so a failed submission does not lose what was typed. */
      values: Record<string, string>;
    };

/** Parses raw form values, reporting the first problem found on each field. */
export function parseInquiry(raw: Record<string, unknown>) {
  const result = inquirySchema.safeParse(raw);
  if (result.success) return { ok: true as const, inquiry: result.data };

  const fieldErrors: Partial<Record<InquiryField, FieldErrorCode>> = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0] as InquiryField;
    fieldErrors[field] ??= issue.message as FieldErrorCode;
  }
  return { ok: false as const, fieldErrors };
}
