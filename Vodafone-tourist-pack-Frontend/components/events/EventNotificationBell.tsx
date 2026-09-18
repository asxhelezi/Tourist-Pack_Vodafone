"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { useEventNotifications } from "@/hooks/useEventNotifications";
import { useTranslation } from "@/hooks/useTranslation";
import EventNotificationPanel from "@/components/events/EventNotificationPanel";

/**
 * Replaces the plain "Events" nav link with a Facebook-style bell:
 * unread badge in the header, full notification drawer on click.
 */
export default function EventNotificationBell() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { unread } = useEventNotifications();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("events.notifications")}
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Bell size={19} aria-hidden="true" />
        {unread.length > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E60000] px-1 text-[10px] font-bold text-white">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      <EventNotificationPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
