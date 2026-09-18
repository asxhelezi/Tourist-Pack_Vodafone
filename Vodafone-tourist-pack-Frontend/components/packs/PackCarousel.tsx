"use client";

import { useCallback, useRef, useState } from "react";
import { animate, motion, type PanInfo } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PackCard from "@/components/PackCard";
import type { Pack } from "@/data/packs";

interface PackCarouselProps {
  packs: Pack[];
  ariaLabel: string;
}

const CARD_WIDTH = 300;
const CARD_HEIGHT = 480;
const DRAG_THRESHOLD = 45;
// A fast flick past this speed (px/s) advances the carousel even if the
// drag distance itself stayed under DRAG_THRESHOLD — a natural "fling".
const VELOCITY_THRESHOLD = 500;

/**
 * Drag-draggable "coverflow" carousel for the tourist packs: a fixed
 * 300x380 active card centered in the track, half-visible neighbors on
 * either side, swipe-to-drag (mouse or touch via framer-motion's pan
 * gesture) with spring momentum on release, and prev/next arrows. Clicking
 * a visible side card also jumps to it.
 */
export default function PackCarousel({ packs, ariaLabel }: PackCarouselProps) {
  const [packIndex, setPackIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [settling, setSettling] = useState(false);
  const [dragDeltaX, setDragDeltaX] = useState(0);
  const settleAnimation = useRef<ReturnType<typeof animate> | null>(null);

  const clampPack = useCallback(
    (i: number) => ((i % packs.length) + packs.length) % packs.length,
    [packs.length]
  );

  const goPack = useCallback((i: number) => setPackIndex(clampPack(i)), [clampPack]);
  const prevPack = useCallback(() => goPack(packIndex - 1), [goPack, packIndex]);
  const nextPack = useCallback(() => goPack(packIndex + 1), [goPack, packIndex]);

  const onPanStart = () => {
    settleAnimation.current?.stop();
    setSettling(false);
    setDragging(true);
  };

  const onPan = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    setDragDeltaX(info.offset.x);
  };

  const onPanEnd = (_: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.x > DRAG_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) prevPack();
    else if (offset.x < -DRAG_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) nextPack();

    setDragging(false);
    setSettling(true);
    settleAnimation.current = animate(offset.x, 0, {
      type: "spring",
      stiffness: 300,
      damping: 30,
      velocity: velocity.x,
      onUpdate: setDragDeltaX,
      onComplete: () => setSettling(false),
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prevPack();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      nextPack();
    }
  };

  const dragShift = dragDeltaX / 6;
  const isAnimatingDrag = dragging || settling;

  return (
    <motion.div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      style={{
        position: "relative",
        height: 500,
        marginTop: 36,
        touchAction: "pan-y",
        overflow: "hidden",
      }}
      onPanStart={onPanStart}
      onPan={onPan}
      onPanEnd={onPanEnd}
    >
      {packs.map((pack, i) => {
        let offset = i - packIndex;
        if (offset > packs.length / 2) offset -= packs.length;
        if (offset < -packs.length / 2) offset += packs.length;
        const abs = Math.abs(offset);
        const translateX = offset * 84 + dragShift;
        const scale = abs === 0 ? 1 : 0.85;
        const opacity = abs <= 1 ? (abs === 0 ? 1 : 0.7) : 0;

        return (
          <div
            key={pack.id}
            aria-hidden={offset !== 0}
            onClick={offset === 0 ? undefined : () => goPack(i)}
            style={{
              position: "absolute",
              left: "50%",
              top: "50%",
              width: CARD_WIDTH,
              maxWidth: "82vw",
              height: CARD_HEIGHT,
              transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
              opacity,
              zIndex: 100 - abs,
              transition: isAnimatingDrag ? "none" : "transform .45s ease, opacity .45s ease",
              pointerEvents: abs <= 1 ? "auto" : "none",
              cursor: offset === 0 ? "default" : "pointer",
            }}
          >
            <div className="h-full [&>div]:h-full">
              <PackCard pack={pack} />
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={prevPack}
        aria-label="Previous pack"
        className="absolute left-1 top-1/2 z-[200] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-200 shadow-md transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
      >
        <ChevronLeft size={20} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={nextPack}
        aria-label="Next pack"
        className="absolute right-1 top-1/2 z-[200] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 text-gray-700 dark:text-gray-200 shadow-md transition hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
      >
        <ChevronRight size={20} aria-hidden="true" />
      </button>
    </motion.div>
  );
}
