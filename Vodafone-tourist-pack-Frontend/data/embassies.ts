/**
 * Embassy directory data (spec 9.2).
 * Placeholder entries: addresses/phones/hours are structured for verified
 * official data. Replace each entry after verification against official
 * government sources.
 */
export interface Embassy {
  id: string;
  countryCode: string; // ISO 3166-1 alpha-2
  countryNameKey: string;
  flag: string;
  officeName: string;
  address: string;
  phone: string;
  emergencyPhone: string | null;
  website: string;
  mapQuery: string;
  openingHours: string;
  lostPassportSupport: boolean;
  source: string;
  lastChecked: string; // ISO date
}

export const EMBASSIES: Embassy[] = [
  {
    id: "it",
    countryCode: "IT",
    countryNameKey: "countries.italy",
    flag: "🇮🇹",
    officeName: "Embassy of Italy in Tirana",
    address: "Rruga Papa Gjon Pali II, Tirana",
    phone: "+355 4 0000 001",
    emergencyPhone: "+355 4 0000 101",
    website: "https://ambtirana.esteri.it",
    mapQuery: "Italian Embassy Tirana",
    openingHours: "Mon–Fri 09:00–17:00",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "us",
    countryCode: "US",
    countryNameKey: "countries.usa",
    flag: "🇺🇸",
    officeName: "Embassy of the United States in Tirana",
    address: "Rruga Stavro Vinjau 14, Tirana",
    phone: "+355 4 0000 002",
    emergencyPhone: "+355 4 0000 102",
    website: "https://al.usembassy.gov",
    mapQuery: "US Embassy Tirana",
    openingHours: "Mon–Fri 08:00–16:30",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "de",
    countryCode: "DE",
    countryNameKey: "countries.germany",
    flag: "🇩🇪",
    officeName: "Embassy of Germany in Tirana",
    address: "Rruga Skënderbej 8, Tirana",
    phone: "+355 4 0000 003",
    emergencyPhone: "+355 4 0000 103",
    website: "https://tirana.diplo.de",
    mapQuery: "German Embassy Tirana",
    openingHours: "Mon–Fri 09:00–17:00",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "fr",
    countryCode: "FR",
    countryNameKey: "countries.france",
    flag: "🇫🇷",
    officeName: "Embassy of France in Tirana",
    address: "Rruga Lek Dukagjini 2, Tirana",
    phone: "+355 4 0000 004",
    emergencyPhone: null,
    website: "https://al.ambafrance.org",
    mapQuery: "French Embassy Tirana",
    openingHours: "Mon–Fri 09:00–16:00",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "gb",
    countryCode: "GB",
    countryNameKey: "countries.uk",
    flag: "🇬🇧",
    officeName: "British Embassy Tirana",
    address: "Rruga Skënderbej 12, Tirana",
    phone: "+355 4 0000 005",
    emergencyPhone: "+355 4 0000 105",
    website: "https://www.gov.uk/world/organisations/british-embassy-tirana",
    mapQuery: "British Embassy Tirana",
    openingHours: "Mon–Fri 09:00–17:00",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "es",
    countryCode: "ES",
    countryNameKey: "countries.spain",
    flag: "🇪🇸",
    officeName: "Embassy of Spain in Tirana",
    address: "Rruga Skënderbej 43, Tirana",
    phone: "+355 4 0000 006",
    emergencyPhone: null,
    website: "https://www.exteriores.gob.es/embajadas/tirana",
    mapQuery: "Spanish Embassy Tirana",
    openingHours: "Mon–Fri 09:00–16:30",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "jp",
    countryCode: "JP",
    countryNameKey: "countries.japan",
    flag: "🇯🇵",
    officeName: "Embassy of Japan in Tirana",
    address: "Rruga e Elbasanit, Tirana",
    phone: "+355 4 0000 007",
    emergencyPhone: null,
    website: "https://www.al.emb-japan.go.jp",
    mapQuery: "Japanese Embassy Tirana",
    openingHours: "Mon–Fri 09:00–17:00",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
  {
    id: "cz",
    countryCode: "CZ",
    countryNameKey: "countries.czechia",
    flag: "🇨🇿",
    officeName: "Embassy of the Czech Republic in Tirana",
    address: "Rruga Skënderbej 10, Tirana",
    phone: "+355 4 0000 008",
    emergencyPhone: null,
    website: "https://www.mzv.cz/tirana",
    mapQuery: "Czech Embassy Tirana",
    openingHours: "Mon–Fri 08:30–16:30",
    lostPassportSupport: true,
    source: "placeholder",
    lastChecked: "2026-07-01",
  },
];
