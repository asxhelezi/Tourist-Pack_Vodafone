"use client";

import { Landmark, Mountain, UtensilsCrossed, Waves } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export type TravelStyle = "beach" | "mountain" | "history" | "food";

const CATEGORIES: {
  id: TravelStyle;
  titleKey: string;
  descKey: string;
  Icon: typeof Waves;
  gradient: string;
}[] = [
  { id: "beach", titleKey: "destinations.beach", descKey: "destinations.beachDesc", Icon: Waves, gradient: "from-[#E60000] to-[#FF6B6B]" },
  { id: "mountain", titleKey: "destinations.mountain", descKey: "destinations.mountainDesc", Icon: Mountain, gradient: "from-[#820000] to-[#BD0000]" },
  { id: "history", titleKey: "destinations.history", descKey: "destinations.historyDesc", Icon: Landmark, gradient: "from-[#BD0000] to-[#E60000]" },
  { id: "food", titleKey: "destinations.food", descKey: "destinations.foodDesc", Icon: UtensilsCrossed, gradient: "from-[#E60000] to-[#FF9B9B]" },
];

/** Traveler-style cards that filter the destination map (spec 10.2). */
export default function DestinationCategories({
  active,
  onPick,
}: {
  active: TravelStyle | null;
  onPick: (style: TravelStyle) => void;
}) {
  const { t } = useTranslation();

  return (
    <div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{t("destinations.title")}</h3>
      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {CATEGORIES.map(({ id, titleKey, descKey, Icon, gradient }) => (
          <button
            key={id}
            type="button"
            aria-pressed={active === id}
            onClick={() => onPick(id)}
            className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-4 text-left text-white shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] focus-visible:ring-offset-2 active:scale-[0.98] ${
              active === id ? "ring-4 ring-white/60 ring-offset-2 ring-offset-[#E60000]" : ""
            }`}
          >
            <Icon size={26} aria-hidden="true" className="drop-shadow" />
            <p className="mt-2 font-bold drop-shadow">{t(titleKey)}</p>
            <p className="mt-0.5 text-xs text-white/90">{t(descKey)}</p>
            <span className="mt-2 inline-block text-xs font-semibold underline underline-offset-2">
              {t("destinations.viewOnMap")}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
