"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, X } from "lucide-react";
import { refreshEvents } from "@/hooks/useEvents";
import { useEventNotifications } from "@/hooks/useEventNotifications";
import { useTranslation } from "@/hooks/useTranslation";
import type { TouristEvent } from "@/lib/events";

const REVEAL_INTERVAL_MS = 5000; // check for/pop up a new notification roughly every 5s
const REFRESH_INTERVAL_MS = 5 * 60 * 1000; // re-poll the live events feed periodically
const AUTO_DISMISS_MS = 8000;
const MAX_STACK = 3;

/**
 * Facebook-style toast stack: unseen events slide in from the right at a
 * staggered interval and auto-dismiss, instead of a single static banner.
 * Backed by the same SerpAPI-connected /api/events feed as the Events page
 * and the notification bell/drawer — clicking a toast opens the event's
 * source page (or the in-app Events page as a fallback).
 */
export default function EventNotificationStack() {
  const { t, localeTag } = useTranslation();
  const { unread, hydrated, markRead } = useEventNotifications();
  const [stack, setStack] = useState<TouristEvent[]>([]);
  const shownRef = useRef<Set<string>>(new Set());
  const timeFmt = new Intl.DateTimeFormat(localeTag, { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    const timer = window.setInterval(() => {
      refreshEvents().catch(() => undefined);
    }, REFRESH_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const timer = window.setInterval(() => {
      const next = unread.find((event) => !shownRef.current.has(event.id));
      if (!next) return;
      shownRef.current.add(next.id);
      setStack((prev) => [next, ...prev].slice(0, MAX_STACK));
    }, REVEAL_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [unread, hydrated]);

  useEffect(() => {
    if (stack.length === 0) return;
    const timers = stack.map((event) =>
      window.setTimeout(() => {
        setStack((prev) => prev.filter((item) => item.id !== event.id));
      }, AUTO_DISMISS_MS)
    );
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [stack]);

  const dismiss = (id: string) => setStack((prev) => prev.filter((event) => event.id !== id));

  const open = (event: TouristEvent) => {
    markRead(event.id);
    dismiss(event.id);
    // Opens a search for the event's exact title rather than jumping
    // straight to a single source link.
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(event.title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  if (!hydrated || stack.length === 0) return null;

  return (
    <div className="fixed right-3 top-[calc(env(safe-area-inset-top)+4.5rem)] z-[500] flex w-[92vw] max-w-sm flex-col gap-2.5 sm:right-4">
      {stack.map((event) => (
        <div
          key={event.id}
          role="status"
          className="animate-[slideInRight_0.35s_ease-out] rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 shadow-xl"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 inline-flex shrink-0 rounded-full bg-red-50 dark:bg-red-950/30 p-2 text-[#E60000] dark:text-red-400">
              <Bell size={15} aria-hidden="true" />
            </span>
            <button
              type="button"
              onClick={() => open(event)}
              className="flex-1 text-left focus-visible:outline-none"
            >
              <p className="text-sm font-bold text-gray-900 dark:text-gray-50">{event.title}</p>
              <p className="mt-0.5 text-xs text-gray-600 dark:text-gray-300">
                {event.city} · {timeFmt.format(new Date(event.startsAt))}
              </p>
            </button>
            <button
              type="button"
              onClick={() => dismiss(event.id)}
              aria-label={t("common.close")}
              className="rounded-full p-1 text-gray-400 dark:text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
