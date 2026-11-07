"use server";

import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { deliverInquiry } from "@/lib/inquiry/deliver";
import { isRateLimited } from "@/lib/inquiry/rate-limit";
import { inquirySchema, parseInquiry, type InquiryState } from "@/lib/inquiry/schema";

export async function submitInquiry(_previous: InquiryState, formData: FormData): Promise<InquiryState> {
  // Report success to bots that filled the honeypot, so they do not adapt.
  if (formData.get("website")) return { status: "success" };

  const values: Record<string, string> = {};
  for (const field of Object.keys(inquirySchema.shape)) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }

  const parsed = parseInquiry(values);
  if (!parsed.ok) {
    return { status: "error", code: "validation", fieldErrors: parsed.fieldErrors, values };
  }

  const requestHeaders = await headers();
  const clientIp = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (isRateLimited(clientIp)) {
    return { status: "error", code: "rateLimited", fieldErrors: {}, values };
  }

  const locale = formData.get("locale");
  try {
    await deliverInquiry(parsed.inquiry, hasLocale(routing.locales, locale) ? locale : routing.defaultLocale);
  } catch (error) {
    console.error("[inquiry] delivery failed:", error);
    return { status: "error", code: "delivery", fieldErrors: {}, values };
  }

  return { status: "success" };
}
