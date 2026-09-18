"use client";

import { useState } from "react";
import { FileWarning, ShieldCheck } from "lucide-react";
import EmbassyCard from "@/components/embassies/EmbassyCard";
import { EMBASSIES } from "@/data/embassies";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * "I lost my passport or ID" flow (spec 9.2): pick nationality →
 * matching embassy + general safety instructions. No legal advice.
 */
export default function LostDocumentFlow() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [nationality, setNationality] = useState("");

  const embassy = EMBASSIES.find((e) => e.id === nationality) ?? null;

  return (
    <div className="mt-4 rounded-2xl border border-red-100 bg-red-50/60 p-4">
      <button
        type="button"
        onClick={() =>
          setOpen((v) => {
            if (!v) {
              window.dispatchEvent(new CustomEvent("vf-mascot-say", { detail: "embassy" }));
            }
            return !v;
          })
        }
        aria-expanded={open}
        className="flex w-full items-center gap-2 text-left text-sm font-bold text-[#BD0000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] rounded-lg"
      >
        <FileWarning size={18} aria-hidden="true" />
        {t("embassy.lostDocument")}
      </button>

      {open && (
        <div className="mt-4 space-y-4">
          <div>
            <label
              htmlFor="lost-doc-nationality"
              className="block text-sm font-semibold text-gray-900 dark:text-gray-50"
            >
              {t("embassy.selectNationality")}
            </label>
            <select
              id="lost-doc-nationality"
              value={nationality}
              onChange={(event) => setNationality(event.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2.5 text-sm text-gray-900 dark:text-gray-50 shadow-sm focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30 sm:max-w-xs"
            >
              <option value="">—</option>
              {EMBASSIES.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.flag} {t(e.countryNameKey)}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-gray-50">
              <ShieldCheck size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
              {t("embassy.instructionsTitle")}
            </h4>
            <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-200">
              <li>{t("embassy.instruction1")}</li>
              <li>{t("embassy.instruction2")}</li>
              <li>{t("embassy.instruction3")}</li>
            </ol>
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">{t("embassy.noLegalNote")}</p>
          </div>

          {embassy && (
            <div className="sm:max-w-md">
              <EmbassyCard embassy={embassy} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
