import type { PaymentMethod } from "@/components/activation/PaymentMethodPicker";
import type { TranslateFn } from "@/context/LanguageContext";

export type ValidationField = "firstName" | "lastName" | "username" | "email" | "paymentDetails";
export type FieldErrors = Partial<Record<ValidationField, string>>;

type Translate = TranslateFn;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
/** Unicode letters + spaces/hyphens/apostrophes, requiring at least one letter. */
const NAME_RE = /^(?=.*\p{L})[\p{L}\s'-]+$/u;
const USERNAME_RE = /^[a-zA-Z0-9_.]+$/;
const CARD_RE = /^\d{16}$/;
const MOBILE_WALLET_RE = /^\d{8,15}$/;

/**
 * Not a whitelist — any real domain (business, university, country-specific
 * provider, ...) still passes. This is only a reference set for catching
 * near-miss typos of the biggest global providers (e.g. "gmail.vom"),
 * which the base EMAIL_RE can't distinguish from a real, unusual TLD.
 */
const COMMON_EMAIL_DOMAINS = [
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "yahoo.co.uk",
  "icloud.com",
  "outlook.com",
  "hotmail.com",
  "hotmail.co.uk",
  "live.com",
  "msn.com",
  "aol.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
  "me.com",
];

function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () =>
    new Array<number>(b.length + 1).fill(0)
  );
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

/** Only flags genuinely close misspellings — short domains need an exact-ish match. */
function findLikelyDomainTypo(domain: string): string | null {
  const lower = domain.toLowerCase();
  if (COMMON_EMAIL_DOMAINS.includes(lower)) return null;

  let best: string | null = null;
  let bestDistance = Infinity;
  for (const known of COMMON_EMAIL_DOMAINS) {
    const maxDistance = known.length <= 6 ? 1 : 2;
    if (Math.abs(lower.length - known.length) > maxDistance) continue;
    const distance = levenshtein(lower, known);
    if (distance <= maxDistance && distance < bestDistance) {
      best = known;
      bestDistance = distance;
    }
  }
  return best;
}

function checkDomainTypo(email: string, t: Translate): string | null {
  const domain = email.slice(email.lastIndexOf("@") + 1);
  const suggestion = findLikelyDomainTypo(domain);
  return suggestion ? t("validation.emailDomainTypo", { suggestion }) : null;
}

export function validateName(value: string, t: Translate): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("common.requiredFields");
  if (trimmed.length < 2) return t("validation.nameTooShort");
  if (!NAME_RE.test(trimmed)) return t("validation.nameInvalidChars");
  return null;
}

export function validateUsername(value: string, t: Translate): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("common.requiredFields");
  if (trimmed.length < 3 || trimmed.length > 30) return t("validation.usernameTooShort");
  if (!USERNAME_RE.test(trimmed)) return t("validation.usernameInvalidChars");
  return null;
}

export function validateEmail(value: string, t: Translate): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("common.requiredFields");
  if (!EMAIL_RE.test(trimmed)) return t("validation.invalidEmail");
  return checkDomainTypo(trimmed, t);
}

/**
 * `paymentDetails` means something different per payment method: a card
 * number, a PayPal email, or a mobile wallet number. `method` is nullable
 * only because callers may reach this before a method is picked.
 */
export function validatePaymentDetails(
  value: string,
  method: PaymentMethod | null,
  t: Translate
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return t("common.requiredFields");

  if (method === "card") {
    const digits = trimmed.replace(/[\s-]/g, "");
    return CARD_RE.test(digits) ? null : t("validation.invalidCardNumber");
  }
  if (method === "paypal") {
    if (!EMAIL_RE.test(trimmed)) return t("validation.invalidPaypalEmail");
    return checkDomainTypo(trimmed, t);
  }
  if (method === "mobileWallet") {
    const digits = trimmed.replace(/[\s-]/g, "");
    return MOBILE_WALLET_RE.test(digits) ? null : t("validation.invalidMobileWallet");
  }
  return null;
}
