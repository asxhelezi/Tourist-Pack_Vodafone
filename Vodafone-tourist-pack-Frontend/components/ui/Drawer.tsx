"use client";

import { type ReactNode } from "react";
import Modal from "@/components/ui/Modal";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  label: string;
  closeLabel: string;
  side?: "left" | "right";
  title?: ReactNode;
}

/**
 * Side drawer built on the Modal primitive (focus trap, ESC, overlay click,
 * scroll lock are inherited).
 */
export default function Drawer({
  open,
  onClose,
  children,
  label,
  closeLabel,
  side = "right",
  title,
}: DrawerProps) {
  if (!open) return null;
  return (
    <Modal
      open={open}
      onClose={onClose}
      label={label}
      closeLabel={closeLabel}
      panelClassName={`!fixed inset-y-0 ${
        side === "right" ? "right-0" : "left-0"
      } !m-0 h-full !max-h-full w-full max-w-md !rounded-none sm:${
        side === "right" ? "!rounded-l-2xl" : "!rounded-r-2xl"
      }`}
    >
      <div className="flex h-full flex-col">
        {title && (
          <div className="border-b border-gray-100 dark:border-gray-800 px-5 py-4 pr-14">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h2>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
      </div>
    </Modal>
  );
}
