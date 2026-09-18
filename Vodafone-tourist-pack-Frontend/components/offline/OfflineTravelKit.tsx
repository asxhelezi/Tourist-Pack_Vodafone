"use client";

import { useState } from "react";
import { Download, WifiOff } from "lucide-react";
import Button from "@/components/ui/Button";
import { ALBANIAN_PHRASES } from "@/data/albanianPhrases";
import { EMBASSIES } from "@/data/embassies";
import { EMERGENCY_NUMBERS, TAXI_NUMBER } from "@/data/emergency";
import { useTranslation } from "@/hooks/useTranslation";

const esc = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Offline Travel Kit (spec 9.3): downloadable self-contained HTML guide
 * (save as PDF via the browser print dialog), Albanian phrases and
 * offline essentials persisted in localStorage.
 */
export default function OfflineTravelKit() {
  const { t, localeTag } = useTranslation();
  const [generating, setGenerating] = useState(false);

  const buildGuideHtml = () => {
    const generated = new Intl.DateTimeFormat(localeTag, {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date());

    const numbersRows = EMERGENCY_NUMBERS.map(
      (n) => `<tr><td>${esc(t(n.labelKey))}</td><td><strong>${esc(n.number)}</strong></td></tr>`
    ).join("");

    const phraseRows = ALBANIAN_PHRASES.map(
      (p) =>
        `<tr><td>${esc(t(p.labelKey))}</td><td><strong>${esc(p.albanian)}</strong></td><td>${esc(p.pronunciation)}</td></tr>`
    ).join("");

    const embassyRows = EMBASSIES.map(
      (e) =>
        `<tr><td>${e.flag} ${esc(t(e.countryNameKey))}</td><td>${esc(e.address)}</td><td>${esc(e.phone)}</td><td>${esc(e.openingHours)}</td></tr>`
    ).join("");

    return `<!doctype html>
<html lang="${esc(localeTag)}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(t("offline.title"))} — Vodafone Tourist Companion</title>
<style>
  body{font-family:Arial,Helvetica,sans-serif;margin:24px;color:#1f2937;line-height:1.5}
  h1{color:#E60000;font-size:22px}
  h2{font-size:16px;border-bottom:2px solid #E60000;padding-bottom:4px;margin-top:28px}
  table{border-collapse:collapse;width:100%;margin-top:8px;font-size:13px}
  th,td{border:1px solid #d1d5db;padding:6px 8px;text-align:left;vertical-align:top}
  th{background:#fef2f2}
  .meta{color:#6b7280;font-size:12px}
  .disclaimer{margin-top:24px;padding:10px;border:1px dashed #d97706;background:#fffbeb;color:#92400e;font-size:12px}
  @media print{body{margin:8mm}}
</style>
</head>
<body>
<h1>${esc(t("offline.title"))}</h1>
<p class="meta">${esc(t("offline.generatedOn"))}: ${esc(generated)}</p>

<h2>${esc(t("emergency.title"))}</h2>
<table><tbody>${numbersRows}</tbody></table>
<p class="meta">${esc(t("emergency.callTaxi"))}: ${esc(TAXI_NUMBER.number)}</p>
<p class="meta">${esc(t("offline.taxiGuidance"))}</p>

<h2>${esc(t("embassy.title"))}</h2>
<table>
<thead><tr><th></th><th></th><th></th><th>${esc(t("embassy.openingHours"))}</th></tr></thead>
<tbody>${embassyRows}</tbody>
</table>

<h2>${esc(t("offline.phrases"))}</h2>
<table>
<thead><tr><th>${esc(t("offline.phrase"))}</th><th>${esc(t("offline.albanian"))}</th><th>${esc(t("offline.pronunciation"))}</th></tr></thead>
<tbody>${phraseRows}</tbody>
</table>

<p class="disclaimer">${esc(t("offline.disclaimer"))}</p>
<p class="meta">${esc(t("offline.printNote"))}</p>
</body>
</html>`;
  };

  const download = () => {
    setGenerating(true);
    try {
      const blob = new Blob([buildGuideHtml()], { type: "text/html;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "vodafone-tourist-offline-guide.html";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      window.setTimeout(() => setGenerating(false), 600);
    }
  };

  return (
    <div>
      <h3 className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-gray-50">
        <WifiOff size={20} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
        {t("offline.title")}
      </h3>

      <div className="mt-4">
        <Button onClick={download} loading={generating} disabled={generating}>
          <Download size={16} aria-hidden="true" />
          {generating ? t("offline.generating") : t("offline.download")}
        </Button>
      </div>
    </div>
  );
}
