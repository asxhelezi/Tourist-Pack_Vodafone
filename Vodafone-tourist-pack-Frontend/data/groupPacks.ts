/**
 * Group / family / friends pricing.
 * Exact example prices supplied by the project owner:
 *   1 person: 1500 ALL, 2 people: 2600 ALL, 3 people: 3900 ALL.
 * For 4+ no official price was supplied — the UI must show a clearly
 * labeled custom recommendation instead of an invented price.
 */
export interface GroupPack {
  id: string;
  people: number;
  totalPriceALL: number;
  individualReferencePriceALL: number;
  savingsALL: number;
  /** GB each person receives, based on the 14-day traveller pack. */
  dataAllocationGB: number;
  minutesAllocation: number;
}

export const INDIVIDUAL_REFERENCE_PRICE_ALL = 1500;

export const GROUP_PACKS: GroupPack[] = [
  {
    id: "group-2",
    people: 2,
    totalPriceALL: 2600,
    individualReferencePriceALL: INDIVIDUAL_REFERENCE_PRICE_ALL,
    savingsALL: 2 * INDIVIDUAL_REFERENCE_PRICE_ALL - 2600, // 400
    dataAllocationGB: 12,
    minutesAllocation: 200,
  },
  {
    id: "group-3",
    people: 3,
    totalPriceALL: 3900,
    individualReferencePriceALL: INDIVIDUAL_REFERENCE_PRICE_ALL,
    savingsALL: 3 * INDIVIDUAL_REFERENCE_PRICE_ALL - 3900, // 600
    dataAllocationGB: 12,
    minutesAllocation: 200,
  },
];

export function getGroupPack(people: number): GroupPack | undefined {
  return GROUP_PACKS.find((g) => g.people === people);
}
