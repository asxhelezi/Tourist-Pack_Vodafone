/**
 * Central media registry — the one place that lists every image asset used
 * across the project, and where it physically lives under /public/assets.
 *
 * Folder layout:
 *   branding/     logo, welcome illustration, other brand-owned art
 *   destinations/ one generated placeholder "photo" per destination (see
 *                 scripts/generate-destination-art.mjs) — swap for real
 *                 photography later; nothing in the app needs to change
 *                 since components read from this registry
 *   events/       imagery for SerpAPI / local events (populated at runtime,
 *                 falls back to null → EventCard renders a text-only card)
 *   packs/        artwork for tourist packs, if/when packs get imagery
 *   icons/        static icon assets that aren't covered by lucide-react
 *   backgrounds/  full-bleed section backgrounds
 *   placeholders/ generic "photo coming soon" fallbacks used when a real
 *                 asset for a category above isn't available yet
 */
import { DESTINATIONS } from "@/data/destinations";

export const BRAND_ASSETS = {
  logo: "/assets/branding/logo.webp",
  welcomeIllustration: "/assets/branding/welcome-albania.png",
} as const;

export const PLACEHOLDER_ASSETS = {
  destination: "/assets/placeholders/destination-placeholder.svg",
} as const;

/** destinationId -> placeholder image path (falls back to a generic "coming soon" graphic if missing). */
export const DESTINATION_IMAGES: Record<string, string> = Object.fromEntries(
  DESTINATIONS.map((d) => [d.id, d.image])
);

export function destinationImage(id: string): string {
  return DESTINATION_IMAGES[id] ?? PLACEHOLDER_ASSETS.destination;
}
