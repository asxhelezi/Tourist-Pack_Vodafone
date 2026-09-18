"use client";

import SiteShell from "@/components/layout/SiteShell";
import PackTabs from "@/components/packs/PackTabs";
import PassportActivation from "@/components/activation/PassportActivation";
import { useTranslation } from "@/hooks/useTranslation";

export default function TouristPacksPage() {
  const { t } = useTranslation();

  return (
    <SiteShell>
      {/* Tourist packs */}
      <section id="packs" className="scroll-mt-20 py-12 sm:py-16">
        <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
          {t("packs.sectionTitle")}
        </h1>

        <div className="mt-8">
          <PackTabs />
        </div>
      </section>

      {/* Activation */}
      <section
        id="activation"
        className="scroll-mt-20 border-t border-gray-200 dark:border-gray-700 py-12 sm:py-16"
      >
        <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
          {t("activation.title")}
        </h2>

        <div className="mt-8">
          <PassportActivation />
        </div>
      </section>
    </SiteShell>
  );
}