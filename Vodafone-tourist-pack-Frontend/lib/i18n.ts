export const LOCALES = ["en", "sq", "es", "fr", "de", "ja", "it", "cs"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  sq: "Shqip",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  ja: "日本語",
  it: "Italiano",
  cs: "Čeština",
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  sq: "🇦🇱",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  ja: "🇯🇵",
  it: "🇮🇹",
  cs: "🇨🇿",
};

export type Messages = { [key: string]: string | Messages };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/** Resolve a dotted key like "hero.title" inside a nested messages object. */
export function resolveKey(messages: Messages, key: string): string | undefined {
  let current: string | Messages | undefined = messages;
  for (const part of key.split(".")) {
    if (current === undefined || typeof current === "string") return undefined;
    current = current[part];
  }
  return typeof current === "string" ? current : undefined;
}

/** Replace {placeholders} with provided params. */
export function interpolate(
  template: string,
  params?: Record<string, string | number>
): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, name) =>
    params[name] !== undefined ? String(params[name]) : match
  );
}
