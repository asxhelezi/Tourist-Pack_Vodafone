"use client";

import { useState } from "react";
import { ArrowRightLeft } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import {
  SUPPORTED_CURRENCIES,
  type CurrencyCode,
} from "@/data/currenciesFallback";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";

interface CurrencyConverterProps {
  open: boolean;
  onClose: () => void;
}

/** Full currency converter (spec 7.4 B). */
export default function CurrencyConverter({ open, onClose }: CurrencyConverterProps) {
  const { t, localeTag } = useTranslation();
  const { convertBetween, rates, ratesStatus } = useCurrency();
  const [amount, setAmount] = useState("100");
  const [from, setFrom] = useState<CurrencyCode>("EUR");
  const [to, setTo] = useState<CurrencyCode>("ALL");

  const parsed = Number(amount.replace(",", "."));
  const valid = amount.trim() !== "" && isFinite(parsed) && parsed >= 0;
  const result = valid ? convertBetween(parsed, from, to) : null;

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  const selectClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]";

  return (
    <Modal
      open={open}
      onClose={onClose}
      label={t("currency.title")}
      closeLabel={t("common.close")}
      panelClassName="max-w-md"
    >
      <div className="p-6">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-50">
          {t("currency.title")}
        </h2>

        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="cc-amount">
          {t("currency.amount")}
        </label>
        <input
          id="cc-amount"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          aria-invalid={!valid}
          className={`${selectClass} mb-1`}
        />
        {!valid && (
          <p className="mb-2 text-sm text-[#BD0000]" role="alert">
            {t("currency.invalidAmount")}
          </p>
        )}

        <div className="mt-3 flex items-end gap-2">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="cc-from">
              {t("currency.from")}
            </label>
            <select
              id="cc-from"
              value={from}
              onChange={(e) => setFrom(e.target.value as CurrencyCode)}
              className={selectClass}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={swap}
            aria-label={t("currency.swap")}
            className="rounded-lg border border-gray-300 dark:border-gray-600 p-2.5 text-gray-700 dark:text-gray-200 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
          >
            <ArrowRightLeft size={16} aria-hidden="true" />
          </button>
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200" htmlFor="cc-to">
              {t("currency.to")}
            </label>
            <select
              id="cc-to"
              value={to}
              onChange={(e) => setTo(e.target.value as CurrencyCode)}
              className={selectClass}
            >
              {SUPPORTED_CURRENCIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div
          className="mt-5 rounded-xl bg-gray-50 dark:bg-gray-800 p-4 text-center"
          aria-live="polite"
        >
          <div className="text-sm text-gray-500 dark:text-gray-400">{t("currency.result")}</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            {result !== null
              ? new Intl.NumberFormat(localeTag, {
                  style: "currency",
                  currency: to,
                  maximumFractionDigits: 2,
                }).format(result)
              : "—"}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Badge tone={ratesStatus === "live" ? "green" : "amber"}>
            {ratesStatus === "live"
              ? t("currency.ratesLive")
              : t("currency.ratesFallback")}
          </Badge>
          <span>
            {t("common.lastUpdated")}:{" "}
            {new Intl.DateTimeFormat(localeTag, {
              dateStyle: "medium",
            }).format(new Date(rates.updatedAt))}
          </span>
        </div>
      </div>
    </Modal>
  );
}
