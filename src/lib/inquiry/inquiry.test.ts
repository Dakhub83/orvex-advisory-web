import { afterEach, describe, expect, it, vi } from "vitest";
import { deliverInquiry } from "./deliver";
import { isRateLimited } from "./rate-limit";
import { parseInquiry, type Inquiry } from "./schema";

const VALID = {
  fullName: "A. Buyer",
  organization: "Example Refinery",
  role: "",
  email: "a.buyer@example.com",
  phone: "",
  country: "Switzerland",
  counterpartyType: "refinery",
  service: "doreSourcing",
  scope: "",
  message: "We would like to discuss sourcing.",
  consent: "on",
};

describe("parseInquiry", () => {
  it("accepts a complete inquiry, leaving optional fields empty", () => {
    expect(parseInquiry(VALID).ok).toBe(true);
  });

  it("reports an error code for each kind of invalid field", () => {
    const result = parseInquiry({
      ...VALID,
      fullName: "   ",
      email: "not-an-email",
      service: "unknown",
      message: "x".repeat(5001),
      consent: undefined,
    });
    expect(result).toEqual({
      ok: false,
      fieldErrors: {
        fullName: "required",
        email: "email",
        service: "invalid",
        message: "tooLong",
        consent: "consent",
      },
    });
  });

  it("treats missing required fields as required, not as a type error", () => {
    const result = parseInquiry({ ...VALID, country: undefined });
    expect(result).toEqual({ ok: false, fieldErrors: { country: "required" } });
  });
});

describe("deliverInquiry", () => {
  const inquiry = { ...VALID, organization: "Line\nBreak Co" } as Inquiry;

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends a plain-text email with the visitor as reply-to", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    const fetchMock = vi.fn().mockResolvedValue(new Response("{}", { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);

    await deliverInquiry(inquiry, "fr");

    const [url, init] = fetchMock.mock.calls[0];
    const body = JSON.parse(init.body);
    expect(url).toBe("https://api.resend.com/emails");
    expect(init.headers.Authorization).toBe("Bearer test-key");
    expect(body.to).toEqual(["inquiries@orvexco.com"]);
    expect(body.reply_to).toBe("a.buyer@example.com");
    expect(body.subject).toBe("New inquiry: Line Break Co (refinery)");
    expect(body.text).toContain("Language: fr");
  });

  it("throws when the provider rejects the email", async () => {
    vi.stubEnv("RESEND_API_KEY", "test-key");
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 422 })));
    await expect(deliverInquiry(inquiry, "en")).rejects.toThrow("422");
  });

  it("refuses to report success in production when no key is configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("NODE_ENV", "production");
    await expect(deliverInquiry(inquiry, "en")).rejects.toThrow("RESEND_API_KEY");
  });
});

describe("isRateLimited", () => {
  it("blocks the sixth attempt in a window, then allows it once the window passes", () => {
    const start = 1_000_000;
    for (let attempt = 0; attempt < 5; attempt++) {
      expect(isRateLimited("10.0.0.1", start + attempt)).toBe(false);
    }
    expect(isRateLimited("10.0.0.1", start + 5)).toBe(true);
    expect(isRateLimited("10.0.0.2", start + 5)).toBe(false);
    expect(isRateLimited("10.0.0.1", start + 10 * 60 * 1000 + 10)).toBe(false);
  });
});
