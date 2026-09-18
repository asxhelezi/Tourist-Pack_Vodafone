"use client";

import { useState } from "react";
import { Check, Clock, Info, Users } from "lucide-react";
import type { Recommendation } from "@/lib/recommendation";
import type { TripNeeds } from "@/lib/recommendation";
import { calculateFitScore } from "@/lib/fitScore";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConvertedPrice from "@/components/currency/ConvertedPrice";
import ConnectivityFitDial from "@/components/packs/ConnectivityFitDial";
import PaymentActivationModal from "@/components/activation/PaymentActivationModal";
import { usePack } from "@/context/PackContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useTranslation } from "@/hooks/useTranslation";

interface PackRecommendationProps {
  recommendation: Recommendation;
  needs: TripNeeds;
  /** Show the animated fit dial (used after story flow / builder). */
  showFitScore?: boolean;
}

/** Recommendation card shared by Pack Builder and Story flow (spec 8.2). */
export default function PackRecommendation({
  recommendation,
  needs,
  showFitScore = true,
}: PackRecommendationProps) {
  const { t, localeTag } = useTranslation();
  const { convert, currency } = useCurrency();
  const { selectPack, selected, stage } = usePack();
  const [justSelected, setJustSelected] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { pack, groupPack, isGroup, priceALL, savingsALL, reasons, compromises } =
    recommendation;
  const fit = calculateFitScore(needs, pack);

  const isCurrentSelection =
    selected?.pack.id === pack.id &&
    (selected?.groupPack?.id ?? null) === (groupPack?.id ?? null);
  const isPending = isCurrentSelection && stage === "pendingScan";
  const isActivated = isCurrentSelection && stage === "activated";

  const handleSelect = () => {
    if (isActivated) return;

    // Reopening while a scan confirmation is pending picks the flow back
    // up at the QR step instead of restarting payment method selection.
    if (isPending) {
      setModalOpen(true);
      return;
    }

    selectPack(pack, groupPack, needs.travellers);
    setJustSelected(true);
    window.setTimeout(() => setJustSelected(false), 1800);
    setModalOpen(true);
  };

  const formatALL = (n: number) => `${new Intl.NumberFormat(localeTag).format(n)} ALL`;

  return (
    <div className="rounded-2xl border-2 border-[#E60000]/20 bg-white dark:bg-gray-900 p-6 shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{t(pack.titleKey)}</h3>
            <Badge tone={isGroup ? "blue" : "gray"}>
              {isGroup ? (
                <>
                  <Users size={12} aria-hidden="true" /> {t("builder.group")}
                </>
              ) : (
                t("builder.individual")
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(pack.subtitleKey)}</p>
        </div>
        <ConvertedPrice amountALL={priceALL} />
      </div>

      {/* Key figures */}
      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
        {[
          [t("builder.tripLength"), `${pack.durationDays} ${t("packs.days")}`],
          [t("packs.data"), isGroup && groupPack ? `${groupPack.dataAllocationGB} GB × ${groupPack.people}` : `${pack.dataGB} GB`],
          [t("packs.minutes"), isGroup && groupPack ? `${groupPack.minutesAllocation} × ${groupPack.people}` : `${pack.callMinutes}`],
          [
            isGroup ? t("packs.sims") : t("packs.sms"),
            isGroup && groupPack
              ? `${groupPack.people}`
              : pack.sms === null
                ? t("packs.unlimited")
                : `${pack.sms}`,
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl bg-gray-50 dark:bg-gray-800 p-3 text-center">
            <dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
            <dd className="mt-0.5 font-semibold text-gray-900 dark:text-gray-50">{value}</dd>
          </div>
        ))}
      </dl>

      {/* Group savings */}
      {isGroup && groupPack && (
        <div className="mt-4 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-900 dark:text-green-200">
          <p>
            {t("group.separateCost", {
              x: formatALL(groupPack.people * groupPack.individualReferencePriceALL),
            })}{" "}
            {t("group.groupCost", { y: formatALL(groupPack.totalPriceALL) })}{" "}
            <strong>{t("group.youSave", { z: formatALL(savingsALL) })}</strong>
          </p>
          {currency !== "ALL" && (
            <p className="mt-1 text-xs text-green-700 dark:text-green-300">
              ≈{" "}
              {new Intl.NumberFormat(localeTag, {
                style: "currency",
                currency,
                maximumFractionDigits: 2,
              }).format(convert(savingsALL))}
            </p>
          )}
        </div>
      )}
      {isGroup && !groupPack && (
        <div className="mt-4 rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-4 text-sm text-amber-900 dark:text-amber-200">
          {t("group.customGroup")}
        </div>
      )}

      {/* Why this fits */}
      <div className="mt-4">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t("builder.whyFits")}</h4>
        <ul className="mt-2 space-y-1.5">
          {reasons.map((reason) => (
            <li key={reason.key} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-200">
              <Check size={15} className="mt-0.5 shrink-0 text-green-600" aria-hidden="true" />
              {t(reason.key, reason.params)}
            </li>
          ))}
        </ul>
        {compromises.length > 0 && (
          <ul className="mt-2 space-y-1.5">
            {compromises.map((c) => (
              <li key={c.key} className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Info size={15} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
                {t(c.key, c.params)}
              </li>
            ))}
          </ul>
        )}
      </div>

      {showFitScore && (
        <div className="mt-5 flex justify-center">
          <ConnectivityFitDial score={fit.score} labelKey={fit.labelKey} />
        </div>
      )}

      <Button className="mt-5 w-full" size="lg" onClick={handleSelect} disabled={isActivated}>
        {isActivated ? (
          <>
            <Check size={18} aria-hidden="true" /> {t("packs.activated")}
          </>
        ) : isPending ? (
          <>
            <Clock size={18} aria-hidden="true" /> {t("activation.pendingScanTitle")}
          </>
        ) : justSelected ? (
          <>
            <Check size={18} aria-hidden="true" /> {t("common.selected")}
          </>
        ) : (
          t("builder.selectPack")
        )}
      </Button>
      <p className="mt-2 text-center text-xs text-gray-400 dark:text-gray-500"></p>

      <PaymentActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
