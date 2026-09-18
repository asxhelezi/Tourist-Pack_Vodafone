"use client";

import { useState } from "react";
import { LayoutGrid, SlidersHorizontal, Sparkles } from "lucide-react";
import PackBuilder from "@/components/packs/PackBuilder";
import GroupPackSelector from "@/components/packs/GroupPackSelector";
import StoryPackWizard from "@/components/packs/StoryPackWizard";
import PackCarousel from "@/components/packs/PackCarousel";
import { PACKS } from "@/data/packs";
import { useTranslation } from "@/hooks/useTranslation";

type TabId = "ready" | "build" | "story";

const TABS: { id: TabId; labelKey: string; Icon: typeof LayoutGrid }[] = [
  { id: "ready", labelKey: "packs.tabReady", Icon: LayoutGrid },
  { id: "build", labelKey: "packs.tabBuild", Icon: SlidersHorizontal },
  { id: "story", labelKey: "packs.tabStory", Icon: Sparkles },
];

/** Three pack-selection experiences as clear tabs (spec Phase 2 intro). */
export default function PackTabs() {
  const { t } = useTranslation();
  const [tab, setTab] = useState<TabId>("ready");

  return (
    <div>
      {/* Tab list */}
      <div
        role="tablist"
        aria-label={t("packs.sectionTitle")}
        className="mx-auto mb-8 flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-xl bg-gray-100 dark:bg-gray-800 p-1"
      >
        {TABS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            role="tab"
            id={`pack-tab-${id}`}
            aria-selected={tab === id}
            aria-controls={`pack-panel-${id}`}
            onClick={() => setTab(id)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] ${
              tab === id
                ? "bg-white dark:bg-gray-900 text-[#E60000] dark:text-red-400 shadow-sm"
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900"
            }`}
          >
            <Icon size={15} aria-hidden="true" />
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div
        role="tabpanel"
        id="pack-panel-ready"
        aria-labelledby="pack-tab-ready"
        hidden={tab !== "ready"}
      >
        <PackCarousel packs={PACKS} ariaLabel={t("packs.sectionTitle")} />
        <div className="mt-10 border-t border-gray-100 dark:border-gray-800 pt-8">
          <GroupPackSelector />
        </div>
      </div>

      <div
        role="tabpanel"
        id="pack-panel-build"
        aria-labelledby="pack-tab-build"
        hidden={tab !== "build"}
      >
        <PackBuilder />
      </div>

      <div
        role="tabpanel"
        id="pack-panel-story"
        aria-labelledby="pack-tab-story"
        hidden={tab !== "story"}
      >
        <StoryPackWizard onSkip={() => setTab("ready")} />
      </div>
    </div>
  );
}
