"use client";

import { useState } from "react";
import { ChevronUp, ShoppingBag, X } from "lucide-react";
import ConvertedPrice from "@/components/currency/ConvertedPrice";
import Badge from "@/components/ui/Badge";
import { usePack } from "@/context/PackContext";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Selected-pack summary: a slim bottom bar that expands into a summary
 * panel (replaces the old decorative cart icon, spec 7.2).
 */
export default function SelectedPackDrawer() {
  const { t } = useTranslation();
  const { selected, stage, clearSelection } = usePack();
  const [expanded, setExpanded] = useState(false);

  if (!selected) return null;

  const priceALL = selected.groupPack
    ? selected.groupPack.totalPriceALL
    : selected.pack.priceALL;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-2xl px-3 pb-3 sm:px-4">
      <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl">
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
        >
          <span className="flex items-center gap-2 text-sm font-semibold text-gray-900 dark:text-gray-50">
            <ShoppingBag size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
            {t("packs.selectedPack")}: {t(selected.pack.titleKey)}
            {selected.groupPack && (
              <Badge tone="blue">
                {selected.groupPack.people} {t("group.people")}
              </Badge>
            )}
            {stage === "pendingScan" && <Badge tone="blue">{t("activation.pendingScanTitle")}</Badge>}
            {stage === "activated" && <Badge tone="green">{t("packs.activated")}</Badge>}
          </span>
          <span className="flex items-center gap-2">
            <ConvertedPrice amountALL={priceALL} size="sm" />
            <ChevronUp
              size={16}
              aria-hidden="true"
              className={`text-gray-400 dark:text-gray-500 transition-transform ${expanded ? "rotate-180" : ""}`}
            />
          </span>
        </button>

        {expanded && (
          <div className="border-t border-gray-100 dark:border-gray-800 px-4 py-3">
            <dl className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                <dt className="text-xs text-gray-500 dark:text-gray-400">{t("builder.tripLength")}</dt>
                <dd className="font-semibold">
                  {selected.pack.durationDays} {t("packs.days")}
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                <dt className="text-xs text-gray-500 dark:text-gray-400">{t("packs.data")}</dt>
                <dd className="font-semibold">
                  {selected.groupPack
                    ? `${selected.groupPack.dataAllocationGB} GB × ${selected.groupPack.people}`
                    : `${selected.pack.dataGB} GB`}
                </dd>
              </div>
              <div className="rounded-lg bg-gray-50 dark:bg-gray-800 p-2">
                <dt className="text-xs text-gray-500 dark:text-gray-400">
                  {selected.groupPack ? t("packs.sims") : t("packs.minutes")}
                </dt>
                <dd className="font-semibold">
                  {selected.groupPack
                    ? selected.groupPack.people
                    : selected.pack.callMinutes}
                </dd>
              </div>
            </dl>
            <button
              type="button"
              onClick={clearSelection}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <X size={12} aria-hidden="true" />
              {t("common.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
