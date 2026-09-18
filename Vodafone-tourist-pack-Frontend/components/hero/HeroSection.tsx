"use client";

import { Dancing_Script, Poppins } from "next/font/google";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslateFn } from "@/context/LanguageContext";

// Base/static phrases ("Together we", "Welcome to"): bold, uppercase sans-serif.
const baseSans = Poppins({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  display: "swap",
});

// Accent/dynamic words (CAN / EXPLORE / CONNECT / ALBANIA): elegant script.
const accentScript = Dancing_Script({
  subsets: ["latin", "latin-ext"],
  weight: ["600", "700"],
  display: "swap",
});

/** Dark-overlay strength over the background video (0–1). Tune this to taste. */
const OVERLAY_OPACITY = 0.22;

/** Set false to play the sequence once instead of looping it forever. */
const LOOP = true;

/** English defaults, used only if a "welcome.*" translation key is missing. */
const FALLBACK = {
  together_we: "Together we",
  can: "Can",
  explore: "Explore",
  connect: "Connect",
  welcome_to: "Welcome to",
  albania: "Albania",
} as const;

function tr(t: TranslateFn, key: string, fallback: string) {
  const value = t(key);
  return value === key ? fallback : value;
}

/**
 * Every duration/hold/gap for the text sequence in one place (seconds) so
 * the pacing can be retimed without touching the keyframe math below.
 */
const TIMING = {
  togetherIn: 0.8,
  gapAfterTogether: 0.3,
  canIn: 0.6,
  canHold: 1.2,
  crossfade: 0.45,
  exploreHold: 1.2,
  exploreOut: 0.45,
  connectIn: 0.45,
  connectHold: 1.2,
  clearOut: 0.6,
  gapBeforeFinale: 0.3,
  welcomeToIn: 0.6,
  gapBeforeAlbania: 0.2,
  albaniaIn: 0.8,
  finaleHold: 2.5,
  finaleOut: 0.8,
  loopGap: 0.6,
} as const;

const togetherStart = 0;
const togetherFadeInEnd = togetherStart + TIMING.togetherIn;

const canStart = togetherFadeInEnd + TIMING.gapAfterTogether;
const canFadeInEnd = canStart + TIMING.canIn;
const canHoldEnd = canFadeInEnd + TIMING.canHold;
// CAN and Explore cross-fade in the same window: CAN 1→0 while Explore 0→1.
const crossfadeEnd = canHoldEnd + TIMING.crossfade;
const exploreHoldEnd = crossfadeEnd + TIMING.exploreHold;
// Explore fades out fully before Connect starts fading in (sequential, not overlapping).
const exploreOutEnd = exploreHoldEnd + TIMING.exploreOut;
const connectFadeInEnd = exploreOutEnd + TIMING.connectIn;
const connectHoldEnd = connectFadeInEnd + TIMING.connectHold;

// "Together we" + "Connect" clear together.
const clearStart = connectHoldEnd;
const clearEnd = clearStart + TIMING.clearOut;

// Finale: "Welcome to" appears first, "Albania" follows directly after (bigger,
// the visual climax) — both hold together, then fade/scale out as one beat.
const welcomeToStart = clearEnd + TIMING.gapBeforeFinale;
const welcomeToFadeInEnd = welcomeToStart + TIMING.welcomeToIn;
const albaniaStart = welcomeToFadeInEnd + TIMING.gapBeforeAlbania;
const albaniaFadeInEnd = albaniaStart + TIMING.albaniaIn;
const finaleHoldEnd = albaniaFadeInEnd + TIMING.finaleHold;
const finaleEnd = finaleHoldEnd + TIMING.finaleOut;

const TOTAL_CYCLE = finaleEnd + TIMING.loopGap;

const pct = (t: number) => `${((t / TOTAL_CYCLE) * 100).toFixed(3)}%`;
const iterationCount = LOOP ? "infinite" : "1";

const heroAnimationCss = `
@keyframes heroTogetherWe {
  0%, ${pct(togetherStart)} { opacity: 0; }
  ${pct(togetherFadeInEnd)} { opacity: 1; }
  ${pct(clearStart)} { opacity: 1; }
  ${pct(clearEnd)}, 100% { opacity: 0; }
}
@keyframes heroWordCan {
  0%, ${pct(canStart)} { opacity: 0; transform: scale(0.95); }
  ${pct(canFadeInEnd)} { opacity: 1; transform: scale(1); }
  ${pct(canHoldEnd)} { opacity: 1; transform: scale(1); }
  ${pct(crossfadeEnd)}, 100% { opacity: 0; transform: scale(1); }
}
@keyframes heroWordExplore {
  0%, ${pct(canHoldEnd)} { opacity: 0; transform: scale(0.95); }
  ${pct(crossfadeEnd)} { opacity: 1; transform: scale(1); }
  ${pct(exploreHoldEnd)} { opacity: 1; transform: scale(1); }
  ${pct(exploreOutEnd)}, 100% { opacity: 0; transform: scale(1); }
}
@keyframes heroWordConnect {
  0%, ${pct(exploreOutEnd)} { opacity: 0; transform: scale(0.95); }
  ${pct(connectFadeInEnd)} { opacity: 1; transform: scale(1); }
  ${pct(clearStart)} { opacity: 1; transform: scale(1); }
  ${pct(clearEnd)}, 100% { opacity: 0; transform: scale(1); }
}
@keyframes heroWelcomeTo {
  0%, ${pct(welcomeToStart)} { opacity: 0; transform: scale(0.95); }
  ${pct(welcomeToFadeInEnd)} { opacity: 1; transform: scale(1); }
  ${pct(finaleHoldEnd)} { opacity: 1; transform: scale(1); }
  ${pct(finaleEnd)}, 100% { opacity: 0; transform: scale(0.95); }
}
@keyframes heroAlbania {
  0%, ${pct(albaniaStart)} { opacity: 0; transform: scale(0.95); }
  ${pct(albaniaFadeInEnd)} { opacity: 1; transform: scale(1); }
  ${pct(finaleHoldEnd)} { opacity: 1; transform: scale(1); }
  ${pct(finaleEnd)}, 100% { opacity: 0; transform: scale(0.95); }
}
.hero-line-together { animation: heroTogetherWe ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
.hero-word-can { animation: heroWordCan ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
.hero-word-explore { animation: heroWordExplore ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
.hero-word-connect { animation: heroWordConnect ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
.hero-welcome-to { animation: heroWelcomeTo ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
.hero-albania { animation: heroAlbania ${TOTAL_CYCLE}s ease-out ${iterationCount}; }
`;

export default function HeroSection() {
  const { t } = useTranslation();

  const togetherWe = tr(t, "welcome.together_we", FALLBACK.together_we);
  const can = tr(t, "welcome.can", FALLBACK.can);
  const explore = tr(t, "welcome.explore", FALLBACK.explore);
  const connect = tr(t, "welcome.connect", FALLBACK.connect);
  const welcomeTo = tr(t, "welcome.welcome_to", FALLBACK.welcome_to);
  const albania = tr(t, "welcome.albania", FALLBACK.albania);

  return (
    <section
      id="home"
      tabIndex={-1}
      aria-label={`${welcomeTo} ${albania}`}
      style={{
        position: "relative",
        width: "calc(100% - 128px)",
        height: "520px",
        margin: "0 auto",
        overflow: "hidden",
        borderRadius: "24px",
      }}
    >
      {/* Layer 1 — background video. No poster image: the still graphic has
          "Welcome to Albania" baked into it, which visibly clashes with the
          animated text layer on top for the second or two before the (large)
          video buffers enough to play. A plain brand-colored background
          avoids that double-text flash. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          backgroundColor: "#850100",
        }}
      >
        <source src="/assets/backgrounds/welcome-albania.mp4" type="video/mp4" />
      </video>

      {/* Layer 2 — faint dark overlay, video must stay clearly visible through it */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(to bottom, rgba(0,0,0,${OVERLAY_OPACITY * 0.7}) 0%, rgba(0,0,0,${OVERLAY_OPACITY * 1.4}) 100%)`,
        }}
      />

      {/* Layer 3 — animated, localized welcome copy. All text stays white.
          Font pairing: base/static phrases ("Together we", "Welcome to") use
          the bold uppercase sans (baseSans); accent/dynamic words (CAN,
          EXPLORE, CONNECT, ALBANIA) use the script/cursive font (accentScript).
          Sizes step up in three tiers: base (CAN/EXPLORE/CONNECT/"Welcome to")
          < enlarged ("Together we") < biggest ("Albania"). */}
      <style>{heroAnimationCss}</style>
      <div
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 px-6 text-center text-white"
        style={{ textShadow: "0 4px 24px rgba(0,0,0,0.45)" }}
      >
        <span
          className={`${baseSans.className} hero-line-together text-3xl uppercase tracking-wide sm:text-4xl md:text-5xl`}
        >
          {togetherWe}
        </span>

        <div className="relative flex h-10 w-full max-w-[90vw] items-center justify-center sm:h-12 md:h-14">
          <span
            className={`${accentScript.className} hero-word-can absolute font-bold text-2xl sm:text-3xl md:text-4xl`}
          >
            {can}
          </span>
          <span
            className={`${accentScript.className} hero-word-explore absolute font-bold text-2xl sm:text-3xl md:text-4xl`}
          >
            {explore}
          </span>
          <span
            className={`${accentScript.className} hero-word-connect absolute font-bold text-2xl sm:text-3xl md:text-4xl`}
          >
            {connect}
          </span>
        </div>

        <div className="absolute flex max-w-[90vw] flex-col items-center gap-1 px-4">
          <span
            className={`${baseSans.className} hero-welcome-to uppercase text-2xl sm:text-3xl md:text-4xl`}
          >
            {welcomeTo}
          </span>
          <span
            className={`${accentScript.className} hero-albania font-bold tracking-wide text-5xl sm:text-6xl md:text-7xl`}
          >
            {albania}
          </span>
        </div>
      </div>
    </section>
  );
}
