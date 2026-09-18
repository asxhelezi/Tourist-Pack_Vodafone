"use client";

import { Check } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

interface ActivationStepProps {
  number: string;
  title: string;
  text: string;
  /** Stamped = completed in the passport metaphor (spec 8.7). */
  stamped: boolean;
}

/** One passport page: gets a red stamp when its step completes. */
export const ActivationStep = ({ number, title, text, stamped }: ActivationStepProps) => {
  const { t } = useTranslation();
  const reducedMotion = useReducedMotion();

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        stamped ? "border-[#E60000]/50 bg-red-50/50" : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"
      }`}
    >
      <div
        className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
          stamped ? "bg-[#E60000] text-white" : "bg-gray-100 dark:bg-gray-800 text-[#E60000] dark:text-red-400"
        }`}
        aria-hidden="true"
      >
        {stamped ? <Check size={20} /> : number}
      </div>
      <h3 className="mt-3 text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{text}</p>

      {/* Passport stamp */}
      {stamped && (
        <span
          role="status"
          className={`pointer-events-none absolute -right-2 top-2 rotate-[-9deg] rounded-md border-[3px] border-[#E60000]/70 px-2 py-0.5 text-xs font-extrabold uppercase tracking-widest text-[#E60000]/80 ${
            reducedMotion ? "" : "motion-safe:animate-[stampIn_0.45s_ease-out]"
          }`}
        >
          {t("activation.stamped")}
        </span>
      )}
    </div>
  );
};
