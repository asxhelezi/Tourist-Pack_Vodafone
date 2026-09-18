"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label: string;
  /** Accessible label for the close button. */
  closeLabel: string;
  /** Extra classes for the dialog panel. */
  panelClassName?: string;
  /** Hide the default close button (caller renders its own). */
  hideCloseButton?: boolean;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/**
 * Accessible modal: focus trap, ESC to close, overlay click to close,
 * scroll lock, focus restore (spec 6.5 / 7.1).
 */
export default function Modal({
  open,
  onClose,
  children,
  label,
  closeLabel,
  panelClassName = "",
  hideCloseButton = false,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Scroll lock + focus management.
  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Move focus into the dialog.
    const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
    (first ?? panelRef.current)?.focus();

    return () => {
      document.body.style.overflow = original;
      if (previouslyFocused.current instanceof HTMLElement) {
        previouslyFocused.current.focus();
      }
    };
  }, [open]);

  const onKeyDown = useCallback(
    (e: ReactKeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // Focus trap.
      const focusables = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        className={`relative max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white dark:bg-gray-900 shadow-2xl outline-none ${panelClassName}`}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        {!hideCloseButton && (
          <button
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute right-3 top-3 z-10 rounded-full bg-white/90 dark:bg-gray-800/90 p-2 text-gray-800 dark:text-gray-100 shadow transition hover:bg-white dark:hover:bg-gray-800 focus-visible:ring-2 focus-visible:ring-[#E60000]"
          >
            <X size={20} aria-hidden="true" />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}
