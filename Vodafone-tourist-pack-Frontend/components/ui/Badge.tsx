import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: ReactNode;
  tone?: "red" | "gray" | "green" | "amber" | "blue";
  className?: string;
}

export default function Badge({ children, tone = "gray", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "red" && "bg-red-50 dark:bg-red-950/30 text-[#BD0000] border border-red-200 dark:border-red-800",
        tone === "gray" && "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200",
        tone === "green" && "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800",
        tone === "amber" && "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border border-amber-200 dark:border-amber-800",
        tone === "blue" && "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800",
        className
      )}
    >
      {children}
    </span>
  );
}
