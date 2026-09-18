"use client";

import { useMemo, useState } from "react";
import { Landmark, Search } from "lucide-react";
import EmbassyCard from "@/components/embassies/EmbassyCard";
import LostDocumentFlow from "@/components/embassies/LostDocumentFlow";
import { EMBASSIES } from "@/data/embassies";
import { useTranslation } from "@/hooks/useTranslation";

/** Embassy directory (spec 9.2): search + alphabetical grid + lost-document flow. */
export default function EmbassyDirectory() {
  const { t, locale } = useTranslation();
  const [query, setQuery] = useState("");

  const embassies = useMemo(() => {
    const sorted = [...EMBASSIES].sort((a, b) =>
      t(a.countryNameKey).localeCompare(t(b.countryNameKey), locale)
    );
    const q = query.trim().toLowerCase();
    if (!q) return sorted;
    return sorted.filter(
      (e) =>
        t(e.countryNameKey).toLowerCase().includes(q) ||
        e.officeName.toLowerCase().includes(q) ||
        e.countryCode.toLowerCase().includes(q)
    );
  }, [query, t, locale]);

  return (
    <div>
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-50">
        <Landmark size={20} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
        {t("embassy.title")}
      </h3>

      <LostDocumentFlow />

      <div className="relative mt-5">
        <Search
          size={16}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("embassy.searchPlaceholder")}
          aria-label={t("embassy.searchPlaceholder")}
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 py-2.5 pl-9 pr-3 text-sm text-gray-900 dark:text-gray-50 shadow-sm focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30"
        />
      </div>

      {embassies.length === 0 ? (
        <p className="mt-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {t("embassy.noResults")}
        </p>
      ) : (
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {embassies.map((embassy) => (
            <li key={embassy.id}>
              <EmbassyCard embassy={embassy} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
