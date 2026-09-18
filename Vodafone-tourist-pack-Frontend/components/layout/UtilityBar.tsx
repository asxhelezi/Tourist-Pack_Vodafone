"use client";

import { Phone, ShieldAlert } from "lucide-react";
import { LOCALE_FLAGS, LOCALE_NAMES } from "@/lib/i18n";
import { useTranslation } from "@/hooks/useTranslation";
import Container from "@/components/layout/Container";

/**
 * Slim dark utility strip above the main header — mirrors vodafone.al's
 * own utility bar (quick contact info + current language), hidden on
 * mobile where header space is already tight.
 */
export default function UtilityBar() {
  const { t, locale } = useTranslation();

  return (
    <div className="hidden bg-[#0d0d0d] text-white/80 md:block">
      <Container className="flex items-center justify-end gap-5 py-1.5 text-xs">
        <a href="tel:112" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
          <ShieldAlert size={13} aria-hidden="true" />
          112
        </a>
        <span className="h-3 w-px bg-white/20" aria-hidden="true" />
        <a href="tel:140" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
          <Phone size={13} aria-hidden="true" />
          {t("emergency.vodafoneSupport")} 140
        </a>
        <span className="h-3 w-px bg-white/20" aria-hidden="true" />
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true">{LOCALE_FLAGS[locale]}</span>
          {LOCALE_NAMES[locale]}
        </span>
      </Container>
    </div>
  );
}
