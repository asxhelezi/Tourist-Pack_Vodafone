/**
 * Safety alerts (spec 9.4). Editorial alerts — replace with a real feed
 * before production. Expired alerts are filtered out by the UI.
 */
export type AlertSeverity = "info" | "caution" | "important";

export interface SafetyAlert {
  id: string;
  titleKey: string;
  bodyKey: string;
  severity: AlertSeverity;
  location: string;
  startsAt: string; // ISO
  expiresAt: string; // ISO
  source: string;
}

/**
 * These alerts use a far-future expiry so the UI always has sample
 * content. Real alerts must carry accurate expiry timestamps.
 */
export const SAFETY_ALERTS: SafetyAlert[] = [
  {
    id: "festival-downtown",
    titleKey: "safety.alertFestivalTitle",
    bodyKey: "safety.alertFestivalBody",
    severity: "info",
    location: "Tirana",
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2030-01-01T00:00:00Z",
    source: "editorial",
  },
  {
    id: "traffic-road",
    titleKey: "safety.alertTrafficTitle",
    bodyKey: "safety.alertTrafficBody",
    severity: "caution",
    location: "SH8 Vlorë–Sarandë",
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2030-01-01T00:00:00Z",
    source: "editorial",
  },
  {
    id: "crowded-places",
    titleKey: "safety.alertBelongingsTitle",
    bodyKey: "safety.alertBelongingsBody",
    severity: "important",
    location: "Tirana center",
    startsAt: "2026-01-01T00:00:00Z",
    expiresAt: "2030-01-01T00:00:00Z",
    source: "editorial",
  },
];

export function getActiveAlerts(now = new Date()): SafetyAlert[] {
  return SAFETY_ALERTS.filter(
    (a) => new Date(a.startsAt) <= now && new Date(a.expiresAt) > now
  );
}
