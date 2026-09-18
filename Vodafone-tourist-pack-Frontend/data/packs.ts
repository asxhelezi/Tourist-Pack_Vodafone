/**
 * Central configurable pack catalogue.
 * Prices are the exact values supplied by the project owner.
 * Replace with official Vodafone data before production.
 */
export interface Pack {
  id: string;
  titleKey: string;
  subtitleKey: string;
  bestForKey: string;
  priceALL: number;
  durationDays: number;
  dataGB: number;
  callMinutes: number;
  /** null = unlimited */
  sms: number | null;
  travelerMin: number;
  travelerMax: number;
  tags: string[];
  active: boolean;
}

export const PACKS: Pack[] = [
  {
    id: "basic",
    titleKey: "packs.basicTitle",
    subtitleKey: "packs.basicSubtitle",
    bestForKey: "packs.bestForShort",
    priceALL: 500,
    durationDays: 3,
    dataGB: 2,
    callMinutes: 50,
    sms: 100,
    travelerMin: 1,
    travelerMax: 1,
    tags: ["short", "light"],
    active: true,
  },
  {
    id: "standard",
    titleKey: "packs.standardTitle",
    subtitleKey: "packs.standardSubtitle",
    bestForKey: "packs.bestForWeek",
    priceALL: 1000,
    durationDays: 7,
    dataGB: 5,
    callMinutes: 100,
    sms: null,
    travelerMin: 1,
    travelerMax: 1,
    tags: ["week", "regular"],
    active: true,
  },
  {
    id: "traveller",
    titleKey: "packs.travellerTitle",
    subtitleKey: "packs.travellerSubtitle",
    bestForKey: "packs.bestForLong",
    priceALL: 1500,
    durationDays: 14,
    dataGB: 12,
    callMinutes: 200,
    sms: null,
    travelerMin: 1,
    travelerMax: 1,
    tags: ["long", "high"],
    active: true,
  },
  {
    id: "explorer",
    titleKey: "packs.explorerTitle",
    subtitleKey: "packs.explorerSubtitle",
    bestForKey: "packs.bestForMonth",
    priceALL: 2500,
    durationDays: 30,
    dataGB: 25,
    callMinutes: 300,
    sms: null,
    travelerMin: 1,
    travelerMax: 1,
    tags: ["month", "veryhigh", "nomad"],
    active: true,
  },
];

export function getPack(id: string): Pack | undefined {
  return PACKS.find((p) => p.id === id);
}
