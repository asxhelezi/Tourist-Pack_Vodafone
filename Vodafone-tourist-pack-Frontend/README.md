# Vodafone Albania — Digital Tourist Companion

A single-page Next.js companion app that helps tourists in Albania choose a Vodafone
tourist pack, explore the country, stay safe, and get help — in **8 languages** with
**ALL-first pricing**.

> This is an independent companion project inspired by vodafone.al's visual identity,
> not an official Vodafone website. Prices, coverage levels, and partner logos are
> illustrative pending an official data feed; this is stated plainly wherever it's
> relevant instead of being hidden in the design.

## Getting started

Requires Node.js 20+.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (must pass)
npm run lint
```

Optional environment variables — copy `.env.example` to `.env.local`:

| Variable | Purpose | Without it |
| --- | --- | --- |
| `SERPAPI_API_KEY` | Live events via SerpAPI Google Events (`/api/events`) | Falls back to `data/events.json` (relative dates, so Today/Tomorrow/Week filters always show content) |
| `CURRENCY_API_URL` | Custom exchange-rate endpoint (open.er-api.com-compatible, base ALL) | Free open.er-api.com is tried; on failure, a labeled fallback rate table is used |
| `NEXT_PUBLIC_MAP_TILE_URL` | Custom map tile server | OpenStreetMap tiles |

### SerpAPI setup

1. Create a free key at [serpapi.com](https://serpapi.com/) (Google Events engine).
2. Add `SERPAPI_API_KEY=your_key` to `.env.local`.
3. Restart `npm run dev` — `/api/events` fetches server-side only, caches for 30
   minutes, and silently falls back to local sample events on any network/quota error.

## Features

- **Tourist packs** — 4 ready-made packs (500–2,500 ALL), a coverflow "spin" carousel
  (drag, swipe, arrow buttons, keyboard arrows) to browse them, a "Build Your Pack"
  wizard with fit-score recommendation, and group pricing (1 = 1,500 / 2 = 2,600 /
  3 = 3,900 ALL, 4+ custom). A 3-step activation flow stamps a "travel passport".
- **8 languages** — en, sq, es, fr, de, ja, it, cs (`messages/*.json`), instant switch,
  full parity across every destination, chatbot response, and UI string.
- **Currency** — ALL is always the primary price; approximate conversions to
  EUR/USD/GBP/CHF plus a full converter (`/api/currency`, cached live rates with a
  labeled fallback table).
- **Explore map** — one Leaflet map with 5 layers: destinations (29, filterable by
  travel style), Vodafone coverage (illustrative circles + fun facts), stores, partner
  offers, and emergency points. Client-only with a translated list fallback if the
  map cannot load.
- **Events** — Facebook-notification-style bell in the header: cards slide in from the
  right at intervals, refresh automatically, and open the original SerpAPI source (or
  an internal event page when no source link exists). Backed by `/api/events`
  (SerpAPI Google Events, 30-minute in-memory cache, graceful fallback).
- **Emergency & support** — bottom-left "I Got Lost" button (112 / Police 129 /
  Ambulance 127 / Fire 128 / Vodafone 140), embassy directory (8 countries),
  lost-document flow, safety alerts, downloadable Offline Travel Kit (self-contained
  HTML, printable to PDF).
- **Reviews** — sticky sidebar carousel (swipe, drag, or arrows; auto-rotates every 6s
  and pauses while the feedback form is open) with star ratings and a "Share Feedback"
  form that opens inline (pending moderation, stored locally).
- **Mascot & chatbot** — ambient guide mascot (bottom-right)
  that opens a JSON-driven chatbot: multilingual keyword matching against
  `data/chatbot/intents.json`, preset answers per language in
  `data/chatbot/responses.<lang>.json`, emergency intents always win.

## Architecture notes for future backends

Everything persists client-side today, behind small interfaces designed to be
swapped for real backends without UI changes:

- **Reviews** — `lib/reviewsProvider.ts` exposes `reviewsProvider`. The default
  serves `data/reviews.json` (`verified: false`). Point it at an approved review
  source (e.g. store reviews export) and set `verified` accordingly.
- **Chatbot** — `lib/chatbotResponses.ts` is the single lookup point for preset
  answers; a translation API or LLM could be placed behind it later.
- **Coverage** — `data/coverage.ts` holds illustrative regions plus a
  `COVERAGE_LAST_UPDATED` date; replace with official measurements when available.
- **Events** — `app/api/events/route.ts` normalizes SerpAPI results via
  `lib/events.ts`; any provider that yields `TouristEvent[]` can be substituted.

### Persisted localStorage keys

`vf-saved-places`, `vf-dismissed-alerts`, `vf-offline-essentials`, `vf-feedback`,
`vf-read-events`, `vf-mascot-muted`, `vf-mascot-minimized`. Clearing site data resets
these to their defaults.

## Media assets

All images live under `public/assets/`, indexed in `data/mediaAssets.ts`:

```
public/assets/
  branding/       logo, welcome illustration
  destinations/   one placeholder "photo" per destination (generated —
                  see scripts/generate-destination-art.mjs), swap for real
                  photography without touching any component
  events/         event imagery (populated at runtime from SerpAPI)
  packs/          pack artwork, if/when packs get imagery
  icons/          static icons not covered by lucide-react
  backgrounds/    full-bleed section backgrounds
  placeholders/   generic fallback graphics (e.g. destination-placeholder.svg)
```

## Project layout

```
app/            App Router pages, styles, API routes (currency, events)
components/     Feature components (packs, map, events, reviews, chatbot, …)
context/        Pack / language / currency React contexts
data/           Destinations, coverage, stores, embassies, events
                fallback, chatbot intents + responses, reviews, media registry
hooks/          useTranslation, useLocalStorage, useEvents, useEventNotifications, …
lib/            Chatbot matcher, moderation, providers, event normalization
messages/       UI translations for the 8 supported languages
public/assets/  Centralized image registry (see Media assets above)
```
