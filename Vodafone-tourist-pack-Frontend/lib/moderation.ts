/**
 * Moderation rules (spec 11.1). Configurable blocked-word list.
 * React escapes all rendered strings, so no HTML ever reaches the DOM raw;
 * these checks add content rules on top.
 */
export const BLOCKED_WORDS: string[] = [
  // configurable blocked-word list — extend for production
  "idiot",
  "stupid",
  "hate",
  "scam",
  "fraud",
];

export const TEXT_MIN_LENGTH = 20;
export const TEXT_MAX_LENGTH = 400;
export const TIP_MAX_LENGTH = 160;
export const PHOTO_MAX_MB = 2;
export const PHOTO_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type ModerationResult =
  | { ok: true }
  | { ok: false; reason: "tooShort" | "tooLong" | "blocked" };

export function moderateText(
  text: string,
  { min = TEXT_MIN_LENGTH, max = TEXT_MAX_LENGTH } = {}
): ModerationResult {
  const trimmed = text.trim();
  if (trimmed.length < min) return { ok: false, reason: "tooShort" };
  if (trimmed.length > max) return { ok: false, reason: "tooLong" };
  const lower = trimmed.toLowerCase();
  if (BLOCKED_WORDS.some((word) => lower.includes(word))) {
    return { ok: false, reason: "blocked" };
  }
  return { ok: true };
}
