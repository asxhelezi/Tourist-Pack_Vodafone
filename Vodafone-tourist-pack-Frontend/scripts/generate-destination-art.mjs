// Generates one placeholder SVG "photo" per destination into
// public/assets/destinations/<id>.svg — used until real photography is
// available. Run with: node scripts/generate-destination-art.mjs
// Registry consumed by the app: data/mediaAssets.ts

import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "public", "assets", "destinations");

// Category → [gradient start, gradient end, decorative icon]
const CATEGORY_STYLE = {
  beach: { from: "#0ea5e9", to: "#67e8f9", icon: "waves" },
  mountain: { from: "#15803d", to: "#86efac", icon: "peaks" },
  castle: { from: "#7e22ce", to: "#d8b4fe", icon: "tower" },
  museum: { from: "#c2410c", to: "#fdba74", icon: "column" },
  unesco: { from: "#b45309", to: "#fde68a", icon: "column" },
  nature: { from: "#0f766e", to: "#5eead4", icon: "leaf" },
  food: { from: "#b91c1c", to: "#fca5a5", icon: "bowl" },
  cultural: { from: "#4338ca", to: "#a5b4fc", icon: "flag" },
};

const ICONS = {
  waves:
    '<path d="M40 260 Q90 230 140 260 T240 260 T340 260 T440 260 T540 260" stroke="rgba(255,255,255,.55)" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M40 300 Q90 270 140 300 T240 300 T340 300 T440 300 T540 300" stroke="rgba(255,255,255,.35)" stroke-width="10" fill="none" stroke-linecap="round"/>',
  peaks:
    '<path d="M40 300 L170 150 L240 230 L320 120 L480 300 Z" fill="rgba(255,255,255,.28)"/><path d="M120 300 L230 190 L300 260 L400 170 L560 300 Z" fill="rgba(255,255,255,.18)"/>',
  tower:
    '<rect x="270" y="120" width="60" height="150" rx="4" fill="rgba(255,255,255,.28)"/><polygon points="270,120 300,80 330,120" fill="rgba(255,255,255,.4)"/><rect x="290" y="160" width="20" height="30" fill="rgba(0,0,0,.15)"/>',
  column:
    '<g fill="rgba(255,255,255,.3)"><rect x="180" y="130" width="18" height="140"/><rect x="230" y="130" width="18" height="140"/><rect x="280" y="130" width="18" height="140"/><rect x="330" y="130" width="18" height="140"/><rect x="380" y="130" width="18" height="140"/><rect x="160" y="110" width="260" height="20"/></g>',
  leaf:
    '<path d="M300 120 C230 140 190 210 220 280 C290 300 360 260 360 190 C360 160 330 130 300 120 Z" fill="rgba(255,255,255,.3)"/><path d="M300 120 C300 190 260 250 220 280" stroke="rgba(255,255,255,.5)" stroke-width="6" fill="none" stroke-linecap="round"/>',
  bowl:
    '<path d="M210 210 h180 a90 60 0 0 1 -180 0 Z" fill="rgba(255,255,255,.3)"/><ellipse cx="300" cy="210" rx="90" ry="14" fill="rgba(255,255,255,.45)"/>',
  flag:
    '<rect x="260" y="120" width="10" height="160" fill="rgba(255,255,255,.5)"/><path d="M270 128 h90 l-24 26 24 26 h-90 Z" fill="rgba(255,255,255,.35)"/>',
};

// Mirrors data/destinations.ts (id, name, category) — keep in sync when adding destinations.
const DESTINATIONS = [
  ["ksamil", "Ksamil", "beach"],
  ["dhermi", "Dhërmi", "beach"],
  ["palase", "Palasë", "beach"],
  ["jale", "Jalë", "beach"],
  ["blue-eye", "Syri i Kaltër", "nature"],
  ["butrint", "Butrint", "unesco"],
  ["berat", "Berat", "unesco"],
  ["gjirokaster", "Gjirokastër", "unesco"],
  ["kruje", "Krujë", "castle"],
  ["rozafa", "Rozafa Castle", "castle"],
  ["theth", "Theth", "mountain"],
  ["valbona", "Valbona Valley", "mountain"],
  ["llogara", "Llogara Pass", "mountain"],
  ["dajti", "Dajti Mountain", "mountain"],
  ["national-museum", "National History Museum", "museum"],
  ["bunkart", "Bunk'Art 1", "museum"],
  ["pazari-ri", "Pazari i Ri Market", "food"],
  ["korca", "Korça Old Bazaar", "food"],
  ["tirana-center", "Skanderbeg Square", "cultural"],
  ["durres-amphitheatre", "Durrës Amphitheatre", "cultural"],
  ["vlore-waterfront", "Vlorë", "cultural"],
  ["saranda-promenade", "Sarandë", "beach"],
  ["himare", "Himarë", "beach"],
  ["pogradec", "Lake Ohrid, Pogradec", "nature"],
  ["shkoder-lake", "Lake Shkodër", "nature"],
  ["divjaka-karavasta", "Divjakë-Karavasta", "nature"],
  ["voskopoja", "Voskopojë", "cultural"],
  ["apollonia", "Apollonia", "unesco"],
  ["permet", "Përmet", "cultural"],
];

function escapeXml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function svgFor(id, name, category) {
  const style = CATEGORY_STYLE[category] ?? CATEGORY_STYLE.cultural;
  const icon = ICONS[style.icon];
  const gradId = `g-${id}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 600 375" role="img" aria-label="${escapeXml(
    name
  )}">
  <defs>
    <linearGradient id="${gradId}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${style.from}"/>
      <stop offset="100%" stop-color="${style.to}"/>
    </linearGradient>
  </defs>
  <rect width="600" height="375" fill="url(#${gradId})"/>
  ${icon}
  <rect x="0" y="290" width="600" height="85" fill="rgba(13,13,13,.38)"/>
  <text x="24" y="340" font-family="Arial, Helvetica, sans-serif" font-size="30" font-weight="700" fill="#ffffff">${escapeXml(
    name
  )}</text>
</svg>`;
}

mkdirSync(OUT_DIR, { recursive: true });
for (const [id, name, category] of DESTINATIONS) {
  writeFileSync(join(OUT_DIR, `${id}.svg`), svgFor(id, name, category), "utf8");
}

console.log(`Generated ${DESTINATIONS.length} destination placeholder images in ${OUT_DIR}`);
