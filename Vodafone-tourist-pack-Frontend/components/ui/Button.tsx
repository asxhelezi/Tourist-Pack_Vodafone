"use client";

import { type ButtonHTMLAttributes, type ReactNode } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  children: ReactNode;
}

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] focus-visible:ring-offset-2",
        "active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary" &&
          "bg-[#E60000] text-white hover:bg-[#BD0000] shadow-sm",
        variant === "secondary" &&
          "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 hover:border-[#E60000] hover:text-[#E60000]",
        variant === "ghost" && "text-gray-700 dark:text-gray-200 hover:bg-gray-100",
        size === "sm" && "px-3 py-1.5 text-sm",
        size === "md" && "px-4 py-2 text-sm",
        size === "lg" && "px-6 py-3 text-base",
        className
      )}
      {...rest}
    >
      {loading && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
