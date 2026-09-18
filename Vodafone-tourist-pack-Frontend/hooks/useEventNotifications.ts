"use client";

import { useMemo } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useLocalStorage } from "@/hooks/useLocalStorage";

const READ_KEY = "vf-read-events";

/**
 * Shared read/unread state for the events notification bell + sliding panel
 * + toast stack, so all three stay in sync off one localStorage key.
 */
export function useEventNotifications() {
  const { payload, status } = useEvents();
  const [readIds, setReadIds, hydrated] = useLocalStorage<string[]>(READ_KEY, []);

  const events = useMemo(() => {
    const list = payload?.events ?? [];
    return [...list].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
    );
  }, [payload]);

  const unread = useMemo(
    () => events.filter((event) => !readIds.includes(event.id)),
    [events, readIds]
  );

  const markRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markAllRead = () => {
    setReadIds(events.map((event) => event.id));
  };

  return {
    events,
    unread,
    readIds,
    markRead,
    markAllRead,
    hydrated,
    status,
    source: payload?.source ?? null,
  };
}
