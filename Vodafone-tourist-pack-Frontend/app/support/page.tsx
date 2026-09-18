"use client";

import SiteShell from "@/components/layout/SiteShell";
import Container from "@/components/layout/Container";
import EmbassyDirectory from "@/components/embassies/EmbassyDirectory";
import OfflineTravelKit from "@/components/offline/OfflineTravelKit";
import { useTranslation } from "@/hooks/useTranslation";

export default function SupportPage() {
  const { t } = useTranslation();

  return (
    <SiteShell>
      <Container as="section" id="support" className="scroll-mt-24 py-12 sm:py-16">
        {/* Titulli i faqes */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
            {t("nav.support")}
          </h1>
        </div>

        {/* Embassy Directory */}
        <div className="mt-10 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-8">
          <EmbassyDirectory />
        </div>

        {/* Offline Travel Kit */}
        <div className="mt-8 rounded-3xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-8">
          <OfflineTravelKit />
        </div>
      </Container>
    </SiteShell>
  );
}
