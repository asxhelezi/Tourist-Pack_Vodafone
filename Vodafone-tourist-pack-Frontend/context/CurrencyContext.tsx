"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  FALLBACK_RATES,
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
  type RatesPayload,
} from "@/data/currenciesFallback";

const STORAGE_KEY = "vf-currency";

interface CurrencyContextValue {
  /** Preferred display currency (ALL stays primary everywhere). */
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  rates: RatesPayload;
  ratesStatus: "loading" | "live" | "fallback" | "error";
  /** Convert an ALL amount to any supported currency. */
  convert: (amountALL: number, to?: CurrencyCode) => number;
  /** Convert between any two supported currencies. */
  convertBetween: (amount: number, from: CurrencyCode, to: CurrencyCode) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

function isCurrency(value: string): value is CurrencyCode {
  return (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");
  const [rates, setRates] = useState<RatesPayload>(FALLBACK_RATES);
  const [ratesStatus, setRatesStatus] = useState<
    "loading" | "live" | "fallback" | "error"
  >("loading");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && isCurrency(stored)) setCurrencyState(stored);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/currency")
      .then((res) => {
        if (!res.ok) throw new Error("rates unavailable");
        return res.json() as Promise<RatesPayload>;
      })
      .then((payload) => {
        if (cancelled) return;
        setRates(payload);
        setRatesStatus(payload.source === "live" ? "live" : "fallback");
      })
      .catch(() => {
        if (cancelled) return;
        setRates(FALLBACK_RATES);
        setRatesStatus("fallback");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  }, []);

  const convert = useCallback(
    (amountALL: number, to?: CurrencyCode) =>
      amountALL * rates.rates[to ?? currency],
    [rates, currency]
  );

  const convertBetween = useCallback(
    (amount: number, from: CurrencyCode, to: CurrencyCode) =>
      (amount / rates.rates[from]) * rates.rates[to],
    [rates]
  );

  const value = useMemo(
    () => ({ currency, setCurrency, rates, ratesStatus, convert, convertBetween }),
    [currency, setCurrency, rates, ratesStatus, convert, convertBetween]
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}
