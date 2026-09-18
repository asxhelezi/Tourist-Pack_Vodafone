"use client";

import SiteShell from "@/components/layout/SiteShell";
import Container from "@/components/layout/Container";
import MapSection from "@/components/map/MapSection";
import { useTranslation } from "@/hooks/useTranslation";

export default function ExploreAlbaniaPage() {
  const { t } = useTranslation();

  return (
    <SiteShell>
      <Container className="py-10 text-center sm:py-14">
        <h1 className="text-3xl font-bold uppercase text-black sm:text-4xl">{t("map.title")}</h1>
      </Container>

      <Container as="section" id="explore" className="scroll-mt-20 py-12 sm:py-16">
        <MapSection />
      </Container>
    </SiteShell>
  );
}
