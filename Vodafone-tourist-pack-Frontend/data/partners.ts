/**
 * Partner places layer (spec 10.1 D).
 * Placeholder partner entries — replace with official partner data and
 * confirmed terms before presenting these as real partnerships.
 */
export interface PartnerPlace {
  id: string;
  name: string;
  category: "restaurant" | "museum" | "cafe" | "hotel" | "attraction";
  address: string;
  lat: number;
  lng: number;
  offerKey: string; // i18n key describing the discount/benefit
  validFrom: string; // ISO date
  validUntil: string; // ISO date
  termsUrl: string | null;
}

export const PARTNER_PLACES: PartnerPlace[] = [
  { id: "partner-cafe-tirana", name: "Café Blloku", category: "cafe", address: "Blloku, Tirana", lat: 41.3213, lng: 19.8144, offerKey: "partners.offerCoffee", validFrom: "2026-06-01", validUntil: "2026-09-30", termsUrl: null },
  { id: "partner-museum-tirana", name: "Museum Pass, Tirana", category: "museum", address: "Sheshi Skënderbej, Tirana", lat: 41.3280, lng: 19.8178, offerKey: "partners.offerMuseum", validFrom: "2026-06-01", validUntil: "2026-12-31", termsUrl: null },
  { id: "partner-restaurant-berat", name: "Restaurant Berat Old Town", category: "restaurant", address: "Mangalem, Berat", lat: 40.7070, lng: 19.9500, offerKey: "partners.offerRestaurant", validFrom: "2026-06-01", validUntil: "2026-10-31", termsUrl: null },
  { id: "partner-hotel-saranda", name: "Hotel Sarandë Bay", category: "hotel", address: "Rruga Butrinti, Sarandë", lat: 39.8700, lng: 20.0110, offerKey: "partners.offerHotel", validFrom: "2026-06-01", validUntil: "2026-09-15", termsUrl: null },
  { id: "partner-beach-ksamil", name: "Beach Club Ksamil", category: "attraction", address: "Ksamil Islands beach", lat: 39.7690, lng: 19.9970, offerKey: "partners.offerBeach", validFrom: "2026-06-15", validUntil: "2026-09-15", termsUrl: null },
];
