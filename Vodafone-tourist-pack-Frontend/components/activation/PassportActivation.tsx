"use client";

import { useState } from "react";
import { PartyPopper } from "lucide-react";
import { ActivationStep } from "@/components/ActivationStep";
import Button from "@/components/ui/Button";
import PaymentActivationModal from "@/components/activation/PaymentActivationModal";
import { usePack } from "@/context/PackContext";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Passport-stamp activation flow (spec 8.7): three steps —
 * 1) choose a pack, 2) pick a payment method and confirm details in a
 * modal, 3) confirmation email with a QR code to finish (represented as
 * a "pending scan" state, since the real scan happens outside the app).
 * The payment modal itself is opened directly from each pack's
 * "Activate pack" button; this section mirrors progress and offers a
 * fallback entry point if that modal gets closed early.
 * Preview flow only — no real payment or SIM activation.
 */
export default function PassportActivation() {
  const { t } = useTranslation();
  const { selected, stage } = usePack();
  const reducedMotion = useReducedMotion();

  const [modalOpen, setModalOpen] = useState(false);

  const stepsComplete = stage === "chosen" || stage === "pendingScan" || stage === "activated";
  const paymentDone = stage === "pendingScan" || stage === "activated";
  const fullyActivated = stage === "activated";

  const steps = [
    {
      number: "1",
      title: t("activation.step1Title"),
      text: t("activation.step1Text"),
      stamped: stepsComplete,
    },
    {
      number: "2",
      title: t("activation.step2Title"),
      text: t("activation.step2Text"),
      stamped: paymentDone,
    },
    {
      number: "3",
      title: t("activation.step3Title"),
      text: t("activation.step3Text"),
      stamped: fullyActivated,
    },
  ];

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <ActivationStep key={step.number} {...step} />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        {stage === "chosen" && selected && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t(selected.pack.titleKey)} — {t("activation.choosePayment")}
            </p>
            <Button className="mt-2" onClick={() => setModalOpen(true)}>
              {t("packs.activatePack")}
            </Button>
          </div>
        )}

        {stage === "pendingScan" && (
          <div className="rounded-2xl border border-blue-200 bg-blue-50 px-6 py-4">
            <p className="text-sm font-semibold text-blue-900">
              {t("activation.pendingScanTitle")}
            </p>
            <p className="mt-1 text-sm text-blue-800">{t("activation.pendingScanText")}</p>
            <Button
              variant="secondary"
              size="sm"
              className="mt-3"
              onClick={() => setModalOpen(true)}
            >
              {t("activation.simulateScan")}
            </Button>
          </div>
        )}

        {stage === "activated" && (
          <div
            className={`rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 px-6 py-4 ${
              reducedMotion ? "" : "motion-safe:animate-[fadeInUp_0.4s_ease-out]"
            }`}
            role="status"
          >
            <p className="flex items-center justify-center gap-2 text-lg font-bold text-green-800 dark:text-green-200">
              <PartyPopper size={20} aria-hidden="true" />
              {t("activation.readyTitle")}
            </p>

            <p className="mt-1 text-sm text-green-700 dark:text-green-300">{t("activation.readyText")}</p>
          </div>
        )}
      </div>

      <PaymentActivationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
