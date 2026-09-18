"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Bell, CheckCircle2, Info, MapPin, ShieldAlert, X } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { getActiveAlerts, type AlertSeverity } from "@/data/safetyAlerts";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTranslation } from "@/hooks/useTranslation";

const SEVERITY_META: Record<
  AlertSeverity,
  { labelKey: string; tone: "blue" | "amber" | "red"; Icon: typeof Info; border: string }
> = {
  info: { labelKey: "safety.severityInfo", tone: "blue", Icon: Info, border: "border-blue-200" },
  caution: {
    labelKey: "safety.severityCaution",
    tone: "amber",
    Icon: AlertTriangle,
    border: "border-amber-300",
  },
  important: {
    labelKey: "safety.severityImportant",
    tone: "red",
    Icon: ShieldAlert,
    border: "border-red-300",
  },
};

const TIPS = ["safety.tip1", "safety.tip2", "safety.tip3", "safety.tip4", "safety.tip5"];

/** Safety tips + active alerts with dismiss + expiry filtering (spec 9.4). */
export default function SafetyAlerts() {
  const { t } = useTranslation();
  const [dismissed, setDismissed, hydrated] = useLocalStorage<string[]>(
    "vf-dismissed-alerts",
    []
  );
  // Evaluate active alerts on the client only so expiry uses the visitor's clock.
  const [active, setActive] = useState<ReturnType<typeof getActiveAlerts>>([]);
  useEffect(() => {
    setActive(getActiveAlerts());
  }, []);

  const visible = hydrated ? active.filter((a) => !dismissed.includes(a.id)) : [];

  return (
    <div>
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-50">
        <Bell size={20} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
        {t("safety.title")}
      </h3>

      {/* General tips */}
      <h4 className="mt-5 text-sm font-bold text-gray-900 dark:text-gray-50">{t("safety.tipsTitle")}</h4>
      <ul className="mt-2 grid gap-2 sm:grid-cols-2">
        {TIPS.map((key) => (
          <li
            key={key}
            className="flex items-start gap-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-sm text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-[#E60000] dark:text-red-400" aria-hidden="true" />
            {t(key)}
          </li>
        ))}
      </ul>

      {/* Active alerts */}
      <h4 className="mt-6 text-sm font-bold text-gray-900 dark:text-gray-50">{t("safety.alertsTitle")}</h4>
      {hydrated && visible.length === 0 ? (
        <p className="mt-2 rounded-xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 p-4 text-sm text-green-800 dark:text-green-200">
          {t("safety.noAlerts")}
        </p>
      ) : (
        <ul className="mt-2 space-y-2" aria-live="polite">
          {visible.map((alert) => {
            const meta = SEVERITY_META[alert.severity];
            return (
              <li
                key={alert.id}
                className={`relative rounded-xl border ${meta.border} bg-white dark:bg-gray-900 p-4 shadow-sm`}
              >
                <div className="flex flex-wrap items-center gap-2 pr-8">
                  <meta.Icon
                    size={16}
                    className={
                      alert.severity === "important"
                        ? "text-[#E60000] dark:text-red-400"
                        : alert.severity === "caution"
                          ? "text-amber-600"
                          : "text-blue-600"
                    }
                    aria-hidden="true"
                  />
                  <span className="font-bold text-gray-900 dark:text-gray-50">{t(alert.titleKey)}</span>
                  <Badge tone={meta.tone}>{t(meta.labelKey)}</Badge>
                </div>
                <p className="mt-1.5 text-sm text-gray-700 dark:text-gray-200">{t(alert.bodyKey)}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                  <MapPin size={12} aria-hidden="true" />
                  {alert.location}
                </p>
                <button
                  type="button"
                  onClick={() => setDismissed((prev) => [...prev, alert.id])}
                  aria-label={t("common.close")}
                  className="absolute right-2.5 top-2.5 rounded-full p-1 text-gray-400 dark:text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
