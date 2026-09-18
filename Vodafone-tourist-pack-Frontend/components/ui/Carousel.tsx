"use client";

import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * How many cards are visible at once in the coverflow — 1 centered card on
 * mobile, 2 (active + next) on tablet, 3 (prev + active + next) on desktop.
 * Mirrors the app's sm/lg breakpoints.
 */
function useVisibleCount() {
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 639px)");
    const tabletQuery = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const update = () => {
      if (mobileQuery.matches) setVisibleCount(1);
      else if (tabletQuery.matches) setVisibleCount(2);
      else setVisibleCount(3);
    };
    update();
    mobileQuery.addEventListener("change", update);
    tabletQuery.addEventListener("change", update);
    return () => {
      mobileQuery.removeEventListener("change", update);
      tabletQuery.removeEventListener("change", update);
    };
  }, []);

  return visibleCount;
}

export interface CarouselProps {
  /** One React node per slide. */
  items: ReactNode[];
  /** Controlled active index — the parent owns the state (so auto-rotate, if any, keeps working). */
  index: number;
  onIndexChange: (index: number) => void;
  /** "coverflow" = standing 3D cards you spin left/right (packs). "slide" = single-file swipe (reviews, narrow columns). */
  variant?: "coverflow" | "slide";
  ariaLabel: string;
  loop?: boolean;
  renderDots?: boolean;
  className?: string;
}

/**
 * Small dependency-free carousel: drag/swipe (pointer events cover mouse,
 * touch and pen alike), arrow buttons, dot pager and arrow-key navigation.
 * Used for the Tourist Packs "spin the pack" picker and the Reviews rail.
 */
export default function Carousel({
  items,
  index,
  onIndexChange,
  variant = "slide",
  ariaLabel,
  loop = true,
  renderDots = true,
  className = "",
}: CarouselProps) {
  const count = items.length;
  const visibleCount = useVisibleCount();
  const dragState = useRef<{ startX: number } | null>(null);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const [dragging, setDragging] = useState(false);

  const clamp = (i: number) => {
    if (count === 0) return 0;
    if (loop) return ((i % count) + count) % count;
    return Math.min(Math.max(i, 0), count - 1);
  };

  const go = (delta: number) => onIndexChange(clamp(index + delta));

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragState.current = { startX: e.clientX };
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragState.current) return;
    setDragDeltaX(e.clientX - dragState.current.startX);
  };
  const endDrag = () => {
    if (!dragState.current) return;
    const threshold = 45;
    if (dragDeltaX > threshold) go(-1);
    else if (dragDeltaX < -threshold) go(1);
    dragState.current = null;
    setDragging(false);
    setDragDeltaX(0);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") go(-1);
    if (e.key === "ArrowRight") go(1);
  };

  if (count === 0) return null;

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className={`relative outline-none ${className}`}
    >
      {variant === "coverflow" ? (
        <div
          className="relative flex h-full touch-pan-y select-none items-center justify-center overflow-hidden"
          style={{ perspective: "1400px" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          {items.map((item, i) => {
            let offset = i - index;
            if (loop) {
              if (offset > count / 2) offset -= count;
              if (offset < -count / 2) offset += count;
            }
            const abs = Math.abs(offset);
            const dragShift = dragging ? dragDeltaX / 6 : 0;
            const translateX = offset * 46 + dragShift;
            const rotateY = offset * -20;
            const scale = abs === 0 ? 1 : abs === 1 ? 0.8 : 0.66;
            // How many neighbors are allowed to show at this breakpoint:
            // desktop shows prev+active+next, tablet shows active+next only,
            // mobile shows the active card alone.
            const withinVisibleRange =
              visibleCount >= 3
                ? abs <= 1
                : visibleCount === 2
                  ? offset === 0 || offset === 1
                  : offset === 0;
            const opacity = !withinVisibleRange ? 0 : abs === 0 ? 1 : 0.85;
            return (
              <div
                key={i}
                onClick={() => withinVisibleRange && offset !== 0 && onIndexChange(clamp(i))}
                className="absolute left-1/2 top-1/2 w-[72%] max-w-[240px] shrink-0 transition-transform duration-500 ease-out sm:max-w-[300px]"
                style={{
                  transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale}) rotateY(${rotateY}deg)`,
                  opacity,
                  zIndex: 100 - abs,
                  cursor: offset === 0 ? "default" : "pointer",
                  transitionDuration: dragging ? "0ms" : undefined,
                  pointerEvents: withinVisibleRange && offset !== 0 ? "auto" : "none",
                }}
                aria-hidden={offset !== 0}
              >
                {item}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="touch-pan-y select-none overflow-hidden"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerLeave={endDrag}
        >
          <div
            className="flex transition-transform duration-400 ease-out"
            style={{
              transform: `translateX(calc(${-index * 100}% + ${dragging ? dragDeltaX : 0}px))`,
              transitionDuration: dragging ? "0ms" : undefined,
            }}
          >
            {items.map((item, i) => (
              <div key={i} className="w-full shrink-0" aria-hidden={i !== index}>
                {item}
              </div>
            ))}
          </div>
        </div>
      )}

      {count > 1 && (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={!loop && index === 0}
            aria-label="Previous"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-200 shadow-md transition hover:text-[#E60000] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            disabled={!loop && index === count - 1}
            aria-label="Next"
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-200 shadow-md transition hover:text-[#E60000] disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      )}

      {renderDots && count > 1 && (
        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => onIndexChange(clamp(i))}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-5 bg-[#E60000]" : "w-1.5 bg-gray-300 dark:bg-gray-600"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
