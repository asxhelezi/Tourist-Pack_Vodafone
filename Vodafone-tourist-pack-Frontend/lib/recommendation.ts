import { PACKS, type Pack } from "@/data/packs";
import { getGroupPack, type GroupPack } from "@/data/groupPacks";

/** User needs collected by the Pack Builder or Story flow. */
export interface TripNeeds {
  /** Trip length in days (upper bound of selected range). */
  days: number;
  /** Data appetite level. */
  dataLevel: "light" | "regular" | "high" | "veryhigh";
  /** Approximate minutes needed (0 = no calls). */
  minutes: number;
  travellers: number; // 1..4 (4 means 4+)
  usage?: string[];
}

export const DATA_LEVEL_GB: Record<TripNeeds["dataLevel"], number> = {
  light: 2,
  regular: 5,
  high: 12,
  veryhigh: 25,
};

export interface Recommendation {
  pack: Pack;
  groupPack: GroupPack | null;
  isGroup: boolean;
  /** Total price in ALL (group total when group). */
  priceALL: number;
  savingsALL: number;
  /** i18n reason keys with params, rendered by the UI. */
  reasons: { key: string; params?: Record<string, string | number> }[];
  compromises: { key: string; params?: Record<string, string | number> }[];
}

/**
 * Maps needs to the closest AVAILABLE pack (spec 8.2): we never invent
 * products — we score the configured catalogue and explain compromises.
 */
export function recommendPack(needs: TripNeeds): Recommendation {
  const targetGB = DATA_LEVEL_GB[needs.dataLevel];
  const candidates = PACKS.filter((p) => p.active);

  let best: Pack = candidates[0];
  let bestScore = -Infinity;

  for (const pack of candidates) {
    let score = 0;
    // Duration: must cover the trip; heavy penalty if it does not.
    if (pack.durationDays >= needs.days) {
      score += 40 - (pack.durationDays - needs.days); // prefer closest fit
    } else {
      score -= 60 + (needs.days - pack.durationDays) * 2;
    }
    // Data: prefer covering the target without huge oversize.
    if (pack.dataGB >= targetGB) {
      score += 30 - Math.min(20, (pack.dataGB - targetGB) * 1.5);
    } else {
      score -= (targetGB - pack.dataGB) * 4;
    }
    // Minutes.
    if (pack.callMinutes >= needs.minutes) {
      score += 15;
    } else {
      score -= (needs.minutes - pack.callMinutes) / 10;
    }
    // Cheaper wins ties.
    score -= pack.priceALL / 1000;

    if (score > bestScore) {
      bestScore = score;
      best = pack;
    }
  }

  const groupPack = needs.travellers >= 2 ? getGroupPack(needs.travellers) ?? null : null;
  const isGroup = needs.travellers >= 2;

  const reasons: Recommendation["reasons"] = [];
  const compromises: Recommendation["compromises"] = [];

  if (best.durationDays >= needs.days) {
    reasons.push({ key: "builder.reasonDuration", params: { days: needs.days } });
    if (best.durationDays > needs.days + 3) {
      compromises.push({ key: "builder.compromiseDuration" });
    }
  }
  if (best.dataGB >= targetGB) {
    reasons.push({ key: "builder.reasonData", params: { gb: targetGB } });
    if (best.dataGB > targetGB * 2) {
      compromises.push({ key: "builder.compromiseMoreData" });
    }
  } else {
    compromises.push({ key: "builder.compromiseMoreData" });
  }
  if (needs.minutes > 0) {
    reasons.push({
      key: "builder.reasonCalls",
      params: { min: best.callMinutes },
    });
  }
  if (isGroup && groupPack) {
    reasons.push({
      key: "builder.reasonGroup",
      params: { n: needs.travellers },
    });
  }

  const priceALL = groupPack ? groupPack.totalPriceALL : best.priceALL;
  const savingsALL = groupPack ? groupPack.savingsALL : 0;

  return { pack: best, groupPack, isGroup, priceALL, savingsALL, reasons, compromises };
}
