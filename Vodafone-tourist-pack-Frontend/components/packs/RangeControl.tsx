"use client";

import { useId } from "react";

interface RangeControlProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  /** Human-readable current value, always visible (spec 8.2). */
  valueText: string;
}

/** Accessible slider with its value always displayed as text. */
export default function RangeControl({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  valueText,
}: RangeControlProps) {
  const id = useId();
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-gray-800 dark:text-gray-100">
          {label}
        </label>
        <output htmlFor={id} className="text-sm font-semibold text-[#E60000] dark:text-red-400">
          {valueText}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-valuetext={valueText}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#E60000]"
      />
    </div>
  );
}
