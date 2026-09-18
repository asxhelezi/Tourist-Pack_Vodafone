/**
 * Coverage layer (spec 10.1 B).
 * Illustrative coverage data, not official measurements.
 * Replace with an approved Vodafone coverage source before production.
 */
export type CoverageLevel = "excellent" | "good" | "limited";

export interface CoverageRegion {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radiusMeters: number;
  level: CoverageLevel;
  technologies: string[]; // e.g. ["5G", "4G"]
  funFactKey: string;
}

export const COVERAGE_LAST_UPDATED = "2026-07-01";

export const COVERAGE_REGIONS: CoverageRegion[] = [
  { id: "tirana", name: "Tirana", lat: 41.3275, lng: 19.8187, radiusMeters: 16000, level: "excellent", technologies: ["5G", "4G"], funFactKey: "coverage.factTirana" },
  { id: "durres", name: "Durrës", lat: 41.3231, lng: 19.4414, radiusMeters: 12000, level: "excellent", technologies: ["5G", "4G"], funFactKey: "coverage.factDurres" },
  { id: "vlore", name: "Vlorë", lat: 40.4661, lng: 19.4914, radiusMeters: 12000, level: "good", technologies: ["4G"], funFactKey: "coverage.factVlore" },
  { id: "saranda", name: "Sarandë", lat: 39.8756, lng: 20.0053, radiusMeters: 10000, level: "good", technologies: ["4G"], funFactKey: "coverage.factSaranda" },
  { id: "riviera", name: "Albanian Riviera", lat: 40.1400, lng: 19.6500, radiusMeters: 18000, level: "good", technologies: ["4G"], funFactKey: "coverage.factRiviera" },
  { id: "shkoder", name: "Shkodër", lat: 42.0683, lng: 19.5126, radiusMeters: 12000, level: "good", technologies: ["4G"], funFactKey: "coverage.factShkoder" },
  { id: "berat", name: "Berat", lat: 40.7058, lng: 19.9522, radiusMeters: 9000, level: "good", technologies: ["4G"], funFactKey: "coverage.factBerat" },
  { id: "alps", name: "Albanian Alps (Theth/Valbona)", lat: 42.4200, lng: 19.8300, radiusMeters: 20000, level: "limited", technologies: ["4G", "3G"], funFactKey: "coverage.factAlps" },
];

export const COVERAGE_COLORS: Record<CoverageLevel, string> = {
  excellent: "#15803d",
  good: "#f59e0b",
  limited: "#9ca3af",
};

export const COVERAGE_LABEL_KEYS: Record<CoverageLevel, string> = {
  excellent: "map.coverageExcellent",
  good: "map.coverageGood",
  limited: "map.coverageLimited",
};
