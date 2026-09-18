/**
 * Events domain (spec 10.3): internal Event type + SerpAPI normalization.
 * Server route: app/api/events/route.ts. Fallback: data/events.json.
 */
export interface TouristEvent {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  city: string;
  startsAt: string; // ISO date/time (may be date-only)
  endsAt: string | null;
  category: string;
  source: string;
  detailsUrl: string | null;
  lat: number | null;
  lng: number | null;
  status: "confirmed" | "fallback";
  lastUpdated: string;
}

export interface EventsPayload {
  events: TouristEvent[];
  source: "live" | "fallback";
  updatedAt: string;
}

/** Minimal shape of a SerpAPI google_events result item. */
export interface SerpApiEvent {
  title?: string;
  description?: string;
  link?: string;
  thumbnail?: string;
  date?: { start_date?: string; when?: string };
  address?: string[];
  venue?: { name?: string };
  event_location_map?: { link?: string };
}

const KNOWN_CITIES = [
  "Tirana", "Durrës", "Vlorë", "Sarandë", "Berat", "Shkodër",
  "Gjirokastër", "Korçë", "Ksamil", "Himarë", "Pogradec", "Krujë",
];

function guessCity(address: string[] | undefined): string {
  const joined = (address ?? []).join(", ");
  for (const city of KNOWN_CITIES) {
    if (joined.toLowerCase().includes(city.toLowerCase())) return city;
  }
  return "Albania";
}

/**
 * SerpAPI often returns human dates ("Jul 20", "Today"); when parsing
 * fails we anchor the event to today so "Today/This week" filters work.
 */
function parseStart(date: SerpApiEvent["date"]): string {
  const raw = date?.start_date ?? "";
  const withYear = `${raw} ${new Date().getFullYear()}`;
  const parsed = new Date(withYear);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();
  return new Date().toISOString();
}

export function normalizeSerpApiEvents(items: SerpApiEvent[]): TouristEvent[] {
  const now = new Date().toISOString();
  return items.map((item, index) => ({
    id: `serp-${index}-${(item.title ?? "event").slice(0, 24).replace(/\W+/g, "-").toLowerCase()}`,
    title: item.title ?? "Event",
    description: item.description ?? "",
    image: item.thumbnail ?? null,
    location: item.venue?.name ?? (item.address ?? []).join(", "),
    city: guessCity(item.address),
    startsAt: parseStart(item.date),
    endsAt: null,
    category: "event",
    source: "serpapi-google-events",
    detailsUrl: item.link ?? null,
    lat: null,
    lng: null,
    status: "confirmed",
    lastUpdated: now,
  }));
}
