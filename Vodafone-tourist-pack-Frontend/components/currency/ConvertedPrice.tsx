"use client";

import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";

interface ConvertedPriceProps {
  amountALL: number;
  className?: string;
  /** Visual size of the primary ALL amount. */
  size?: "sm" | "md" | "lg";
}

/**
 * Always shows the authoritative ALL price first, with the approximate
 * preferred-currency amount beneath it (per spec 7.4).
 */
export default function ConvertedPrice({
  amountALL,
  className = "",
  size = "md",
}: ConvertedPriceProps) {
  const { currency, convert } = useCurrency();
  const { localeTag } = useTranslation();

  const primary = new Intl.NumberFormat(localeTag).format(amountALL);
  const sizeClass =
    size === "lg" ? "text-3xl" : size === "sm" ? "text-base" : "text-2xl";

  return (
    <span className={`inline-flex flex-col ${className}`}>
      <span className={`font-bold text-[#E60000] dark:text-red-400 ${sizeClass}`}>
        {primary} ALL
      </span>
      {currency !== "ALL" && (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          ≈{" "}
          {new Intl.NumberFormat(localeTag, {
            style: "currency",
            currency,
            maximumFractionDigits: 2,
          }).format(convert(amountALL))}
        </span>
      )}
    </span>
  );
}
