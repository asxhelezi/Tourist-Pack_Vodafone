"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Pencil, SkipForward } from "lucide-react";
import PackRecommendation from "@/components/packs/PackRecommendation";
import TravelerTypeResult from "@/components/packs/TravelerTypeResult";
import Button from "@/components/ui/Button";
import { recommendPack, type TripNeeds } from "@/lib/recommendation";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

export type TravelerType =
  | "cityExplorer"
  | "beachWanderer"
  | "mountainExplorer"
  | "historyLover"
  | "foodLover"
  | "digitalNomad";

interface StoryAnswers {
  tripKind?: "vacation" | "business" | "family" | "nomad";
  region?: "city" | "coast" | "mountains" | "multi";
  days?: number;
  usage?: "maps" | "social" | "video" | "work" | "mix";
}

const QUESTIONS = [
  {
    id: "tripKind",
    titleKey: "story.q1",
    options: [
      { value: "vacation", labelKey: "story.q1a" },
      { value: "business", labelKey: "story.q1b" },
      { value: "family", labelKey: "story.q1c" },
      { value: "nomad", labelKey: "story.q1d" },
    ],
  },
  {
    id: "region",
    titleKey: "story.q2",
    options: [
      { value: "city", labelKey: "story.q2a" },
      { value: "coast", labelKey: "story.q2b" },
      { value: "mountains", labelKey: "story.q2c" },
      { value: "multi", labelKey: "story.q2d" },
    ],
  },
  {
    id: "days",
    titleKey: "story.q3",
    options: [
      { value: 3, labelKey: "story.days13" },
      { value: 7, labelKey: "story.days47" },
      { value: 14, labelKey: "story.days814" },
      { value: 30, labelKey: "story.days1530" },
    ],
  },
  {
    id: "usage",
    titleKey: "story.q4",
    options: [
      { value: "maps", labelKey: "story.q4a" },
      { value: "social", labelKey: "story.q4b" },
      { value: "video", labelKey: "story.q4c" },
      { value: "work", labelKey: "story.q4d" },
      { value: "mix", labelKey: "story.q4e" },
    ],
  },
] as const;

function deriveTravelerType(answers: StoryAnswers): TravelerType {
  if (answers.tripKind === "nomad" || answers.usage === "work") return "digitalNomad";
  if (answers.region === "coast") return "beachWanderer";
  if (answers.region === "mountains") return "mountainExplorer";
  if (answers.region === "multi") return "historyLover";
  if (answers.tripKind === "family") return "foodLover";
  return "cityExplorer";
}

function deriveNeeds(answers: StoryAnswers): TripNeeds {
  const usageToData: Record<string, TripNeeds["dataLevel"]> = {
    maps: "light",
    social: "regular",
    video: "high",
    work: "veryhigh",
    mix: "high",
  };
  return {
    days: answers.days ?? 7,
    dataLevel: usageToData[answers.usage ?? "mix"] ?? "regular",
    minutes: answers.tripKind === "business" ? 100 : 50,
    travellers: 1,
  };
}

interface StoryPackWizardProps {
  /** Called by "Skip and see packs". */
  onSkip: () => void;
}

/** Story-style card sequence with swipe + button navigation (spec 8.4/8.5). */
export default function StoryPackWizard({ onSkip }: StoryPackWizardProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<StoryAnswers>({});
  const [finished, setFinished] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const question = QUESTIONS[step];
  const currentAnswer = answers[question?.id as keyof StoryAnswers];

  const needs = useMemo(() => deriveNeeds(answers), [answers]);
  const recommendation = useMemo(() => recommendPack(needs), [needs]);
  const travelerType = deriveTravelerType(answers);

  const pick = (value: string | number) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
    // Auto-advance for a story feel, but Back always works.
    window.setTimeout(() => {
      if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
      else setFinished(true);
    }, 250);
  };

  const goBack = () => {
    if (finished) {
      setFinished(false);
      return;
    }
    if (step > 0) setStep((s) => s - 1);
  };

  const goNext = () => {
    if (currentAnswer === undefined) return;
    if (step < QUESTIONS.length - 1) setStep((s) => s + 1);
    else setFinished(true);
  };

  // Swipe support (buttons always remain available).
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(dx) < 60) return;
    if (dx > 0) goBack();
    else goNext();
  };

  if (finished) {
    return (
      <div className={reducedMotion ? "" : "motion-safe:animate-[fadeInUp_0.4s_ease-out]"}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50">{t("story.result")}</h3>
          <Button variant="ghost" size="sm" onClick={goBack}>
            <Pencil size={14} aria-hidden="true" />
            {t("story.editAnswers")}
          </Button>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <TravelerTypeResult type={travelerType} />
          <PackRecommendation recommendation={recommendation} needs={needs} />
        </div>
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-xl"
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Progress */}
      <div
        className="mb-4 flex gap-1.5"
        role="progressbar"
        aria-valuenow={step + 1}
        aria-valuemin={1}
        aria-valuemax={QUESTIONS.length}
        aria-label={t("story.stepOf", { a: step + 1, b: QUESTIONS.length })}
      >
        {QUESTIONS.map((q, i) => (
          <span
            key={q.id}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= step ? "bg-[#E60000]" : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
        {t("story.stepOf", { a: step + 1, b: QUESTIONS.length })}
      </p>

      {/* Card */}
      <div
        key={question.id}
        className={`rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-md ${
          reducedMotion ? "" : "motion-safe:animate-[fadeInUp_0.3s_ease-out]"
        }`}
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">{t(question.titleKey)}</h3>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {question.options.map((option) => (
            <button
              key={String(option.value)}
              type="button"
              aria-pressed={currentAnswer === option.value}
              onClick={() => pick(option.value)}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                currentAnswer === option.value
                  ? "border-[#E60000] bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400"
                  : "border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100 hover:border-[#E60000]/50 hover:bg-red-50/40"
              }`}
            >
              {t(option.labelKey)}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-4 flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={goBack} disabled={step === 0}>
          <ArrowLeft size={14} aria-hidden="true" />
          {t("common.back")}
        </Button>
        <Button variant="ghost" size="sm" onClick={onSkip}>
          <SkipForward size={14} aria-hidden="true" />
          {t("story.skipToPacks")}
        </Button>
        <Button size="sm" onClick={goNext} disabled={currentAnswer === undefined}>
          {t("common.next")}
          <ArrowRight size={14} aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
