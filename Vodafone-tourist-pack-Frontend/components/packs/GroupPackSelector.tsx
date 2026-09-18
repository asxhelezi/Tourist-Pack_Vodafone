"use client";

import { useMemo, useState } from "react";
import { Users } from "lucide-react";
import Badge from "@/components/ui/Badge";
import PackRecommendation from "@/components/packs/PackRecommendation";
import { recommendPack, type TripNeeds } from "@/lib/recommendation";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Group / Family / Friends pack section (spec 8.3) with the exact
 * user-supplied example pricing (1: 1500, 2: 2600, 3: 3900 ALL).
 */
export default function GroupPackSelector() {
  const { t } = useTranslation();
  const [people, setPeople] = useState(2);

  const needs: TripNeeds = useMemo(
    () => ({ days: 14, dataLevel: "high", minutes: 100, travellers: people }),
    [people]
  );
  const recommendation = useMemo(() => recommendPack(needs), [needs]);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 flex flex-col items-center gap-2 text-center">
        <Badge tone="blue">
          <Users size={12} aria-hidden="true" />
          {t("group.badge")}
        </Badge>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{t("group.title")}</h3>
      </div>

      <fieldset className="mb-6">
        <legend className="sr-only">{t("builder.travellers")}</legend>
        <div className="flex justify-center gap-2" role="group">
          {[1, 2, 3, 4].map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={people === n}
              onClick={() => setPeople(n)}
              className={`flex h-14 w-16 flex-col items-center justify-center rounded-xl border text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                people === n
                  ? "border-[#E60000] bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
              }`}
            >
              <span className="text-lg">{n === 4 ? "4+" : n}</span>
              <span className="text-[10px] font-normal text-gray-500 dark:text-gray-400">
                {n === 1 ? t("group.person") : t("group.people")}
              </span>
            </button>
          ))}
        </div>
      </fieldset>

      <PackRecommendation
        recommendation={recommendation}
        needs={needs}
        showFitScore={false}
      />
    </div>
  );
}
