import { NextResponse } from "next/server";
import fallbackData from "@/data/events.json";
import {
  normalizeSerpApiEvents,
  type EventsPayload,
  type SerpApiEvent,
  type TouristEvent,
} from "@/lib/events";

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 min — respects SerpAPI limits

let cache: { payload: EventsPayload; expiresAt: number } | null = null;

interface FallbackEvent {
  id: string;
  title: string;
  description: string;
  image: string | null;
  location: string;
  city: string;
  dayOffset: number;
  time: string;
  category: string;
  source: string;
  detailsUrl: string | null;
  lat: number | null;
  lng: number | null;
  status: string;
}

function buildFallback(): EventsPayload {
  const now = new Date();
  const events: TouristEvent[] = (fallbackData.events as FallbackEvent[]).map(
    (e) => {
      const [hours, minutes] = e.time.split(":").map(Number);
      const start = new Date(now);
      start.setDate(start.getDate() + e.dayOffset);
      start.setHours(hours, minutes, 0, 0);
      return {
        id: e.id,
        title: e.title,
        description: e.description,
        image: e.image,
        location: e.location,
        city: e.city,
        startsAt: start.toISOString(),
        endsAt: null,
        category: e.category,
        source: e.source,
        detailsUrl: e.detailsUrl,
        lat: e.lat,
        lng: e.lng,
        status: "fallback",
        lastUpdated: now.toISOString(),
      };
    }
  );
  return { events, source: "fallback", updatedAt: now.toISOString() };
}

async function fetchLive(apiKey: string): Promise<EventsPayload | null> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google_events");
  url.searchParams.set("q", "events in Albania");
  url.searchParams.set("hl", "en");
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) return null;
  const data = (await response.json()) as { events_results?: SerpApiEvent[] };
  if (!Array.isArray(data.events_results) || data.events_results.length === 0) {
    return null;
  }
  return {
    events: normalizeSerpApiEvents(data.events_results),
    source: "live",
    updatedAt: new Date().toISOString(),
  };
}

export async function GET() {
  if (cache && cache.expiresAt > Date.now()) {
    return NextResponse.json(cache.payload);
  }

  let payload: EventsPayload | null = null;
  const apiKey = process.env.SERPAPI_API_KEY;
  if (apiKey) {
    try {
      payload = await fetchLive(apiKey);
    } catch {
      payload = null; // network/limit error — fall back below
    }
  }
  if (!payload) payload = buildFallback();

  // Cache the fallback briefly too, so its relative dates stay anchored to "today".
  cache = { payload, expiresAt: Date.now() + CACHE_TTL_MS };
  return NextResponse.json(payload, {
    headers: { "Cache-Control": "public, max-age=300" },
  });
}
