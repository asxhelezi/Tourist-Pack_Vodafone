"use client";

import { useState } from "react";
import { Copy, ExternalLink, MapPin, Share2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Share My Location (spec 9.1 B): geolocation is requested only after
 * the user taps the button, with an explanation of why.
 */
export default function LocationShare() {
  const { t } = useTranslation();
  const { status, coords, request } = useGeolocation();
  const [copied, setCopied] = useState(false);

  const coordsText = coords
    ? `${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`
    : null;
  const mapsUrl = coords
    ? `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
    : null;

  const copyLocation = async () => {
    if (!coordsText || !mapsUrl) return;
    try {
      await navigator.clipboard.writeText(`${coordsText} — ${mapsUrl}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const shareLocation = async () => {
    if (!mapsUrl) return;
    try {
      if (navigator.share) {
        await navigator.share({ title: t("emergency.shareLocation"), url: mapsUrl });
      } else {
        await copyLocation();
      }
    } catch {
      // user cancelled share
    }
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
      <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-50">
        <MapPin size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
        {t("emergency.shareLocation")}
      </h3>
      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t("emergency.shareLocationWhy")}</p>

      {status === "idle" && (
        <Button size="sm" className="mt-3" onClick={request}>
          {t("emergency.getLocation")}
        </Button>
      )}
      {status === "locating" && (
        <Button size="sm" className="mt-3" loading disabled>
          {t("emergency.locating")}
        </Button>
      )}
      {(status === "denied" || status === "error") && (
        <p className="mt-3 rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 text-xs text-amber-900 dark:text-amber-200" role="alert">
          {t("emergency.locationDenied")}
        </p>
      )}
      {status === "success" && coordsText && mapsUrl && (
        <div className="mt-3 space-y-2" role="status">
          <p className="font-mono text-sm text-gray-800 dark:text-gray-100">{coordsText}</p>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="secondary" onClick={copyLocation}>
              <Copy size={13} aria-hidden="true" />
              {copied ? t("common.copied") : t("emergency.copyLocation")}
            </Button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-1.5 text-sm font-semibold text-gray-800 dark:text-gray-100 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <ExternalLink size={13} aria-hidden="true" />
              {t("emergency.openInMap")}
            </a>
            <Button size="sm" variant="secondary" onClick={shareLocation}>
              <Share2 size={13} aria-hidden="true" />
              {t("emergency.shareVia")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
