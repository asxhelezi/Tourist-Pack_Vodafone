"use client";

import { CreditCard, Smartphone, Wallet } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export type PaymentMethod = "card" | "paypal" | "mobileWallet";

const METHODS: { id: PaymentMethod; labelKey: string; Icon: typeof CreditCard }[] = [
  { id: "card", labelKey: "payment.card", Icon: CreditCard },
  { id: "paypal", labelKey: "payment.paypal", Icon: Wallet },
  { id: "mobileWallet", labelKey: "payment.mobileWallet", Icon: Smartphone },
];

interface PaymentMethodPickerProps {
  onSelect: (method: PaymentMethod) => void;
}

/**
 * Step 1 of the payment flow: choosing a payment method opens the
 * confirmation modal (step 2) as its next action.
 */
export default function PaymentMethodPicker({ onSelect }: PaymentMethodPickerProps) {
  const { t } = useTranslation();

  return (
    <div>
      <p className="text-center text-sm font-semibold text-gray-900 dark:text-gray-50">
        {t("activation.choosePayment")}
      </p>
      <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {METHODS.map(({ id, labelKey, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-4 py-3 text-sm font-semibold text-gray-800 dark:text-gray-100 transition hover:border-[#E60000] hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000] active:scale-[0.98]"
          >
            <Icon size={18} aria-hidden="true" />
            {t(labelKey)}
          </button>
        ))}
      </div>
    </div>
  );
}
