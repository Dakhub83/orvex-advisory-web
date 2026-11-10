import { z } from "zod";

export const COUNTERPARTY_TYPES = ["refinery", "institutionalBuyer", "miningInvestor", "other"] as const;
export const SERVICES = ["doreSourcing", "permitJv", "unsure"] as const;
export const VOLUME_TIERS = ["trial", "standard", "institutional"] as const;

/** A volume tier is required for metal purchases, and optional for the other services. */
const VOLUME_REQUIRED_FOR: readonly string[] = ["doreSourcing"];

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
  scope: z.enum(["", ...VOLUME_TIERS], "invalid").default(""),
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
  const fieldErrors: Partial<Record<InquiryField, FieldErrorCode>> = {};

  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0] as InquiryField;
      fieldErrors[field] ??= issue.message as FieldErrorCode;
    }
  }
  // Checked here rather than in the schema so it is reported alongside other errors.
  if (typeof raw.service === "string" && VOLUME_REQUIRED_FOR.includes(raw.service) && !raw.scope) {
    fieldErrors.scope ??= "required";
  }

  if (result.success && Object.keys(fieldErrors).length === 0) {
    return { ok: true as const, inquiry: result.data };
  }
  return { ok: false as const, fieldErrors };
}
