"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  CalendarDays,
  MapPin,
  MessageSquare,
  Phone,
  RotateCcw,
  Share2,
  Video,
  Wifi,
} from "lucide-react";
import RangeControl from "@/components/packs/RangeControl";
import PackRecommendation from "@/components/packs/PackRecommendation";
import Button from "@/components/ui/Button";
import {
  DATA_LEVEL_GB,
  recommendPack,
  type TripNeeds,
} from "@/lib/recommendation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

const DATA_LEVELS = ["light", "regular", "high", "veryhigh"] as const;
const DATA_LEVEL_KEYS: Record<(typeof DATA_LEVELS)[number], string> = {
  light: "builder.dataLight",
  regular: "builder.dataRegular",
  high: "builder.dataHigh",
  veryhigh: "builder.dataVeryHigh",
};

const MINUTE_LEVELS = [
  { minutes: 50, key: "builder.callsLow" },
  { minutes: 100, key: "builder.callsMedium" },
  { minutes: 300, key: "builder.callsHigh" },
] as const;

const USAGE_OPTIONS = [
  { id: "maps", key: "builder.usageMaps", Icon: MapPin },
  { id: "social", key: "builder.usageSocial", Icon: Share2 },
  { id: "messaging", key: "builder.usageMessaging", Icon: MessageSquare },
  { id: "video", key: "builder.usageVideo", Icon: Video },
  { id: "work", key: "builder.usageWork", Icon: Briefcase },
  { id: "calls", key: "builder.usageCalls", Icon: Phone },
] as const;

const DEFAULTS = {
  days: 7,
  dataIndex: 1,
  needCalls: true,
  minutesIndex: 1,
  usage: [] as string[],
};

/** Build My Pack always recommends for a single traveller (spec item 6). */
const TRAVELLERS = 1;

/**
 * Build Your Own Pack (spec 8.2): sliders update the recommendation in
 * real time, and the "travel kit" chips re-assemble per combination.
 */
export default function PackBuilder() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [days, setDays] = useState(DEFAULTS.days);
  const [dataIndex, setDataIndex] = useState(DEFAULTS.dataIndex);
  const [needCalls, setNeedCalls] = useState(DEFAULTS.needCalls);
  const [minutesIndex, setMinutesIndex] = useState(DEFAULTS.minutesIndex);
  const [usage, setUsage] = useState<string[]>(DEFAULTS.usage);

  const dataLevel = DATA_LEVELS[dataIndex];
  const minutes = needCalls ? MINUTE_LEVELS[minutesIndex].minutes : 0;

  const needs: TripNeeds = useMemo(
    () => ({ days, dataLevel, minutes, travellers: TRAVELLERS, usage }),
    [days, dataLevel, minutes, usage]
  );
  const recommendation = useMemo(() => recommendPack(needs), [needs]);

  const reset = () => {
    setDays(DEFAULTS.days);
    setDataIndex(DEFAULTS.dataIndex);
    setNeedCalls(DEFAULTS.needCalls);
    setMinutesIndex(DEFAULTS.minutesIndex);
    setUsage(DEFAULTS.usage);
  };

  const toggleUsage = (id: string) =>
    setUsage((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );

  // Kit chips re-assemble per combination (keys change => re-animate).
  const kitChips = [
    { id: `days-${days}`, Icon: CalendarDays, label: t("builder.chipDays", { n: days }) },
    { id: `data-${dataLevel}`, Icon: Wifi, label: t("builder.chipData", { gb: DATA_LEVEL_GB[dataLevel] }) },
    ...(needCalls
      ? [{ id: `calls-${minutes}`, Icon: Phone, label: t("builder.chipCalls", { min: minutes }) }]
      : []),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-6 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{t("builder.title")}</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} aria-label={t("common.reset")}>
            <RotateCcw size={14} aria-hidden="true" />
            {t("common.reset")}
          </Button>
        </div>

        <RangeControl
          label={t("builder.tripLength")}
          min={1}
          max={30}
          value={days}
          onChange={setDays}
          valueText={`${days} ${days === 1 ? t("packs.day") : t("packs.days")}`}
        />

        <RangeControl
          label={t("builder.dataNeed")}
          min={0}
          max={3}
          value={dataIndex}
          onChange={setDataIndex}
          valueText={`${t(DATA_LEVEL_KEYS[dataLevel])} (${t("builder.approxGb", {
            gb: DATA_LEVEL_GB[dataLevel],
          })})`}
        />

        {/* Calls */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {t("builder.needCalls")}
          </legend>
          <div className="flex gap-2" role="group">
            {[true, false].map((option) => (
              <button
                key={String(option)}
                type="button"
                aria-pressed={needCalls === option}
                onClick={() => setNeedCalls(option)}
                className={`rounded-lg border px-4 py-1.5 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                  needCalls === option
                    ? "border-[#E60000] bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400"
                }`}
              >
                {option ? t("common.yes") : t("common.no")}
              </button>
            ))}
          </div>
          {needCalls && (
            <div className="mt-3">
              <RangeControl
                label={t("packs.minutes")}
                min={0}
                max={MINUTE_LEVELS.length - 1}
                value={minutesIndex}
                onChange={setMinutesIndex}
                valueText={`${t(MINUTE_LEVELS[minutesIndex].key)} (${MINUTE_LEVELS[minutesIndex].minutes} min)`}
              />
            </div>
          )}
        </fieldset>

        {/* Usage categories */}
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-gray-800 dark:text-gray-100">
            {t("builder.usage")}
          </legend>
          <div className="flex flex-wrap gap-2">
            {USAGE_OPTIONS.map(({ id, key, Icon }) => (
              <button
                key={id}
                type="button"
                aria-pressed={usage.includes(id)}
                onClick={() => toggleUsage(id)}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                  usage.includes(id)
                    ? "border-[#E60000] bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400"
                    : "border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-400"
                }`}
              >
                <Icon size={13} aria-hidden="true" />
                {t(key)}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Live kit + recommendation */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-dashed border-[#E60000]/40 bg-red-50/40 dark:bg-red-950/20 p-5">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t("builder.yourKit")}</h4>
          <ul className="mt-3 flex min-h-[3rem] flex-wrap gap-2" aria-live="polite">
            {kitChips.map(({ id, Icon, label }) => (
              <li
                key={id}
                className={`inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 px-3 py-1.5 text-sm font-medium text-gray-800 dark:text-gray-100 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 ${
                  reducedMotion ? "" : "motion-safe:animate-[fadeInUp_0.25s_ease-out]"
                }`}
              >
                <Icon size={14} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
                {label}
              </li>
            ))}
          </ul>
        </div>

        <div aria-live="polite">
          <h4 className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("builder.recommended")}
          </h4>
          <PackRecommendation recommendation={recommendation} needs={needs} />
        </div>
      </div>
    </div>
  );
}
