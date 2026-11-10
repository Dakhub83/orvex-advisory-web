import { z } from "zod";

// Indicative gold spot price from goldprice.dev, fetched on the server only.
//
// Their terms, which this module and the ticker are built around:
// - Free and keyless data is delayed 15 minutes and requires a visible credit
//   link to goldprice.dev next to the prices (paid plans are live, no credit).
// - Passing the data through our own API counts as redistribution, so there is
//   no public price endpoint: the price is rendered into the page instead.
// - The data is not an official benchmark.

const ENDPOINT = "https://api.goldprice.dev/v1/prices?symbol=XAU-USD-SPOT";

/**
 * How long a fetched price is reused. One request per 10 minutes is about
 * 4,300 a month, inside the free key's 5,000, and the data is 15 minutes
 * delayed anyway.
 */
export const GOLD_PRICE_REVALIDATE_SECONDS = 600;

const GRAMS_PER_TROY_OUNCE = 31.1034768;

const responseSchema = z.object({
  symbols: z
    .array(
      z.object({
        symbol: z.literal("XAU"),
        quote_currency: z.literal("USD"),
        unit: z.literal("troy_ounce"),
        price: z.string().optional(),
        is_stale: z.boolean(),
        computed_at: z.string().optional(),
      }),
    )
    .min(1),
});

export type GoldPrice = {
  perOunce: number;
  perGram: number;
  perKilogram: number;
  /** ISO timestamp the provider computed the price at, if given. */
  asOf: string | null;
  /** True when the provider says its source has fallen behind. */
  stale: boolean;
};

/** Validates a provider response; anything unexpected yields null rather than a wrong price. */
export function parseGoldPrice(json: unknown): GoldPrice | null {
  const parsed = responseSchema.safeParse(json);
  if (!parsed.success) return null;
  const quote = parsed.data.symbols[0];
  const perOunce = Number(quote.price);
  if (!Number.isFinite(perOunce) || perOunce <= 0) return null;
  const perGram = perOunce / GRAMS_PER_TROY_OUNCE;
  return {
    perOunce,
    perGram,
    perKilogram: perGram * 1000,
    asOf: quote.computed_at ?? null,
    stale: quote.is_stale,
  };
}

/** Returns the latest cached price, or null if it cannot be obtained. Never throws. */
export async function getGoldPrice(): Promise<GoldPrice | null> {
  const apiKey = process.env.GOLDPRICE_API_KEY;
  try {
    const response = await fetch(ENDPOINT, {
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined,
      next: { revalidate: GOLD_PRICE_REVALIDATE_SECONDS },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
      console.warn(`[gold-price] provider responded with ${response.status}`);
      return null;
    }
    return parseGoldPrice(await response.json());
  } catch (error) {
    console.warn("[gold-price] request failed:", error instanceof Error ? error.message : error);
    return null;
  }
}
