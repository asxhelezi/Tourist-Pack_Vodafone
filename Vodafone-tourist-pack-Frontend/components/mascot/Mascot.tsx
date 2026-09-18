"use client";

import { useEffect, useRef, useState } from "react";
import ChatbotPanel from "@/components/chatbot/ChatbotPanel";
import { usePack } from "@/context/PackContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

const BUBBLE_MS = 6000;

/**
 * Ambient Vodafone guide mascot (spec 12.1): speech-mark-inspired SVG,
 * bottom-right, subtle reactions, never opens the chat by itself.
 * Custom event "vf-mascot-say" (detail: mascot message key suffix) lets
 * other components trigger contextual hints (badge, embassy, …).
 */
export default function Mascot() {
  const { t } = useTranslation();
  const { stage } = usePack();
  const reducedMotion = useReducedMotion();
  const [chatOpen, setChatOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const saidRef = useRef<Set<string>>(new Set());
  const hideTimer = useRef<number | null>(null);

  // Show a bubble once per session per key; auto-hide after a few seconds.
  const say = (key: string, once = true) => {
    if (once && saidRef.current.has(key)) return;
    saidRef.current.add(key);
    setMessage(key);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setMessage(null), BUBBLE_MS);
  };
  const sayRef = useRef(say);
  sayRef.current = say;

  // Pack selected / activated.
  useEffect(() => {
    if (stage === "chosen" || stage === "pendingScan" || stage === "activated") {
      sayRef.current("mascot.greatChoice", false);
    }
  }, [stage]);

  // Offline → point to offline kit.
  useEffect(() => {
    const onOffline = () => sayRef.current("mascot.offline", false);
    window.addEventListener("offline", onOffline);
    return () => window.removeEventListener("offline", onOffline);
  }, []);

  // Contextual triggers from other components (badge, embassy…).
  useEffect(() => {
    const onSay = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      if (typeof key === "string") sayRef.current(`mascot.${key}`, false);
    };
    window.addEventListener("vf-mascot-say", onSay);
    return () => window.removeEventListener("vf-mascot-say", onSay);
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2">
        {/* Speech bubble */}
        {message && (
          <div
            role="status"
            className="relative max-w-[220px] rounded-2xl rounded-br-sm border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3.5 py-2.5 text-sm text-gray-800 dark:text-gray-100 shadow-lg animate-[fadeInUp_0.25s_ease-out]"
          >
            {t(message)}
          </div>
        )}

        {/* Mascot button (speech-mark motif) */}
        <button
          type="button"
          onClick={() => {
            setChatOpen((o) => !o);
            setMessage(null);
          }}
          aria-label={t("mascot.open")}
          className={`rounded-full bg-[#E60000] p-3 shadow-lg transition hover:bg-[#BD0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] focus-visible:ring-offset-2 active:scale-95 ${
            reducedMotion ? "" : "animate-[mascotBob_4s_ease-in-out_infinite]"
          }`}
        >
          {/* Vodafone speech-mark-inspired glyph */}
          <svg viewBox="0 0 32 32" width={30} height={30} aria-hidden="true">
            <circle cx="16" cy="16" r="15" fill="#ffffff" opacity="0.15" />
            <path
              d="M21.5 4.5c-3.2 0-6 1.8-7.4 4.4a7.5 7.5 0 0 0-6.6 7.5c0 4.6 3.6 8.6 8.3 8.6 5 0 9.2-4.2 9.2-9.8 0-4.8-2.2-8.9-3.5-10.7z"
              fill="#ffffff"
            />
            <circle cx="13.4" cy="17.6" r="1.6" fill="#E60000" />
            <circle cx="19" cy="17.6" r="1.6" fill="#E60000" />
            <path
              d="M13.8 21.4c1.4 1.1 3.4 1.1 4.8 0"
              stroke="#E60000"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        </button>
      </div>

      <ChatbotPanel open={chatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
}
