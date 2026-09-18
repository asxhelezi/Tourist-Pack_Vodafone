export type MapLayer = "explore" | "coverage" | "stores" | "partners" | "emergency";

export const MAP_LAYERS: { id: MapLayer; labelKey: string }[] = [
  { id: "explore", labelKey: "map.layerExplore" },
  { id: "coverage", labelKey: "map.layerCoverage" },
  { id: "stores", labelKey: "map.layerStores" },
  { id: "partners", labelKey: "map.layerPartners" },
  { id: "emergency", labelKey: "map.layerEmergency" },
];
