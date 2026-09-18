"use client";

import dynamic from "next/dynamic";
import { Component, useMemo, useState, type ReactNode } from "react";
import { Bookmark, MapPin, Star } from "lucide-react";
import {
  CATEGORY_LABEL_KEYS,
  DESTINATIONS,
  type Destination,
} from "@/data/destinations";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTranslation } from "@/hooks/useTranslation";
import DestinationCategories, {
  type TravelStyle,
} from "@/components/destinations/DestinationCategories";

const AlbaniaMap = dynamic(() => import("@/components/map/AlbaniaMap"), {
  ssr: false,
  loading: function MapLoading() {
    return (
      <div className="flex h-[480px] w-full items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 text-sm text-gray-500 dark:text-gray-400">
        Loading map…
      </div>
    );
  },
});

/** Renders the list fallback if Leaflet fails to load (spec 10.1). */
class MapErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s));
}

/**
 * Simplified explore map (spec 10.1/10.2): a single map showing only
 * destination pins to visit, with a lightweight travel-style quick-pick
 * above it. No layer switcher, filter bar, or option panels sit on top
 * of the map itself — those live in the results list below instead.
 */
export default function MapSection() {
  const { t } = useTranslation();
  const [style, setStyle] = useState<TravelStyle | null>(null);
  const [saved, setSaved] = useLocalStorage<string[]>("vf-saved-places", []);
  const geo = useGeolocation();

  const userLat = geo.status === "success" && geo.coords ? geo.coords.latitude : null;
  const userLng = geo.status === "success" && geo.coords ? geo.coords.longitude : null;
  const userPos = useMemo(
    () => (userLat !== null && userLng !== null ? { lat: userLat, lng: userLng } : null),
    [userLat, userLng]
  );

  const destinations = useMemo(() => {
    return DESTINATIONS.filter((d) => (style ? d.styles.includes(style) : true));
  }, [style]);

  const toggleSave = (id: string) =>
    setSaved((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  const pickStyle = (next: TravelStyle) => {
    setStyle((prev) => (prev === next ? null : next));
  };

  const listFallback = (
    <div>
      <p className="rounded-xl border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/30 p-3 text-sm text-amber-900 dark:text-amber-200">
        {t("map.listFallback")}
      </p>
      <DestinationList
        destinations={destinations}
        saved={saved}
        onToggleSave={toggleSave}
        userPos={userPos}
      />
    </div>
  );

  return (
    <div>
      <DestinationCategories active={style} onPick={pickStyle} />

      <div className="mt-6">
        <MapErrorBoundary fallback={listFallback}>
          <AlbaniaMap
            layer="explore"
            destinations={destinations}
            saved={saved}
            onToggleSave={toggleSave}
            userPos={userPos}
          />
        </MapErrorBoundary>
      </div>

      <p className="mt-4 text-xs text-gray-500 dark:text-gray-400" aria-live="polite">
        {t("map.resultsCount", { n: destinations.length })}
      </p>
      <DestinationList
        destinations={destinations}
        saved={saved}
        onToggleSave={toggleSave}
        userPos={userPos}
      />
    </div>
  );
}

function DestinationList({
  destinations,
  saved,
  onToggleSave,
  userPos,
}: {
  destinations: Destination[];
  saved: string[];
  onToggleSave: (id: string) => void;
  userPos: { lat: number; lng: number } | null;
}) {
  const { t } = useTranslation();
  return (
    <ul className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {destinations.map((d) => (
        <li
          key={d.id}
          className="flex flex-col overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={d.image}
            alt={d.name}
            loading="lazy"
            className="h-28 w-full object-cover"
          />
          <div className="flex flex-1 flex-col p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-gray-900 dark:text-gray-50">{d.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t(CATEGORY_LABEL_KEYS[d.category])}</p>
            </div>
            <button
              type="button"
              aria-pressed={saved.includes(d.id)}
              aria-label={saved.includes(d.id) ? t("map.removeFavorite") : t("map.saveFavorite")}
              onClick={() => onToggleSave(d.id)}
              className={`rounded-full p-1.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                saved.includes(d.id)
                  ? "bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400"
                  : "text-gray-400 dark:text-gray-500 hover:text-[#E60000]"
              }`}
            >
              <Bookmark
                size={16}
                fill={saved.includes(d.id) ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </button>
          </div>
          <p className="mt-1.5 flex-1 text-xs text-gray-600 dark:text-gray-300">{t(d.descKey)}</p>
          <div className="mt-2 flex items-center justify-between text-xs">
            {d.rating !== null ? (
              <span className="inline-flex items-center gap-1 text-gray-700 dark:text-gray-200">
                <Star size={12} className="fill-amber-400 text-amber-400" aria-hidden="true" />
                {d.rating.toFixed(1)}
              </span>
            ) : (
              <span />
            )}
            <span className="inline-flex items-center gap-2">
              {userPos && (
                <span className="text-gray-400 dark:text-gray-500">
                  {t("map.distanceKm", { km: haversineKm(userPos, d).toFixed(0) })}
                </span>
              )}
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${d.lat},${d.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-semibold text-gray-700 dark:text-gray-200 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
              >
                <MapPin size={12} aria-hidden="true" />
                {t("common.directions")}
              </a>
            </span>
          </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
