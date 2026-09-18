"use client";

import { useState } from "react";
import { Check, Clock } from "lucide-react";
import type { Pack } from "@/data/packs";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import ConvertedPrice from "@/components/currency/ConvertedPrice";
import PaymentActivationModal from "@/components/activation/PaymentActivationModal";
import { usePack } from "@/context/PackContext";
import { useTranslation } from "@/hooks/useTranslation";

interface PackCardProps {
  pack: Pack;
}

export default function PackCard({ pack }: PackCardProps) {
  const { t } = useTranslation();
  const { selected, selectPack, stage } = usePack();
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const isSelected = selected?.pack.id === pack.id && !selected?.groupPack;
  const isPending = isSelected && stage === "pendingScan";
  const isActivated = isSelected && stage === "activated";

  const handleActivate = () => {
    if (isActivated) return;

    // Reopening while a scan confirmation is pending picks the flow back
    // up at the QR step instead of restarting payment method selection.
    if (isPending) {
      setModalOpen(true);
      return;
    }

    setLoading(true);
    // Brief loading state before opening the payment flow.
    window.setTimeout(() => {
      selectPack(pack);
      setLoading(false);
      setModalOpen(true);
    }, 400);
  };

  const features = [
    `${pack.dataGB} GB ${t("packs.data")}`,
    `${pack.callMinutes} ${t("packs.minutes")}`,
    pack.sms === null
      ? `${t("packs.unlimited")} ${t("packs.sms")}`
      : `${pack.sms} ${t("packs.sms")}`,
  ];

  return (
    <div
      className={`pack-card-3d flex flex-col overflow-hidden rounded-2xl border bg-white dark:bg-gray-900 shadow-sm ${
        isSelected
          ? "border-[#E60000] ring-2 ring-[#E60000]/30"
          : "border-gray-200 dark:border-gray-700"
    }`}
>
      <div className="border-b-2 border-[#E60000] bg-gray-50 dark:bg-gray-800 p-6 text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{t(pack.titleKey)}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t(pack.subtitleKey)}</p>
        <div className="mt-3 flex justify-center">
          <ConvertedPrice amountALL={pack.priceALL} size="lg" />
        </div>
        <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {pack.durationDays} {pack.durationDays === 1 ? t("packs.day") : t("packs.days")}
        </div>
        <div className="mt-2">
          <Badge tone="red">{t(pack.bestForKey)}</Badge>
        </div>
      </div>

      <ul className="min-h-0 flex-1 overflow-y-auto p-6">
        {features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-800 py-2.5 text-sm text-gray-800 dark:text-gray-100 last:border-0"
          >
            <Check size={16} className="shrink-0 text-[#E60000] dark:text-red-400" aria-hidden="true" />
            {feature}
          </li>
        ))}
      </ul>

      <div className="bg-gray-50 dark:bg-gray-800 p-5">
        <Button
          className="w-full"
          loading={loading}
          onClick={handleActivate}
          disabled={isActivated}
          aria-pressed={isSelected}
        >
          {isActivated ? (
            <>
              <Check size={16} aria-hidden="true" /> {t("packs.activated")}
            </>
          ) : isPending ? (
            <>
              <Clock size={16} aria-hidden="true" /> {t("activation.pendingScanTitle")}
            </>
          ) : isSelected ? (
            t("common.selected")
          ) : (
            t("common.select")
          )}
        </Button>
      </div>

      <PaymentActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
