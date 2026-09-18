"use client";

import { useEffect, useState } from "react";
import type { EventsPayload } from "@/lib/events";

let cached: EventsPayload | null = null;
let inflight: Promise<EventsPayload> | null = null;
const listeners = new Set<(payload: EventsPayload) => void>();

async function fetchEvents(): Promise<EventsPayload> {
  const res = await fetch("/api/events", { cache: "no-store" });
  if (!res.ok) throw new Error(`events ${res.status}`);
  const payload = (await res.json()) as EventsPayload;
  cached = payload;
  listeners.forEach((listener) => listener(payload));
  return payload;
}

function loadEvents(): Promise<EventsPayload> {
  if (cached) return Promise.resolve(cached);
  inflight ??= fetchEvents().finally(() => {
    inflight = null;
  });
  return inflight;
}

/** Re-fetches /api/events (live SerpAPI Google Events, or fallback) and notifies every subscriber. */
export function refreshEvents(): Promise<EventsPayload> {
  return fetchEvents();
}

/** Shared events fetch (single request even with multiple consumers); supports live refresh via refreshEvents(). */
export function useEvents() {
  const [payload, setPayload] = useState<EventsPayload | null>(cached);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    cached ? "success" : "loading"
  );

  useEffect(() => {
    let alive = true;
    const onUpdate = (next: EventsPayload) => {
      if (alive) setPayload(next);
    };
    listeners.add(onUpdate);

    loadEvents()
      .then((p) => {
        if (!alive) return;
        setPayload(p);
        setStatus("success");
      })
      .catch(() => {
        if (alive) setStatus("error");
      });

    return () => {
      alive = false;
      listeners.delete(onUpdate);
    };
  }, []);

  return { payload, status };
}
