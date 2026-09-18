"use client";

import { CalendarDays, MapPin, X } from "lucide-react";
import { useEventNotifications } from "@/hooks/useEventNotifications";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Facebook-style notification drawer: slides in from the right, lists
 * events as notification rows (unread highlighted). Tapping one opens a
 * Google search for its exact title rather than any in-app page.
 */
export default function EventNotificationPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, localeTag } = useTranslation();
  const { events, readIds, markRead, markAllRead, status } = useEventNotifications();

  const dateFmt = new Intl.DateTimeFormat(localeTag, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const openEvent = (event: (typeof events)[number]) => {
    markRead(event.id);
    onClose();
    // Opens a search for the event's exact title rather than jumping
    // straight to a single source link.
    window.open(
      `https://www.google.com/search?q=${encodeURIComponent(event.title)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[60] overflow-hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <div
        onClick={onClose}
        aria-hidden="true"
        className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("events.notifications")}
        className={`absolute right-0 top-0 flex h-full w-full max-w-sm flex-col bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 px-4 py-3.5">
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-50">{t("events.notifications")}</h2>
          <div className="flex items-center gap-1">
            {events.length > 0 && (
              <button
                type="button"
                onClick={markAllRead}
                className="rounded-lg px-2 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
              >
                {t("events.markRead")}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label={t("common.close")}
              className="rounded-full p-1.5 text-gray-400 dark:text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <X size={17} aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {status === "loading" && (
            <div className="space-y-2 p-3" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
              ))}
            </div>
          )}

          {status !== "loading" && events.length === 0 && (
            <p className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">{t("events.noNotifications")}</p>
          )}

          <ul>
            {events.map((event) => {
              const isUnread = !readIds.includes(event.id);
              return (
                <li key={event.id}>
                  <button
                    type="button"
                    onClick={() => openEvent(event)}
                    className={`flex w-full items-start gap-3 border-b border-gray-50 dark:border-gray-800 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#E60000] ${
                      isUnread ? "bg-red-50/40 dark:bg-red-950/20" : ""
                    }`}
                  >
                    <span
                      className={`mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        isUnread ? "bg-[#E60000] text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      <CalendarDays size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block text-sm ${isUnread ? "font-semibold text-gray-900 dark:text-gray-50" : "text-gray-700 dark:text-gray-200"}`}>
                        {event.title}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin size={11} aria-hidden="true" />
                        {event.city} · {dateFmt.format(new Date(event.startsAt))}
                      </span>
                    </span>
                    {isUnread && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#E60000]" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
