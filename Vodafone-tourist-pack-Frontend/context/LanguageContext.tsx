"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LOCALE,
  interpolate,
  isLocale,
  resolveKey,
  type Locale,
  type Messages,
} from "@/lib/i18n";

import en from "@/messages/en.json";
import sq from "@/messages/sq.json";
import es from "@/messages/es.json";
import fr from "@/messages/fr.json";
import de from "@/messages/de.json";
import ja from "@/messages/ja.json";
import it from "@/messages/it.json";
import cs from "@/messages/cs.json";

const MESSAGES: Record<Locale, Messages> = {
  en: en as Messages,
  sq: sq as Messages,
  es: es as Messages,
  fr: fr as Messages,
  de: de as Messages,
  ja: ja as Messages,
  it: it as Messages,
  cs: cs as Messages,
};

const STORAGE_KEY = "vf-lang";

export type TranslateFn = (
  key: string,
  params?: Record<string, string | number>
) => string;

interface LanguageContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslateFn;
  /** Intl-friendly locale tag, e.g. "sq-AL". */
  localeTag: string;
}

const LOCALE_TAGS: Record<Locale, string> = {
  en: "en-GB",
  sq: "sq-AL",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  ja: "ja-JP",
  it: "it-IT",
  cs: "cs-CZ",
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  // Hydration-safe: read persisted / browser language after mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored && isLocale(stored)) {
        setLocaleState(stored);
        return;
      }
      const browser = window.navigator.language.slice(0, 2).toLowerCase();
      if (isLocale(browser)) setLocaleState(browser);
    } catch {
      // storage unavailable — keep default
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const t = useCallback<TranslateFn>(
    (key, params) => {
      const value =
        resolveKey(MESSAGES[locale], key) ?? resolveKey(MESSAGES.en, key);
      if (value === undefined) return key;
      return interpolate(value, params);
    },
    [locale]
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, localeTag: LOCALE_TAGS[locale] }),
    [locale, setLocale, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
