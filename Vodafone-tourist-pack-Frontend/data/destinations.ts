/**
 * Explore-layer destinations (spec 10.1 A / 10.2).
 * Names are proper nouns (not translated); descriptions and tips are i18n keys.
 * `image` points into the central media registry (see data/mediaAssets.ts /
 * public/assets/destinations) — real photography under
 * public/assets/destinations/explore, falling back to the placeholder SVG
 * artwork for the handful of destinations without a photo yet.
 */
export type DestinationCategory =
  | "beach"
  | "mountain"
  | "castle"
  | "museum"
  | "unesco"
  | "nature"
  | "food"
  | "cultural";

export interface Destination {
  id: string;
  name: string;
  category: DestinationCategory;
  /** Traveler styles this destination belongs to (spec 10.2 cards). */
  styles: ("beach" | "mountain" | "history" | "food")[];
  lat: number;
  lng: number;
  descKey: string;
  tipKey: string;
  rating: number | null;
  /** Path under /public to this destination's placeholder image. */
  image: string;
}

export const DESTINATIONS: Destination[] = [
  { id: "ksamil", name: "Ksamil", category: "beach", styles: ["beach"], lat: 39.7683, lng: 19.9986, descKey: "dest.ksamilDesc", tipKey: "dest.ksamilTip", rating: 4.8, image: "/assets/destinations/explore/ksamil.jpg" },
  { id: "dhermi", name: "Dhërmi", category: "beach", styles: ["beach"], lat: 40.1547, lng: 19.6383, descKey: "dest.dhermiDesc", tipKey: "dest.dhermiTip", rating: 4.7, image: "/assets/destinations/explore/dhermi.jpg" },
  { id: "palase", name: "Palasë", category: "beach", styles: ["beach"], lat: 40.1786, lng: 19.6169, descKey: "dest.palaseDesc", tipKey: "dest.palaseTip", rating: 4.6, image: "/assets/destinations/explore/palase.jpg" },
  { id: "jale", name: "Jalë", category: "beach", styles: ["beach"], lat: 40.1236, lng: 19.6975, descKey: "dest.jaleDesc", tipKey: "dest.jaleTip", rating: 4.6, image: "/assets/destinations/explore/jale.jpg" },
  { id: "blue-eye", name: "Syri i Kaltër (Blue Eye)", category: "nature", styles: ["beach"], lat: 39.9236, lng: 20.1911, descKey: "dest.blueEyeDesc", tipKey: "dest.blueEyeTip", rating: 4.7, image: "/assets/destinations/explore/blue-eye.jpg" },
  { id: "butrint", name: "Butrint", category: "unesco", styles: ["history"], lat: 39.7461, lng: 20.0206, descKey: "dest.butrintDesc", tipKey: "dest.butrintTip", rating: 4.9, image: "/assets/destinations/explore/butrint.jpg" },
  { id: "berat", name: "Berat", category: "unesco", styles: ["history"], lat: 40.7058, lng: 19.9522, descKey: "dest.beratDesc", tipKey: "dest.beratTip", rating: 4.8, image: "/assets/destinations/explore/berat.jpg" },
  { id: "gjirokaster", name: "Gjirokastër", category: "unesco", styles: ["history"], lat: 40.0758, lng: 20.1389, descKey: "dest.gjirokasterDesc", tipKey: "dest.gjirokasterTip", rating: 4.8, image: "/assets/destinations/explore/gjirokaster.jpg" },
  { id: "kruje", name: "Krujë", category: "castle", styles: ["history"], lat: 41.5089, lng: 19.7928, descKey: "dest.krujeDesc", tipKey: "dest.krujeTip", rating: 4.6, image: "/assets/destinations/explore/kruje.jpg" },
  { id: "rozafa", name: "Rozafa Castle, Shkodër", category: "castle", styles: ["history"], lat: 42.0465, lng: 19.4939, descKey: "dest.rozafaDesc", tipKey: "dest.rozafaTip", rating: 4.5, image: "/assets/destinations/explore/rozafa.jpg" },
  { id: "theth", name: "Theth National Park", category: "mountain", styles: ["mountain"], lat: 42.3956, lng: 19.7714, descKey: "dest.thethDesc", tipKey: "dest.thethTip", rating: 4.9, image: "/assets/destinations/explore/theth.jpg" },
  { id: "valbona", name: "Valbona Valley", category: "mountain", styles: ["mountain"], lat: 42.4453, lng: 19.8894, descKey: "dest.valbonaDesc", tipKey: "dest.valbonaTip", rating: 4.8, image: "/assets/destinations/explore/valbona.jpg" },
  { id: "llogara", name: "Llogara Pass", category: "mountain", styles: ["mountain", "beach"], lat: 40.2075, lng: 19.5806, descKey: "dest.llogaraDesc", tipKey: "dest.llogaraTip", rating: 4.7, image: "/assets/destinations/explore/llogara.jpg" },
  { id: "dajti", name: "Dajti Mountain, Tirana", category: "mountain", styles: ["mountain"], lat: 41.3606, lng: 19.9192, descKey: "dest.dajtiDesc", tipKey: "dest.dajtiTip", rating: 4.4, image: "/assets/destinations/explore/dajti.jpg" },
  { id: "national-museum", name: "National History Museum, Tirana", category: "museum", styles: ["history"], lat: 41.3286, lng: 19.8175, descKey: "dest.nationalMuseumDesc", tipKey: "dest.nationalMuseumTip", rating: 4.3, image: "/assets/destinations/explore/national-museum.jpg" },
  { id: "bunkart", name: "Bunk'Art 1, Tirana", category: "museum", styles: ["history"], lat: 41.3467, lng: 19.8858, descKey: "dest.bunkartDesc", tipKey: "dest.bunkartTip", rating: 4.6, image: "/assets/destinations/explore/bunkart.jpg" },
  { id: "pazari-ri", name: "Pazari i Ri Market, Tirana", category: "food", styles: [], lat: 41.3306, lng: 19.8236, descKey: "dest.pazariRiDesc", tipKey: "dest.pazariRiTip", rating: 4.5, image: "/assets/destinations/explore/pazari-ri.jpg" },
  { id: "korca", name: "Korça Old Bazaar", category: "food", styles: ["history"], lat: 40.6186, lng: 20.7808, descKey: "dest.korcaDesc", tipKey: "dest.korcaTip", rating: 4.5, image: "/assets/destinations/explore/korca.jpg" },

  // Added: broader geographic + category coverage (Tirana center, coastal cities, lakes, wetlands, UNESCO tentative-list ruins).
  { id: "tirana-center", name: "Skanderbeg Square, Tirana", category: "cultural", styles: ["history"], lat: 41.3275, lng: 19.8189, descKey: "dest.tiranaCenterDesc", tipKey: "dest.tiranaCenterTip", rating: 4.6, image: "/assets/destinations/explore/tirana-center.jpg" },
  { id: "durres-amphitheatre", name: "Durrës Amphitheatre", category: "cultural", styles: ["history"], lat: 41.3113, lng: 19.4425, descKey: "dest.durresDesc", tipKey: "dest.durresTip", rating: 4.4, image: "/assets/destinations/explore/durres-amphitheatre.jpg" },
  { id: "vlore-waterfront", name: "Independence Monument, Vlorë", category: "cultural", styles: ["history"], lat: 40.4666, lng: 19.4880, descKey: "dest.vloreDesc", tipKey: "dest.vloreTip", rating: 4.5, image: "/assets/destinations/explore/vlore-waterfront.jpg" },
  { id: "himare", name: "Himarë", category: "beach", styles: ["beach"], lat: 40.1019, lng: 19.7444, descKey: "dest.himareDesc", tipKey: "dest.himareTip", rating: 4.6, image: "/assets/destinations/explore/himare.jpg" },
  { id: "pogradec", name: "Lake Ohrid, Pogradec", category: "nature", styles: ["mountain"], lat: 40.9026, lng: 20.6529, descKey: "dest.pogradecDesc", tipKey: "dest.pogradecTip", rating: 4.7, image: "/assets/destinations/explore/pogradec.jpg" },
  { id: "shkoder-lake", name: "Lake Shkodër", category: "nature", styles: ["mountain"], lat: 42.1067, lng: 19.4230, descKey: "dest.shkoderLakeDesc", tipKey: "dest.shkoderLakeTip", rating: 4.6, image: "/assets/destinations/explore/shkoder-lake.jpg" },
  { id: "divjaka-karavasta", name: "Divjakë-Karavasta National Park", category: "nature", styles: ["beach"], lat: 40.9728, lng: 19.4739, descKey: "dest.divjakaDesc", tipKey: "dest.divjakaTip", rating: 4.5, image: "/assets/destinations/explore/divjaka-karavasta.jpg" },
  { id: "voskopoja", name: "Voskopojë", category: "cultural", styles: ["mountain", "history"], lat: 40.6367, lng: 20.5814, descKey: "dest.voskopojaDesc", tipKey: "dest.voskopojaTip", rating: 4.5, image: "/assets/destinations/explore/voskopoja.jpg" },
  { id: "permet", name: "Përmet", category: "cultural", styles: ["mountain", "history"], lat: 40.2333, lng: 20.3500, descKey: "dest.permetDesc", tipKey: "dest.permetTip", rating: 4.6, image: "/assets/destinations/explore/permet.jpg" },

  // Added: Beach/Mountain crossover nature spots + dedicated Food Lover picks.
  { id: "shala-river", name: "Lumi i Shalës (Shala River)", category: "nature", styles: ["beach", "mountain"], lat: 42.3500, lng: 19.7500, descKey: "dest.shalaRiverDesc", tipKey: "dest.shalaRiverTip", rating: 4.8, image: "/assets/destinations/explore/shala-river.jpg" },
  { id: "osum-canyon", name: "Kanioni i Osumit (Osum Canyon)", category: "nature", styles: ["beach", "mountain"], lat: 40.5333, lng: 20.2333, descKey: "dest.osumCanyonDesc", tipKey: "dest.osumCanyonTip", rating: 4.7, image: "/assets/destinations/explore/osum-canyon.jpg" },
  { id: "mrizi-i-zanave", name: "Mrizi i Zanave", category: "food", styles: ["food"], lat: 41.8233, lng: 19.5386, descKey: "dest.mriziIZanaveDesc", tipKey: "dest.mriziIZanaveTip", rating: 4.8, image: "/assets/destinations/explore/mrizi-i-zanave.jpg" },
  { id: "cerciz-ismet-shehu", name: "Çerçiz Ismet Shehu", category: "food", styles: ["food"], lat: 41.4500, lng: 19.9333, descKey: "dest.cercizIsmetShehuDesc", tipKey: "dest.cercizIsmetShehuTip", rating: 4.6, image: "/assets/destinations/explore/cerciz-ismet-shehu.jpg" },
  { id: "oda", name: "Oda", category: "food", styles: ["food"], lat: 41.3255, lng: 19.8200, descKey: "dest.odaDesc", tipKey: "dest.odaTip", rating: 4.5, image: "/assets/destinations/explore/oda.jpg" },
  { id: "mullixhiu", name: "Mullixhiu", category: "food", styles: ["food"], lat: 41.3128, lng: 19.8228, descKey: "dest.mullixhiuDesc", tipKey: "dest.mullixhiuTip", rating: 4.7, image: "/assets/destinations/explore/mullixhiu.jpg" },
];

export const CATEGORY_LABEL_KEYS: Record<DestinationCategory, string> = {
  beach: "map.catBeach",
  mountain: "map.catMountain",
  castle: "map.catCastle",
  museum: "map.catMuseum",
  unesco: "map.catUnesco",
  nature: "map.catNature",
  food: "map.catFood",
  cultural: "map.catCultural",
};
