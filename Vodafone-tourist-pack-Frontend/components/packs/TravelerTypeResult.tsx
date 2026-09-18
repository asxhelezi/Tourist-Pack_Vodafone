"use client";

import {
  Building2,
  Laptop,
  Landmark,
  Mountain,
  UtensilsCrossed,
  Waves,
} from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import type { TravelerType } from "@/components/packs/StoryPackWizard";

const TYPE_META: Record<
  TravelerType,
  { titleKey: string; descKey: string; Icon: typeof Waves }
> = {
  cityExplorer: {
    titleKey: "travelerType.cityExplorer",
    descKey: "travelerType.cityExplorerDesc",
    Icon: Building2,
  },
  beachWanderer: {
    titleKey: "travelerType.beachWanderer",
    descKey: "travelerType.beachWandererDesc",
    Icon: Waves,
  },
  mountainExplorer: {
    titleKey: "travelerType.mountainExplorer",
    descKey: "travelerType.mountainExplorerDesc",
    Icon: Mountain,
  },
  historyLover: {
    titleKey: "travelerType.historyLover",
    descKey: "travelerType.historyLoverDesc",
    Icon: Landmark,
  },
  foodLover: {
    titleKey: "travelerType.foodLover",
    descKey: "travelerType.foodLoverDesc",
    Icon: UtensilsCrossed,
  },
  digitalNomad: {
    titleKey: "travelerType.digitalNomad",
    descKey: "travelerType.digitalNomadDesc",
    Icon: Laptop,
  },
};

/** Traveler personality card shown with the story result (spec 8.5). */
export default function TravelerTypeResult({ type }: { type: TravelerType }) {
  const { t } = useTranslation();
  const { titleKey, descKey, Icon } = TYPE_META[type];

  return (
    <div className="flex flex-col items-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-b from-red-50 to-white p-6 text-center shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {t("travelerType.title")}
      </span>
      <span className="mt-4 inline-flex rounded-full bg-[#E60000] p-4 text-white">
        <Icon size={32} aria-hidden="true" />
      </span>
      <h4 className="mt-3 text-xl font-bold text-gray-900 dark:text-gray-50">{t(titleKey)}</h4>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t(descKey)}</p>
    </div>
  );
}
