/**
 * Vodafone store layer (spec 10.1 C).
 * Placeholder entries — addresses/hours should be verified against
 * official Vodafone Albania store data before production use.
 */
export interface VodafoneStore {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  openingHours: string | null; // null = not verified
  phone: string | null; // null = not verified
}

export const VODAFONE_STORES: VodafoneStore[] = [
  { id: "tirana-center", name: "Vodafone Store Tirana Center", address: "Bulevardi Dëshmorët e Kombit, Tirana", lat: 41.3266, lng: 19.8190, openingHours: "Mon–Sat 09:00–20:00", phone: "+355 4 0000 201" },
  { id: "tirana-east", name: "Vodafone Store TEG", address: "Tirana East Gate, Tirana", lat: 41.3050, lng: 19.8880, openingHours: "Mon–Sun 10:00–22:00", phone: null },
  { id: "durres", name: "Vodafone Store Durrës", address: "Rruga Aleksandër Goga, Durrës", lat: 41.3210, lng: 19.4450, openingHours: "Mon–Sat 09:00–19:00", phone: null },
  { id: "vlore", name: "Vodafone Store Vlorë", address: "Bulevardi Ismail Qemali, Vlorë", lat: 40.4650, lng: 19.4890, openingHours: "Mon–Sat 09:00–19:00", phone: null },
  { id: "saranda", name: "Vodafone Store Sarandë", address: "Rruga Skënderbeu, Sarandë", lat: 39.8749, lng: 20.0070, openingHours: "Mon–Sat 09:00–19:00", phone: null },
  { id: "shkoder", name: "Vodafone Store Shkodër", address: "Rruga 13 Dhjetori, Shkodër", lat: 42.0680, lng: 19.5120, openingHours: "Mon–Sat 09:00–19:00", phone: null },
];
