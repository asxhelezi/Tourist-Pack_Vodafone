"use client";

import SiteShell from "@/components/layout/SiteShell";
import HeroSection from "@/components/hero/HeroSection";
import PackTabs from "@/components/packs/PackTabs";
import PassportActivation from "@/components/activation/PassportActivation";
import ReviewsTab from "@/components/reviews/ReviewsTab";
import Container from "@/components/layout/Container";
import { useTranslation } from "@/hooks/useTranslation";

export default function HomePage() {
  const { t } = useTranslation();

  return (
    <SiteShell>
      {/* Hero uses the same container rhythm as every other section */}
      <Container className="pb-8 pt-2">
        <HeroSection />
      </Container>

      {/* Everything below Hero uses the same shared container */}
      <Container>
        <section id="packs" className="scroll-mt-24 py-12 sm:py-16">
          <h1 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50 sm:text-4xl">
            {t("packs.sectionTitle")}
          </h1>

          <div className="mt-8">
            <PackTabs />
          </div>
        </section>

        <section
          id="activation"
          className="scroll-mt-24 border-t border-gray-200 dark:border-gray-700 py-12 sm:py-16"
        >
          <h2 className="text-center text-3xl font-bold text-gray-900 dark:text-gray-50">
            {t("activation.title")}
          </h2>

          <div className="mx-auto mt-8 max-w-3xl">
            <PassportActivation />
          </div>
        </section>

        <section
          id="reviews"
          className="scroll-mt-24 border-t border-gray-200 dark:border-gray-700 py-12 sm:py-16"
        >
          <ReviewsTab />
        </section>
      </Container>
    </SiteShell>
  );
}