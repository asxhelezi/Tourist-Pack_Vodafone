"use client";

import {
  Building2,
  Car,
  Cross,
  ExternalLink,
  Landmark,
  Phone,
} from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import LocationShare from "@/components/emergency/LocationShare";
import { EMERGENCY_NUMBERS, NEARBY_SEARCHES, TAXI_NUMBER } from "@/data/emergency";
import { useTranslation } from "@/hooks/useTranslation";

interface LostSupportDrawerProps {
  open: boolean;
  onClose: () => void;
  /** Opens the embassy / lost-document flow in the Support section. */
  onOpenEmbassies: () => void;
}

/** Emergency support drawer (spec 9.1). Works entirely from local data. */
export default function LostSupportDrawer({
  open,
  onClose,
  onOpenEmbassies,
}: LostSupportDrawerProps) {
  const { t } = useTranslation();

  const externalLinks = [
    { labelKey: "emergency.callTaxi", href: NEARBY_SEARCHES.taxi, Icon: Car },
    { labelKey: "emergency.nearestHospital", href: NEARBY_SEARCHES.hospital, Icon: Cross },
    { labelKey: "emergency.nearestStore", href: NEARBY_SEARCHES.vodafoneStore, Icon: Building2 },
  ] as const;

  return (
    <Drawer
      open={open}
      onClose={onClose}
      side="left"
      label={t("emergency.title")}
      closeLabel={t("common.close")}
      title={t("emergency.title")}
    >
      {/* Tap-to-call numbers */}
      <ul className="mt-4 space-y-2">
        {EMERGENCY_NUMBERS.map((entry) => (
          <li key={entry.id}>
            <a
              href={`tel:${entry.number}`}
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm transition hover:border-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-red-50 dark:bg-red-950/30 p-2 text-[#E60000] dark:text-red-400">
                  <Phone size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {t(entry.labelKey)}
                </span>
              </span>
              <span className="text-lg font-extrabold text-[#E60000] dark:text-red-400">
                {entry.number}
              </span>
            </a>
          </li>
        ))}
      </ul>

      {/* Location sharing */}
      <div className="mt-5">
        <LocationShare />
      </div>

      {/* Taxi / hospital / store */}
      <ul className="mt-5 space-y-2">
        {externalLinks.map(({ labelKey, href, Icon }) => (
          <li key={labelKey}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 shadow-sm transition hover:border-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <span className="flex items-center gap-3">
                <span className="inline-flex rounded-full bg-red-50 dark:bg-red-950/30 p-2 text-[#E60000] dark:text-red-400">
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-50">
                  {t(labelKey)}
                </span>
              </span>
              <ExternalLink size={14} className="text-gray-400 dark:text-gray-500" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
        {t("emergency.callTaxi")}: {TAXI_NUMBER.number}
      </p>

      {/* Embassy entry point */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenEmbassies();
        }}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 text-sm font-semibold text-gray-700 dark:text-gray-200 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
      >
        <Landmark size={16} aria-hidden="true" />
        {t("emergency.embassyHelp")}
      </button>
    </Drawer>
  );
}
