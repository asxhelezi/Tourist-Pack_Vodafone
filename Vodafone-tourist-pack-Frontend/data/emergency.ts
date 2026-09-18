/**
 * Emergency contact configuration (spec 9.1).
 * These are the exact values supplied by the project owner.
 * Verify all numbers with official sources before production.
 */
export interface EmergencyNumber {
  id: string;
  labelKey: string;
  number: string;
}

export const EMERGENCY_NUMBERS: EmergencyNumber[] = [
  { id: "police", labelKey: "emergency.police", number: "129" },
  { id: "ambulance", labelKey: "emergency.ambulance", number: "127" },
  { id: "fire", labelKey: "emergency.fire", number: "128" },
  { id: "vodafone", labelKey: "emergency.vodafoneSupport", number: "140" },
  { id: "general", labelKey: "emergency.generalEmergency", number: "112" },
];

/** Taxi guidance — verify licensed operators before production. */
export const TAXI_NUMBER = { number: "+355 4 2222 555" };

/** Nearby-place search links (no map provider connected). */
export const NEARBY_SEARCHES = {
  hospital: "https://www.google.com/maps/search/hospital+near+me",
  vodafoneStore: "https://www.google.com/maps/search/vodafone+store+albania",
  taxi: "https://www.google.com/maps/search/taxi+near+me",
} as const;
