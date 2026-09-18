"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, Send, Trash2, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { useTranslation } from "@/hooks/useTranslation";
import { getIntentById, matchIntent, type ChatAction } from "@/lib/chatbot";
import { getResponse } from "@/lib/chatbotResponses";

interface ChatMessage {
  id: number;
  role: "user" | "bot";
  text: string;
  actions?: ChatAction[];
}

const QUICK_QUESTIONS: { intentId: string; labelKey: string }[] = [
  { intentId: "packs", labelKey: "chatbot.suggestPacks" },
  { intentId: "activation", labelKey: "chatbot.suggestActivation" },
  { intentId: "emergency", labelKey: "chatbot.suggestEmergency" },
  { intentId: "destinations", labelKey: "chatbot.suggestDestinations" },
  { intentId: "events", labelKey: "chatbot.suggestEvents" },
  { intentId: "currency", labelKey: "chatbot.suggestCurrency" },
];

let nextId = 1;

/**
 * JSON chatbot (spec 12.2): compact panel on desktop, full-height sheet on
 * mobile. Session-only history, typing indicator, no fake agent status.
 */
export default function ChatbotPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { t, locale } = useTranslation();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Welcome message when first opened.
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ id: nextId++, role: "bot", text: t("chatbot.welcome") }]);
    }
    if (open) inputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ESC closes, matching the app's other dialogs.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages, typing]);

  const respond = (botText: string, actions?: ChatAction[]) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: nextId++, role: "bot", text: botText, actions },
      ]);
    }, 550);
  };

  const handleInput = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: nextId++, role: "user", text }]);
    setInput("");
    const intent = matchIntent(text, locale);
    if (intent) {
      respond(getResponse(intent.responseKey, locale), intent.suggestedActions);
    } else {
      respond(
        `${t("chatbot.noMatch")} ${getResponse("noMatchExtra", locale)} ${t("chatbot.supportLine")}`,
        [
          { type: "call", value: "140", labelKey: "emergency.vodafoneSupport" },
          { type: "scroll", value: "support", labelKey: "chatbot.suggestEmergency" },
        ]
      );
    }
  };

  const askIntent = (intentId: string, label: string) => {
    const intent = getIntentById(intentId);
    if (!intent) return;
    setMessages((prev) => [...prev, { id: nextId++, role: "user", text: label }]);
    respond(getResponse(intent.responseKey, locale), intent.suggestedActions);
  };

  const runAction = (action: ChatAction) => {
    if (action.type === "call") {
      window.location.href = `tel:${action.value}`;
    } else {
      onClose();
      document.getElementById(action.value)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const clearChat = () => {
    setMessages([{ id: nextId++, role: "bot", text: t("chatbot.welcome") }]);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label={t("chatbot.title")}
      className="fixed inset-x-0 bottom-0 z-50 flex h-[85dvh] flex-col rounded-t-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-2xl sm:inset-x-auto sm:bottom-24 sm:right-4 sm:h-[540px] sm:w-96 sm:rounded-2xl"
    >
      {/* Header */}
      <header className="flex items-center gap-2 rounded-t-2xl bg-[#E60000] px-4 py-3 text-white">
        <Bot size={18} aria-hidden="true" />
        <span className="flex-1 text-sm font-bold">{t("chatbot.title")}</span>
        <button
          type="button"
          onClick={clearChat}
          aria-label={t("chatbot.clear")}
          title={t("chatbot.clear")}
          className="rounded-full p-1.5 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <Trash2 size={15} aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label={t("common.close")}
          className="rounded-full p-1.5 transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </header>

      {/* Messages */}
      <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm ${
                m.role === "user"
                  ? "rounded-br-sm bg-[#E60000] text-white"
                  : "rounded-bl-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
              }`}
            >
              <p className="whitespace-pre-line">{m.text}</p>
              {m.actions && m.actions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.actions.map((a) => (
                    <button
                      key={`${a.type}-${a.value}-${a.labelKey}`}
                      type="button"
                      onClick={() => runAction(a)}
                      className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-semibold text-gray-800 dark:text-gray-100 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
                    >
                      {a.type === "call" ? `📞 ${t(a.labelKey)} ${a.value}` : t(a.labelKey)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {typing && (
          <p className="text-xs text-gray-400 dark:text-gray-500" role="status">
            {t("chatbot.typing")}
          </p>
        )}
      </div>

      {/* Quick questions */}
      <div className="border-t border-gray-100 dark:border-gray-800 px-4 pt-2">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
          {t("chatbot.quickQuestions")}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {QUICK_QUESTIONS.map(({ intentId, labelKey }) => (
            <button
              key={intentId}
              type="button"
              onClick={() => askIntent(intentId, t(labelKey))}
              className="rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-2.5 py-1 text-xs font-semibold text-gray-700 dark:text-gray-200 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <form
        className="flex items-center gap-2 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          handleInput(input);
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("chatbot.placeholder")}
          aria-label={t("chatbot.placeholder")}
          className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm shadow-sm focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30"
        />
        <button
          type="submit"
          aria-label={t("chatbot.send")}
          className="rounded-xl bg-[#E60000] p-2.5 text-white transition hover:bg-[#BD0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] focus-visible:ring-offset-2 disabled:opacity-50"
          disabled={!input.trim()}
        >
          <Send size={16} aria-hidden="true" />
        </button>
      </form>
      <p className="px-4 pb-2 text-center text-[11px] text-gray-400 dark:text-gray-500">
        <Badge tone="gray">{t("chatbot.demoNote")}</Badge>
      </p>
    </div>
  );
}
