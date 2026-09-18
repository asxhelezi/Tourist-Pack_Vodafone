"use client";

import { useEffect, useRef, useState } from "react";
import { Info } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

interface ConnectivityFitDialProps {
  score: number; // 0..100
  labelKey: "fit.excellent" | "fit.good" | "fit.partial";
}

/**
 * Animated fit gauge (spec 8.6). Animates once when it appears;
 * respects prefers-reduced-motion.
 */
export default function ConnectivityFitDial({ score, labelKey }: ConnectivityFitDialProps) {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();
  const [displayed, setDisplayed] = useState(reducedMotion ? score : 0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) {
      setDisplayed(score);
      return;
    }
    const start = performance.now();
    const duration = 900;
    const animate = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(score * eased));
      if (progress < 1) frame.current = requestAnimationFrame(animate);
    };
    frame.current = requestAnimationFrame(animate);
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [score, reducedMotion]);

  // SVG arc: 270° gauge from -225° to 45°.
  const radius = 54;
  const circumference = 2 * Math.PI * radius * 0.75;
  const filled = (displayed / 100) * circumference;
  const color = score >= 85 ? "#16a34a" : score >= 65 ? "#E60000" : "#d97706";

  return (
    <div className="flex flex-col items-center">
      <div
        role="img"
        aria-label={`${t("fit.match", { score })} — ${t(labelKey)}`}
        className="relative h-36 w-36"
      >
        <svg viewBox="0 0 128 128" className="h-full w-full -rotate-[135deg]">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${2 * Math.PI * radius}`}
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${filled} ${2 * Math.PI * radius}`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-50">{displayed}%</span>
          <span className="text-xs font-medium" style={{ color }}>
            {t(labelKey)}
          </span>
        </div>
      </div>
      <p className="mt-1 flex max-w-[220px] items-start gap-1 text-center text-xs text-gray-400 dark:text-gray-500">
        <Info size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
        {t("fit.tooltip")}
      </p>
    </div>
  );
}
