import {
  FALLBACK_RATES,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  type RatesPayload,
} from "@/data/currenciesFallback";

/**
 * Server-side currency rates adapter.
 *
 * Provider chain:
 * 1. If CURRENCY_API_URL is set, fetch from it (expects an
 *    open.er-api.com-compatible shape: { rates: { EUR: n, ... } } with base ALL).
 * 2. Otherwise try the free open.er-api.com endpoint (no key required).
 * 3. On any failure return the clearly-labeled local fallback rates.
 *
 * A paid provider requiring CURRENCY_API_KEY can be plugged in here without
 * touching any client code.
 */

const LIVE_URL =
  process.env.CURRENCY_API_URL ?? "https://open.er-api.com/v6/latest/ALL";

let cache: { payload: RatesPayload; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

export async function getRates(): Promise<RatesPayload> {
  if (cache && Date.now() - cache.fetchedAt < CACHE_TTL_MS) {
    return cache.payload;
  }

  try {
    const res = await fetch(LIVE_URL, { next: { revalidate: 43200 } });
    if (!res.ok) throw new Error(`Currency provider HTTP ${res.status}`);
    const json = (await res.json()) as {
      rates?: Record<string, number>;
      time_last_update_utc?: string;
    };
    if (!json.rates) throw new Error("Malformed currency response");

    const rates = {} as Record<CurrencyCode, number>;
    for (const code of SUPPORTED_CURRENCIES) {
      const value = code === "ALL" ? 1 : json.rates[code];
      if (typeof value !== "number" || !isFinite(value) || value <= 0) {
        throw new Error(`Missing rate for ${code}`);
      }
      rates[code] = value;
    }

    const payload: RatesPayload = {
      base: "ALL",
      rates,
      updatedAt: new Date().toISOString(),
      source: "live",
    };
    cache = { payload, fetchedAt: Date.now() };
    return payload;
  } catch {
    return FALLBACK_RATES;
  }
}
