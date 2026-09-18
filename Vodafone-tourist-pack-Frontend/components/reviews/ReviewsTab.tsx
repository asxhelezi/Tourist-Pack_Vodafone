"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import StarRating from "@/components/ui/StarRating";

import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

import { moderateText } from "@/lib/moderation";
import {
  reviewsProvider,
  type Review,
} from "@/lib/reviewsProvider";

const ROTATE_MS = 2500;
const AVATAR_TONES = [
  "bg-[#E60000]",
  "bg-[#820000]",
  "bg-[#0096AD]",
  "bg-[#008093]",
  "bg-gray-700",
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

interface StoredFeedback {
  rating: number;
  message: string;
  name: string | null;
  country: string | null;
  createdAt: string;
  status: "pending";
}

export default function ReviewsTab() {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  const [reviews, setReviews] = useState<Review[]>([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const [, setFeedback] = useLocalStorage<StoredFeedback[]>(
    "vf-feedback",
    []
  );

  useEffect(() => {
    reviewsProvider.list().then(setReviews);
  }, []);

  /*
   * Auto-advances the single visible review card, unless the visitor is
   * filling in the feedback form, hovering/focusing/touching the card, or
   * has requested reduced motion.
   */
  useEffect(() => {
    if (reviews.length < 2 || showForm || paused || reducedMotion) {
      return;
    }

    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % reviews.length);
    }, ROTATE_MS);

    return () => {
      window.clearInterval(timer);
    };
  }, [reviews.length, showForm, paused, reducedMotion]);

  // Clamp the index if the review list shrinks/reloads.
  useEffect(() => {
    if (index >= reviews.length && reviews.length > 0) {
      setIndex(0);
    }
  }, [reviews.length, index]);

  const goPrev = () => setIndex((i) => (i - 1 + reviews.length) % reviews.length);
  const goNext = () => setIndex((i) => (i + 1) % reviews.length);

  const submitFeedback = () => {
    if (rating === 0) {
      setError(t("reviews.ratingRequired"));
      return;
    }

    const result = moderateText(message, {
      min: 5,
      max: 300,
    });

    if (!result.ok) {
      setError(
        result.reason === "tooShort"
          ? t("reviews.textTooShort", { n: 5 })
          : result.reason === "tooLong"
            ? t("reviews.textTooLong", { n: 300 })
            : t("reviews.moderationBlocked")
      );

      return;
    }

    if (!consent) {
      setError(t("reviews.consentRequired"));
      return;
    }

    setFeedback((previousFeedback) => [
      {
        rating,
        message: message.trim(),
        name: name.trim() || null,
        country: country.trim() || null,
        createdAt: new Date().toISOString(),
        status: "pending",
      },
      ...previousFeedback,
    ]);

    setError(null);
    setSent(true);
    setShowForm(false);
  };

  const inputClassName =
    "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-50 focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30";

  return (
    <section aria-label="Reviews" className="w-full">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 sm:text-3xl">
          {t("reviews.title")}
        </h2>
      </div>

      {/* "What People Say" — one review visible at a time, auto-advancing
          on a timer, with manual arrows/dots and pause-on-interaction. */}
      {reviews.length > 0 ? (
        <div
          className="mx-auto mt-8 max-w-[420px]"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={goPrev}
              aria-label={t("common.back")}
              disabled={reviews.length < 2}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-sm transition hover:text-[#E60000] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <ChevronLeft size={18} aria-hidden="true" />
            </button>

            <article
              role="group"
              aria-roledescription="slide"
              aria-label={t("story.stepOf", { a: index + 1, b: reviews.length })}
              aria-live="polite"
              tabIndex={0}
              key={reviews[index].id}
              className={`min-w-0 flex-1 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-sm ${
                reducedMotion ? "" : "motion-safe:animate-[fadeInUp_0.3s_ease-out]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white ${
                    AVATAR_TONES[index % AVATAR_TONES.length]
                  }`}
                  aria-hidden="true"
                >
                  {initials(reviews[index].name)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-gray-900 dark:text-gray-50">
                    {reviews[index].name}
                  </p>
                  <p className="truncate text-xs text-gray-500 dark:text-gray-400">{reviews[index].country}</p>
                </div>
              </div>

              <div className="mt-3">
                <StarRating value={reviews[index].rating} label={t("reviews.rating")} />
              </div>

              <blockquote className="mt-3 text-sm leading-6 text-gray-700 dark:text-gray-200">
                “{reviews[index].text}”
              </blockquote>
            </article>

            <button
              type="button"
              onClick={goNext}
              aria-label={t("common.next")}
              disabled={reviews.length < 2}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 shadow-sm transition hover:text-[#E60000] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>

          {reviews.length > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              {reviews.map((item, i) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={t("story.stepOf", { a: i + 1, b: reviews.length })}
                  aria-current={i === index}
                  className={`h-2 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
                    i === index ? "w-6 bg-[#E60000]" : "w-2 bg-gray-300 dark:bg-gray-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl bg-gray-50 dark:bg-gray-800 p-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading reviews...</p>
        </div>
      )}

      {/* Share-a-review entry point + inline form, centered under the rail */}
      <div className="mx-auto mt-6 max-w-lg">
        {!showForm && !sent && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="mx-auto flex"
            onClick={() => {
              setShowForm(true);
              setError(null);
            }}
          >
            <MessageCircle size={15} aria-hidden="true" />
            {t("reviews.shareFeedback")}
          </Button>
        )}

        {sent && (
          <div
            className="rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-3 text-center text-sm text-green-800 dark:text-green-200"
            role="status"
          >
            {t("reviews.feedbackThanks")}
            <div className="mt-2 flex justify-center">
              <Badge tone="gray">{t("reviews.pendingModeration")}</Badge>
            </div>
          </div>
        )}

        {showForm && !sent && (
          <form
            className="space-y-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 text-left shadow-sm"
            onSubmit={(event) => {
              event.preventDefault();
              submitFeedback();
            }}
          >
            <div>
              <span className="block text-sm font-semibold text-gray-900 dark:text-gray-50">
                {t("reviews.feedbackRating")}
              </span>

              <div className="mt-2">
                <StarRating
                  value={rating}
                  onChange={setRating}
                  label={t("reviews.feedbackRating")}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="review-message"
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
              >
                {t("reviews.feedbackMessage")}
              </label>

              <textarea
                id="review-message"
                value={message}
                onChange={(event) => {
                  setMessage(event.target.value);
                }}
                rows={3}
                maxLength={320}
                className={`${inputClassName} mt-1`}
              />
            </div>

            <div>
              <label
                htmlFor="review-name"
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
              >
                {t("reviews.feedbackName")}
              </label>

              <input
                id="review-name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
                maxLength={40}
                className={`${inputClassName} mt-1`}
              />
            </div>

            <div>
              <label
                htmlFor="review-country"
                className="text-sm font-semibold text-gray-900 dark:text-gray-50"
              >
                {t("reviews.feedbackCountry")}
              </label>

              <input
                id="review-country"
                value={country}
                onChange={(event) => {
                  setCountry(event.target.value);
                }}
                maxLength={40}
                className={`${inputClassName} mt-1`}
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => {
                  setConsent(event.target.checked);
                }}
                className="mt-0.5 accent-[#E60000]"
              />

              {t("reviews.consent")}
            </label>

            {error && (
              <p
                className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200"
                role="alert"
              >
                {error}
              </p>
            )}

            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1">
                {t("common.confirm")}
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowForm(false);
                  setError(null);
                }}
              >
                {t("common.close")}
              </Button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}