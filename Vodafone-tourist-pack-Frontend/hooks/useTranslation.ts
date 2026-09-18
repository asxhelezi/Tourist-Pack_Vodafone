"use client";

import { useLanguage } from "@/context/LanguageContext";

/** Convenience hook: `const { t, locale, localeTag } = useTranslation();` */
export function useTranslation() {
  const { t, locale, localeTag, setLocale } = useLanguage();
  return { t, locale, localeTag, setLocale };
}
