"use client";

import { Star } from "lucide-react";

/** Display stars, or an accessible 1–5 input when onChange is given. */
export default function StarRating({
  value,
  onChange,
  label,
  size = 16,
}: {
  value: number;
  onChange?: (value: number) => void;
  label?: string;
  size?: number;
}) {
  if (!onChange) {
    return (
      <span
        className="inline-flex items-center gap-0.5"
        role="img"
        aria-label={label ? `${label}: ${value}/5` : `${value}/5`}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            size={size}
            aria-hidden="true"
            className={i <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
          />
        ))}
      </span>
    );
  }

  return (
    <div role="radiogroup" aria-label={label} className="inline-flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          role="radio"
          aria-checked={value === i}
          aria-label={`${i}/5`}
          onClick={() => onChange(i)}
          className="rounded p-0.5 transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
        >
          <Star
            size={size + 6}
            aria-hidden="true"
            className={i <= value ? "fill-amber-400 text-amber-400" : "text-gray-300 dark:text-gray-600"}
          />
        </button>
      ))}
    </div>
  );
}
