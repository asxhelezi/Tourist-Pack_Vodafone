"use client";

import { useEffect, useState } from "react";
import { Mail, QrCode } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import ConvertedPrice from "@/components/currency/ConvertedPrice";
import { useAuth } from "@/context/AuthContext";
import { usePack } from "@/context/PackContext";
import { useTranslation } from "@/hooks/useTranslation";
import PaymentMethodPicker, {
  type PaymentMethod,
} from "@/components/activation/PaymentMethodPicker";
import { confirmOrderPayment, createOrder } from "@/lib/api/orders";
import { resolvePackageId } from "@/lib/api/packages";
import {
  validateEmail,
  validateName,
  validatePaymentDetails,
  validateUsername,
  type FieldErrors,
} from "@/lib/validation/paymentForm";

const HOW_HEARD_OPTIONS = [
  { value: "social", labelKey: "payment.howHeardSocial" },
  { value: "friend", labelKey: "payment.howHeardFriend" },
  { value: "airport", labelKey: "payment.howHeardAirport" },
  { value: "hotel", labelKey: "payment.howHeardHotel" },
  { value: "other", labelKey: "payment.howHeardOther" },
] as const;

interface PaymentActivationModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * The full activation payment flow, opened directly from a pack's
 * "Activate pack" button: step 1 (choose a payment method), step 2
 * (payment reconfirmation / new-user details), and step 3 (confirmation
 * email + pending QR scan). Built on the shared Modal primitive.
 */
export default function PaymentActivationModal({
  open,
  onClose,
}: PaymentActivationModalProps) {
  const { t, locale } = useTranslation();
  const { isLoggedIn, user, updateUser } = useAuth();
  const { selected, submitForConfirmation, confirmActivation, stage } = usePack();

  const [step, setStep] = useState<"method" | "confirm" | "done">("method");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Existing-user reconfirmation state — blank paymentDetailsDraft means
  // "keep the card on file" (only meaningful when paymentMethod is "card";
  // paypal/mobileWallet have nothing on file, so it's always required there).
  const [paymentDetailsDraft, setPaymentDetailsDraft] = useState("");
  const [emailDraft, setEmailDraft] = useState(user?.email ?? "");

  // New-user form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [paymentDetails, setPaymentDetails] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const methodLabel = paymentMethod ? t(`payment.${paymentMethod}`) : "";

  useEffect(() => {
    if (open) {
      // Reopening a pack that's already awaiting its QR scan resumes there
      // instead of restarting payment method selection from scratch.
      setStep(stage === "pendingScan" || stage === "activated" ? "done" : "method");
      setPaymentDetailsDraft("");
      setEmailDraft(user?.email ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    setStep("method");
    setPaymentMethod(null);
    setFormError(null);
    setFieldErrors({});
    onClose();
  };

  const handlePickMethod = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setFormError(null);
    setFieldErrors({});
    setStep("confirm");
  };

  const handleConfirmExisting = async () => {
    if (!paymentMethod || !selected?.pack || !user) return;

    const keepExistingCard = paymentMethod === "card" && !paymentDetailsDraft.trim();

    const errors: FieldErrors = {};
    if (!keepExistingCard) {
      const detailsError = validatePaymentDetails(paymentDetailsDraft, paymentMethod, t);
      if (detailsError) errors.paymentDetails = detailsError;
    }
    const emailError = validateEmail(emailDraft, t);
    if (emailError) errors.email = emailError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }
    setFieldErrors({});

    setFormError(null);
    setIsSubmitting(true);
    try {
      const packageId = await resolvePackageId(selected.pack);
      const cardLast4 = keepExistingCard
        ? user.cardLast4 ?? undefined
        : paymentDetailsDraft.trim().replace(/[\s-]/g, "").slice(-4);
      const order = await createOrder({
        packageId,
        paymentMethod,
        firstName: user.name,
        lastName: user.surname,
        username: user.username ?? undefined,
        email: emailDraft.trim(),
        cardLast4: paymentMethod === "card" ? cardLast4 : undefined,
        locale,
      });
      await confirmOrderPayment(order.id);

      if (!keepExistingCard && paymentMethod === "card") updateUser({ cardLast4 });
      if (emailDraft.trim() !== user.email) updateUser({ email: emailDraft.trim() });
      submitForConfirmation();
      setStep("done");
    } catch {
      setFormError(t("common.orderFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmNewUser = async () => {
    if (!paymentMethod || !selected?.pack) return;

    const errors: FieldErrors = {};
    const firstNameError = validateName(firstName, t);
    if (firstNameError) errors.firstName = firstNameError;
    const lastNameError = validateName(lastName, t);
    if (lastNameError) errors.lastName = lastNameError;
    const usernameError = validateUsername(username, t);
    if (usernameError) errors.username = usernameError;
    const emailError = validateEmail(email, t);
    if (emailError) errors.email = emailError;
    const paymentDetailsError = validatePaymentDetails(paymentDetails, paymentMethod, t);
    if (paymentDetailsError) errors.paymentDetails = paymentDetailsError;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }
    setFieldErrors({});

    setFormError(null);
    setIsSubmitting(true);
    try {
      const packageId = await resolvePackageId(selected.pack);
      const order = await createOrder({
        packageId,
        paymentMethod,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        username: username.trim(),
        email: email.trim(),
        cardLast4: paymentMethod === "card" ? paymentDetails.trim().slice(-4) : undefined,
        locale,
      });
      await confirmOrderPayment(order.id);

      submitForConfirmation();
      setStep("done");
    } catch {
      setFormError(t("common.orderFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName =
    "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-50 focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30";
  const fieldErrorClassName = "mt-1 text-xs font-medium text-red-600 dark:text-red-400";

  return (
    <Modal
      open={open}
      onClose={handleClose}
      label={t("payment.confirmTitle")}
      closeLabel={t("common.close")}
      panelClassName="max-w-lg"
    >
      <div className="p-6">
        {selected?.pack && step !== "done" && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-50">
                {t(selected.pack.titleKey)}
              </p>
              <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                {selected.pack.durationDays}{" "}
                {selected.pack.durationDays === 1 ? t("packs.day") : t("packs.days")} ·{" "}
                {selected.pack.dataGB} GB {t("packs.data")}
              </p>
            </div>
            <ConvertedPrice amountALL={selected.pack.priceALL} size="md" />
          </div>
        )}

        {step === "method" && (
          <>
            <h2 className="text-center text-xl font-bold text-gray-900 dark:text-gray-50">
              {t("activation.choosePayment")}
            </h2>
            <div className="mt-5">
              <PaymentMethodPicker onSelect={handlePickMethod} />
            </div>
          </>
        )}

        {step === "confirm" && (
          <>
            <button
              type="button"
              onClick={() => setStep("method")}
              className="text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              ← {t("common.back")}
            </button>
            <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-gray-50">{t("payment.confirmTitle")}</h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{methodLabel}</p>

            {isLoggedIn ? (
              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="existing-details" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {paymentMethod === "card" ? t("payment.cardLabel") : t("payment.paymentDetails")}
                  </label>
                  {paymentMethod === "card" && (
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      {t("payment.cardOnFileHint", { last4: user?.cardLast4 ?? "----" })}
                    </p>
                  )}
                  <input
                    id="existing-details"
                    value={paymentDetailsDraft}
                    onChange={(e) => {
                      setPaymentDetailsDraft(e.target.value);
                      clearFieldError("paymentDetails");
                    }}
                    placeholder={
                      paymentMethod === "card"
                        ? t("payment.cardLabel")
                        : t("payment.paymentDetailsPlaceholder")
                    }
                    aria-label={paymentMethod === "card" ? t("payment.cardLabel") : t("payment.paymentDetails")}
                    className={`${inputClassName} mt-1`}
                  />
                  {fieldErrors.paymentDetails && (
                    <p className={fieldErrorClassName} role="alert">
                      {fieldErrors.paymentDetails}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="existing-email" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.email")}
                  </label>
                  <input
                    id="existing-email"
                    type="email"
                    value={emailDraft}
                    onChange={(e) => {
                      setEmailDraft(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`${inputClassName} mt-1`}
                  />
                  {fieldErrors.email && (
                    <p className={fieldErrorClassName} role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200" role="alert">
                    {formError}
                  </p>
                )}

                <Button className="w-full" onClick={handleConfirmExisting} loading={isSubmitting}>
                  {t("payment.confirmAndContinue")}
                </Button>
              </div>
            ) : (
              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleConfirmNewUser();
                }}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50">{t("payment.newUserTitle")}</p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="pay-first" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {t("payment.firstName")}
                    </label>
                    <input
                      id="pay-first"
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearFieldError("firstName");
                      }}
                      className={`${inputClassName} mt-1`}
                      required
                    />
                    {fieldErrors.firstName && (
                      <p className={fieldErrorClassName} role="alert">
                        {fieldErrors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="pay-last" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                      {t("payment.lastName")}
                    </label>
                    <input
                      id="pay-last"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearFieldError("lastName");
                      }}
                      className={`${inputClassName} mt-1`}
                      required
                    />
                    {fieldErrors.lastName && (
                      <p className={fieldErrorClassName} role="alert">
                        {fieldErrors.lastName}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="pay-username" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.username")}
                  </label>
                  <input
                    id="pay-username"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      clearFieldError("username");
                    }}
                    className={`${inputClassName} mt-1`}
                    required
                  />
                  {fieldErrors.username && (
                    <p className={fieldErrorClassName} role="alert">
                      {fieldErrors.username}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pay-email" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.email")}
                  </label>
                  <input
                    id="pay-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      clearFieldError("email");
                    }}
                    className={`${inputClassName} mt-1`}
                    required
                  />
                  {fieldErrors.email && (
                    <p className={fieldErrorClassName} role="alert">
                      {fieldErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.paymentMethod")}
                  </span>
                  <p className="mt-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-200">
                    {methodLabel}
                  </p>
                </div>

                <div>
                  <label htmlFor="pay-details" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.paymentDetails")}
                  </label>
                  <input
                    id="pay-details"
                    value={paymentDetails}
                    onChange={(e) => {
                      setPaymentDetails(e.target.value);
                      clearFieldError("paymentDetails");
                    }}
                    placeholder={t("payment.paymentDetailsPlaceholder")}
                    className={`${inputClassName} mt-1`}
                    required
                  />
                  {fieldErrors.paymentDetails && (
                    <p className={fieldErrorClassName} role="alert">
                      {fieldErrors.paymentDetails}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="pay-howheard" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                    {t("payment.howHeard")}
                  </label>
                  <select
                    id="pay-howheard"
                    value={howHeard}
                    onChange={(e) => setHowHeard(e.target.value)}
                    className={`${inputClassName} mt-1`}
                  >
                    <option value="">{t("payment.howHeardChoose")}</option>
                    {HOW_HEARD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {t(opt.labelKey)}
                      </option>
                    ))}
                  </select>
                </div>

                {formError && (
                  <p className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/30 p-3 text-sm text-red-800 dark:text-red-200" role="alert">
                    {formError}
                  </p>
                )}

                <Button type="submit" className="w-full" loading={isSubmitting}>
                  {t("payment.confirmAndContinue")}
                </Button>
              </form>
            )}
          </>
        )}

        {step === "done" && (
          <div className="text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400">
              <Mail size={26} aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-50">
              {t("activation.pendingScanTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600 dark:text-gray-300">
              {t("activation.pendingScanText")}
            </p>

            <div className="mx-auto mt-5 flex h-32 w-32 items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
              <QrCode size={56} aria-hidden="true" />
            </div>

            {stage === "pendingScan" && (
              <Button variant="secondary" size="sm" className="mt-5" onClick={confirmActivation}>
                {t("activation.simulateScan")}
              </Button>
            )}

            <div className="mt-5">
              <Button variant="ghost" size="sm" onClick={handleClose}>
                {t("common.close")}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
