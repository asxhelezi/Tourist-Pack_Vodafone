/**
 * Fallback exchange rates, base ALL (Albanian Lek).
 * Used only when the live currency endpoint is unavailable.
 * These are approximate reference values and must never be
 * presented as live market rates.
 */
export const SUPPORTED_CURRENCIES = ["ALL", "EUR", "USD", "GBP", "CHF"] as const;

export type CurrencyCode = (typeof SUPPORTED_CURRENCIES)[number];

export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  ALL: "L",
  EUR: "€",
  USD: "$",
  GBP: "£",
  CHF: "CHF",
};

export interface RatesPayload {
  base: "ALL";
  /** 1 ALL = rates[code] units of that currency */
  rates: Record<CurrencyCode, number>;
  updatedAt: string; // ISO date
  source: "live" | "fallback";
}

export const FALLBACK_RATES: RatesPayload = {
  base: "ALL",
  rates: {
    ALL: 1,
    EUR: 0.0101,
    USD: 0.0118,
    GBP: 0.0088,
    CHF: 0.0094,
  },
  updatedAt: "2026-01-01T00:00:00.000Z",
  source: "fallback",
};
