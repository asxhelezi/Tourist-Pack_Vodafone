import { DATA_LEVEL_GB, type TripNeeds } from "@/lib/recommendation";
import type { Pack } from "@/data/packs";

export interface FitResult {
  /** 0–100 */
  score: number;
  labelKey: "fit.excellent" | "fit.good" | "fit.partial";
}

/**
 * Transparent fit score (spec 8.6): compares user needs with the
 * recommended pack across duration, data, calls and group size.
 * Not an official or scientific rating.
 */
export function calculateFitScore(needs: TripNeeds, pack: Pack): FitResult {
  const targetGB = DATA_LEVEL_GB[needs.dataLevel];

  // Duration (35 pts): full points if pack covers trip with little excess.
  let duration: number;
  if (pack.durationDays >= needs.days) {
    const excess = pack.durationDays - needs.days;
    duration = 35 - Math.min(10, excess);
  } else {
    duration = Math.max(0, 35 - (needs.days - pack.durationDays) * 5);
  }

  // Data (35 pts).
  let data: number;
  if (pack.dataGB >= targetGB) {
    const ratio = pack.dataGB / targetGB;
    data = ratio <= 2 ? 35 : 28;
  } else {
    data = Math.max(0, 35 * (pack.dataGB / targetGB));
  }

  // Calls (20 pts).
  const calls =
    needs.minutes === 0
      ? 20
      : Math.min(20, 20 * (pack.callMinutes / needs.minutes));

  // Group (10 pts): group pricing exists for 2–3 travellers.
  const group =
    needs.travellers === 1 || needs.travellers <= 3 ? 10 : 6;

  const score = Math.round(Math.min(100, duration + data + calls + group));

  const labelKey =
    score >= 85 ? "fit.excellent" : score >= 65 ? "fit.good" : "fit.partial";

  return { score, labelKey };
}
