"use client";

import { useState } from "react";
import { Clock, Copy, ExternalLink, MapPin, Phone } from "lucide-react";
import Badge from "@/components/ui/Badge";
import type { Embassy } from "@/data/embassies";
import { useTranslation } from "@/hooks/useTranslation";

/** One embassy card (spec 9.2). */
export default function EmbassyCard({ embassy }: { embassy: Embassy }) {
  const { t, localeTag } = useTranslation();
  const [copied, setCopied] = useState(false);

  const copyDetails = async () => {
    const details = [
      embassy.officeName,
      embassy.address,
      embassy.phone,
      embassy.emergencyPhone ? `${t("embassy.emergencyPhone")}: ${embassy.emergencyPhone}` : null,
      embassy.website,
    ]
      .filter(Boolean)
      .join("\n");
    try {
      await navigator.clipboard.writeText(details);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  return (
    <article className="flex flex-col rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm transition hover:shadow-md">
      <header className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {embassy.flag}
        </span>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-gray-50">{t(embassy.countryNameKey)}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{embassy.officeName}</p>
        </div>
      </header>

      <dl className="mt-4 flex-1 space-y-2 text-sm text-gray-700 dark:text-gray-200">
        <div className="flex items-start gap-2">
          <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <dd>{embassy.address}</dd>
        </div>
        <div className="flex items-start gap-2">
          <Phone size={14} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <dd>
            <a href={`tel:${embassy.phone.replace(/\s/g, "")}`} className="hover:text-[#E60000]">
              {embassy.phone}
            </a>
            {embassy.emergencyPhone && (
              <span className="block text-xs text-gray-500 dark:text-gray-400">
                {t("embassy.emergencyPhone")}:{" "}
                <a
                  href={`tel:${embassy.emergencyPhone.replace(/\s/g, "")}`}
                  className="hover:text-[#E60000]"
                >
                  {embassy.emergencyPhone}
                </a>
              </span>
            )}
          </dd>
        </div>
        <div className="flex items-start gap-2">
          <Clock size={14} className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500" aria-hidden="true" />
          <dd>{embassy.openingHours}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {embassy.lostPassportSupport && (
          <Badge tone="red">{t("embassy.lostPassportSupport")}</Badge>
        )}
        <Badge tone="blue">{t("embassy.consularSupport")}</Badge>
      </div>

      <footer className="mt-4 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-800 pt-3 text-xs">
        <a
          href={embassy.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200 transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
        >
          <ExternalLink size={12} aria-hidden="true" />
          {t("common.website")}
        </a>
        <a
          href={`https://www.google.com/maps/search/${encodeURIComponent(embassy.mapQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200 transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
        >
          <MapPin size={12} aria-hidden="true" />
          {t("common.directions")}
        </a>
        <button
          type="button"
          onClick={copyDetails}
          className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200 transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
        >
          <Copy size={12} aria-hidden="true" />
          {copied ? t("common.copied") : t("embassy.copyDetails")}
        </button>
        <span className="ml-auto text-gray-400 dark:text-gray-500">
          {t("embassy.lastChecked")}:{" "}
          {new Intl.DateTimeFormat(localeTag, { dateStyle: "medium" }).format(
            new Date(embassy.lastChecked)
          )}
        </span>
      </footer>
    </article>
  );
}
