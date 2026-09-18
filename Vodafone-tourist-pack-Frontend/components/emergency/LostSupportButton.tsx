"use client";

import { useState } from "react";
import LostSupportDrawer from "@/components/emergency/LostSupportDrawer";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Persistent floating "SOS" button, bottom-left (spec 9.1) so it
 * never conflicts with the mascot/chatbot bottom-right.
 */
export default function LostSupportButton() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const openEmbassies = () => {
    document.getElementById("support")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("emergency.button")}
        className="fixed bottom-20 left-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#E60000] text-[11px] font-extrabold tracking-wide text-white shadow-lg transition hover:bg-[#BD0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] focus-visible:ring-offset-2 active:scale-95 sm:bottom-6"
      >
        SOS
      </button>

      <LostSupportDrawer
        open={open}
        onClose={() => setOpen(false)}
        onOpenEmbassies={openEmbassies}
      />
    </>
  );
}
