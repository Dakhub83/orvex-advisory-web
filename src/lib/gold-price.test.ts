import { afterEach, describe, expect, it, vi } from "vitest";
import { getGoldPrice, parseGoldPrice } from "./gold-price";

// Example response from goldprice.dev's documentation.
const SAMPLE = {
  symbols: [
    {
      symbol: "XAU",
      quote_currency: "USD",
      unit: "troy_ounce",
      contract_type: "spot",
      price: "4012.75",
      is_stale: false,
      computed_at: "2026-10-23T07:00:18.221118+00:00",
    },
  ],
};

describe("parseGoldPrice", () => {
  it("converts the ounce price to grams and kilograms", () => {
    const price = parseGoldPrice(SAMPLE)!;
    expect(price.perOunce).toBe(4012.75);
    expect(price.perGram).toBeCloseTo(129.0129, 3);
    expect(price.perKilogram).toBeCloseTo(129012.9, 0);
    expect(price.asOf).toBe("2026-10-23T07:00:18.221118+00:00");
    expect(price.stale).toBe(false);
  });

  it("refuses anything that is not a positive XAU/USD ounce price", () => {
    const quote = SAMPLE.symbols[0];
    expect(parseGoldPrice({ symbols: [{ ...quote, price: undefined }] })).toBeNull();
    expect(parseGoldPrice({ symbols: [{ ...quote, price: "abc" }] })).toBeNull();
    expect(parseGoldPrice({ symbols: [{ ...quote, price: "0" }] })).toBeNull();
    expect(parseGoldPrice({ symbols: [{ ...quote, quote_currency: "EUR" }] })).toBeNull();
    expect(parseGoldPrice({ symbols: [{ ...quote, unit: "gram" }] })).toBeNull();
    expect(parseGoldPrice({ symbols: [] })).toBeNull();
    expect(parseGoldPrice(null)).toBeNull();
  });
});

describe("getGoldPrice", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("sends the API key only when one is configured", async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify(SAMPLE)));
    vi.stubGlobal("fetch", fetchMock);

    vi.stubEnv("GOLDPRICE_API_KEY", "");
    await getGoldPrice();
    expect(fetchMock.mock.calls[0][1].headers).toBeUndefined();

    vi.stubEnv("GOLDPRICE_API_KEY", "ga_live_test");
    await getGoldPrice();
    expect(fetchMock.mock.calls[1][1].headers).toEqual({ Authorization: "Bearer ga_live_test" });
  });

  it("returns null instead of throwing when the provider fails", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 429 })));
    await expect(getGoldPrice()).resolves.toBeNull();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
    await expect(getGoldPrice()).resolves.toBeNull();
  });
});
