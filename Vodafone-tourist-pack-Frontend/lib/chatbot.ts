/**
 * JSON chatbot matcher (spec 12.2). No external AI:
 * 1. Normalize input.
 * 2. Map known non-English keywords (aliases) to English canonical intents.
 * 3. Match against English intent definitions (keywords + phrases).
 * 4. Return the preset response in the selected language.
 * Emergency intents always win when they match at all.
 */
import intentsData from "@/data/chatbot/intents.json";

export interface ChatAction {
  type: "call" | "scroll";
  value: string;
  labelKey: string;
}

export interface ChatIntent {
  id: string;
  priority: number;
  emergency: boolean;
  keywords: string[];
  phrases: string[];
  aliases: Record<string, string[]>;
  responseKey: string;
  suggestedActions: ChatAction[];
}

export const INTENTS: ChatIntent[] = intentsData.intents as ChatIntent[];

/** Lowercase + strip diacritics so "urgjencë" matches "urgjence". */
export function normalize(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function scoreIntent(intent: ChatIntent, raw: string, norm: string, locale: string): number {
  let score = 0;
  for (const phrase of intent.phrases) {
    if (norm.includes(normalize(phrase))) score += 3;
  }
  for (const keyword of intent.keywords) {
    if (norm.includes(normalize(keyword))) score += 1;
  }
  const aliases = intent.aliases[locale] ?? [];
  for (const alias of aliases) {
    // Raw includes covers scripts without case/diacritics (e.g. Japanese).
    if (norm.includes(normalize(alias)) || raw.includes(alias)) score += 1;
  }
  return score;
}

export function matchIntent(input: string, locale: string): ChatIntent | null {
  const raw = input.trim();
  if (!raw) return null;
  const norm = normalize(raw);

  let best: ChatIntent | null = null;
  let bestScore = 0;
  let bestEmergency = false;

  for (const intent of INTENTS) {
    const score = scoreIntent(intent, raw, norm, locale);
    if (score === 0) continue;
    const better =
      // emergency beats non-emergency regardless of score
      (intent.emergency && !bestEmergency) ||
      (intent.emergency === bestEmergency &&
        (score > bestScore ||
          (score === bestScore && (best === null || intent.priority > best.priority))));
    if (better) {
      best = intent;
      bestScore = score;
      bestEmergency = intent.emergency;
    }
  }
  return best;
}

export function getIntentById(id: string): ChatIntent | undefined {
  return INTENTS.find((i) => i.id === id);
}
