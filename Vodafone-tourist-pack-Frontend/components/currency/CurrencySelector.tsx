"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRightLeft, Check, ChevronDown } from "lucide-react";
import { SUPPORTED_CURRENCIES } from "@/data/currenciesFallback";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";
import CurrencyConverter from "@/components/currency/CurrencyConverter";

/** Header currency dropdown + entry point to the full converter. */
export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [converterOpen, setConverterOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDocClick = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("common.currency")}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex min-h-[44px] items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        {currency}
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("common.currency")}
          className="absolute right-0 z-50 mt-1 w-48 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 py-1 shadow-lg"
        >
          {SUPPORTED_CURRENCIES.map((code) => (
            <li key={code} role="option" aria-selected={code === currency}>
              <button
                type="button"
                onClick={() => {
                  setCurrency(code);
                  setOpen(false);
                }}
                className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800 focus-visible:outline-none ${
                  code === currency ? "font-semibold text-[#E60000] dark:text-red-400" : "text-gray-700 dark:text-gray-200"
                }`}
              >
                <span className="flex-1">{code}</span>
                {code === currency && <Check size={14} aria-hidden="true" />}
              </button>
            </li>
          ))}
          <li className="border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setConverterOpen(true);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-200 transition hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800 focus-visible:outline-none"
            >
              <ArrowRightLeft size={14} aria-hidden="true" />
              {t("currency.title")}
            </button>
          </li>
        </ul>
      )}

      <CurrencyConverter open={converterOpen} onClose={() => setConverterOpen(false)} />
    </div>
  );
}
