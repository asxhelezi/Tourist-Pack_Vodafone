"use client";

import L from "leaflet";
import { Circle, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Badge from "@/components/ui/Badge";
import {
  COVERAGE_COLORS,
  COVERAGE_LABEL_KEYS,
  COVERAGE_LAST_UPDATED,
  COVERAGE_REGIONS,
} from "@/data/coverage";
import { CATEGORY_LABEL_KEYS, type Destination } from "@/data/destinations";
import { PARTNER_PLACES } from "@/data/partners";
import { VODAFONE_STORES } from "@/data/stores";
import { useTranslation } from "@/hooks/useTranslation";
import type { MapLayer } from "@/components/map/mapTypes";

const TILE_URL =
  process.env.NEXT_PUBLIC_MAP_TILE_URL ??
  "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

const pinIcon = (color: string, ring = "#ffffff") =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:18px;height:18px;border-radius:9999px 9999px 9999px 0;transform:rotate(-45deg);background:${color};border:2.5px solid ${ring};box-shadow:0 1px 4px rgba(0,0,0,.4)"></span>`,
    iconSize: [18, 18],
    iconAnchor: [9, 18],
    popupAnchor: [0, -16],
  });

const CATEGORY_COLORS: Record<Destination["category"], string> = {
  beach: "#0ea5e9",
  mountain: "#16a34a",
  castle: "#a855f7",
  museum: "#f97316",
  unesco: "#eab308",
  nature: "#14b8a6",
  food: "#ef4444",
  cultural: "#6366f1",
};

function directionsUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
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

export interface AlbaniaMapProps {
  layer: MapLayer;
  destinations: Destination[];
  saved: string[];
  onToggleSave: (id: string) => void;
  userPos: { lat: number; lng: number } | null;
}

/** Client-only Leaflet map with 5 switchable layers (spec 10.1). */
export default function AlbaniaMap({
  layer,
  destinations,
  saved,
  onToggleSave,
  userPos,
}: AlbaniaMapProps) {
  const { t, localeTag } = useTranslation();
  const dateFmt = new Intl.DateTimeFormat(localeTag, { dateStyle: "medium" });

  const popupLink =
    "inline-flex items-center gap-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-100 hover:border-[#E60000] hover:text-[#E60000]";

  return (
    <MapContainer
      center={[40.9, 19.9]}
      zoom={7}
      scrollWheelZoom={false}
      className="z-0 h-[480px] w-full rounded-2xl"
    >
      <TileLayer
        url={TILE_URL}
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {/* Explore layer */}
      {layer === "explore" &&
        destinations.map((d) => (
          <Marker
            key={d.id}
            position={[d.lat, d.lng]}
            icon={pinIcon(CATEGORY_COLORS[d.category])}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[240px] text-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={d.image}
                  alt={d.name}
                  className="mb-2 h-24 w-full rounded-lg object-cover"
                />
                <p className="font-bold text-gray-900 dark:text-gray-50">{d.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(CATEGORY_LABEL_KEYS[d.category])}</p>
                <p className="mt-1.5 text-xs text-gray-700 dark:text-gray-200">{t(d.descKey)}</p>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <strong>{t("map.visitorTip")}:</strong> {t(d.tipKey)}
                </p>
                {d.rating !== null && (
                  <p className="mt-1 text-xs text-gray-700 dark:text-gray-200">★ {d.rating.toFixed(1)}</p>
                )}
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <a
                    href={directionsUrl(d.lat, d.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={popupLink}
                  >
                    {t("common.directions")}
                  </a>
                  <button type="button" onClick={() => onToggleSave(d.id)} className={popupLink}>
                    {saved.includes(d.id) ? t("map.removeFavorite") : t("map.saveFavorite")}
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Coverage layer */}
      {layer === "coverage" &&
        COVERAGE_REGIONS.map((region) => (
          <Circle
            key={region.id}
            center={[region.lat, region.lng]}
            radius={region.radiusMeters}
            pathOptions={{
              color: COVERAGE_COLORS[region.level],
              fillColor: COVERAGE_COLORS[region.level],
              fillOpacity: 0.25,
              weight: 2,
            }}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[240px] text-sm">
                <p className="font-bold text-gray-900 dark:text-gray-50">{region.name}</p>
                <p className="mt-0.5 text-xs">
                  <span
                    className="mr-1 inline-block h-2.5 w-2.5 rounded-full align-middle"
                    style={{ background: COVERAGE_COLORS[region.level] }}
                  />
                  {t(COVERAGE_LABEL_KEYS[region.level])} — {t("map.technology")}:{" "}
                  {region.technologies.join(" / ")}
                </p>
                <p className="mt-1.5 text-xs text-gray-700 dark:text-gray-200">
                  <strong>{t("map.funFact")}:</strong> {t(region.funFactKey)}
                </p>
                <p className="mt-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                  {t("map.coverageDemoNote")}
                  <br />
                  {t("map.coverageLastUpdated")}: {dateFmt.format(new Date(COVERAGE_LAST_UPDATED))}
                </p>
              </div>
            </Popup>
          </Circle>
        ))}

      {/* Vodafone stores (also shown on emergency layer) */}
      {(layer === "stores" || layer === "emergency") &&
        VODAFONE_STORES.map((store) => (
          <Marker key={store.id} position={[store.lat, store.lng]} icon={pinIcon("#E60000")}>
            <Popup>
              <div className="min-w-[200px] max-w-[240px] text-sm">
                <p className="font-bold text-gray-900 dark:text-gray-50">{store.name}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{store.address}</p>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                  {store.openingHours ?? t("map.hoursUnverified")}
                </p>
                {store.phone && (
                  <p className="mt-0.5 text-xs">
                    <a href={`tel:${store.phone.replace(/\s/g, "")}`} className="text-[#E60000] dark:text-red-400">
                      {store.phone}
                    </a>
                  </p>
                )}
                {userPos && (
                  <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                    {t("map.distanceKm", {
                      km: haversineKm(userPos, store).toFixed(1),
                    })}
                  </p>
                )}
                <div className="mt-2">
                  <a
                    href={directionsUrl(store.lat, store.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={popupLink}
                  >
                    {t("common.directions")}
                  </a>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Partner places */}
      {layer === "partners" &&
        PARTNER_PLACES.map((partner) => (
          <Marker
            key={partner.id}
            position={[partner.lat, partner.lng]}
            icon={pinIcon("#111827", "#E60000")}
          >
            <Popup>
              <div className="min-w-[200px] max-w-[240px] text-sm">
                <p className="font-bold text-gray-900 dark:text-gray-50">{partner.name}</p>
                <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">{partner.address}</p>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <Badge tone="red">{t("map.partnerBadge")}</Badge>
                </div>
                <p className="mt-1.5 text-xs font-semibold text-gray-800 dark:text-gray-100">{t(partner.offerKey)}</p>
                <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                  {t("map.offerValid")}: {dateFmt.format(new Date(partner.validFrom))} –{" "}
                  {dateFmt.format(new Date(partner.validUntil))}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <a
                    href={directionsUrl(partner.lat, partner.lng)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={popupLink}
                  >
                    {t("common.directions")}
                  </a>
                  {partner.termsUrl && (
                    <a
                      href={partner.termsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={popupLink}
                    >
                      {t("partners.terms")}
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* User position (emergency layer) */}
      {layer === "emergency" && userPos && (
        <Marker position={[userPos.lat, userPos.lng]} icon={pinIcon("#2563eb")}>
          <Popup>{t("emergency.shareLocation")}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
