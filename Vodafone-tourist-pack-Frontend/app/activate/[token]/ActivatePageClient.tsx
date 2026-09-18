"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, QrCode, XCircle } from "lucide-react";
import SiteShell from "@/components/layout/SiteShell";
import Container from "@/components/layout/Container";
import Button from "@/components/ui/Button";
import { useTranslation } from "@/hooks/useTranslation";

/**
 * Opened when a customer scans their activation QR with their own phone
 * camera (see the backend's QrCodeService — the QR encodes exactly this
 * URL, "{frontend-base-url}/activate/{token}", never raw user/order data).
 * Previews the token via GET, then activates it via POST on confirmation.
 */
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080";

type ActivePackageStatus = "ISSUED" | "SCANNED" | "ACTIVE" | "EXPIRED";

interface ActivePackageResponse {
  token: string;
  status: ActivePackageStatus;
  packageName: string;
  orderId: number;
  issuedAt: string;
  activatedAt: string | null;
  expiresAt: string | null;
}

interface ApiErrorResponse {
  code: "INVALID_TOKEN" | "ALREADY_USED" | "EXPIRED" | "NOT_FOUND" | "VALIDATION_ERROR" | "INTERNAL_ERROR";
  message: string;
}

type ViewState =
  | { phase: "loading" }
  | { phase: "preview"; data: ActivePackageResponse }
  | { phase: "activating"; data: ActivePackageResponse }
  | { phase: "success"; data: ActivePackageResponse }
  | { phase: "error"; code: ApiErrorResponse["code"] };

export default function ActivatePageClient({ token }: { token: string }) {
  const { t } = useTranslation();
  const [state, setState] = useState<ViewState>({ phase: "loading" });

  useEffect(() => {
    let cancelled = false;

    fetch(`${BACKEND_URL}/api/active-packages/${token}`)
      .then(async (res) => {
        if (cancelled) return;
        if (!res.ok) {
          const body = (await res.json().catch(() => null)) as ApiErrorResponse | null;
          setState({ phase: "error", code: body?.code ?? "INTERNAL_ERROR" });
          return;
        }
        const data = (await res.json()) as ActivePackageResponse;
        setState(
          data.status === "ACTIVE"
            ? { phase: "success", data }
            : { phase: "preview", data }
        );
      })
      .catch(() => {
        if (!cancelled) setState({ phase: "error", code: "INTERNAL_ERROR" });
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  const handleActivate = async () => {
    if (state.phase !== "preview") return;
    setState({ phase: "activating", data: state.data });

    try {
      const res = await fetch(`${BACKEND_URL}/api/active-packages/${token}/redeem`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as ApiErrorResponse | null;
        setState({ phase: "error", code: body?.code ?? "INTERNAL_ERROR" });
        return;
      }
      const data = (await res.json()) as ActivePackageResponse;
      setState({ phase: "success", data });
    } catch {
      setState({ phase: "error", code: "INTERNAL_ERROR" });
    }
  };

  const errorCopy: Record<ApiErrorResponse["code"], { title: string; text: string }> = {
    INVALID_TOKEN: { title: t("activate.invalidTitle"), text: t("activate.invalidText") },
    NOT_FOUND: { title: t("activate.invalidTitle"), text: t("activate.invalidText") },
    ALREADY_USED: { title: t("activate.alreadyUsedTitle"), text: t("activate.alreadyUsedText") },
    EXPIRED: { title: t("activate.expiredTitle"), text: t("activate.expiredText") },
    VALIDATION_ERROR: { title: t("activate.invalidTitle"), text: t("activate.genericError") },
    INTERNAL_ERROR: { title: t("activate.invalidTitle"), text: t("activate.genericError") },
  };

  return (
    <SiteShell>
      <Container className="py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 text-center shadow-sm">
          {state.phase === "loading" && (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400">
                <QrCode size={26} aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">{t("common.loading")}</p>
            </>
          )}

          {(state.phase === "preview" || state.phase === "activating") && (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-[#E60000] dark:text-red-400">
                <QrCode size={26} aria-hidden="true" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-50">
                {t("activate.title")}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {state.data.packageName}
              </p>
              <Button
                className="mt-6 w-full"
                onClick={handleActivate}
                loading={state.phase === "activating"}
              >
                {state.phase === "activating" ? t("activate.activating") : t("activate.confirmButton")}
              </Button>
            </>
          )}

          {state.phase === "success" && (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
                <CheckCircle2 size={26} aria-hidden="true" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-50">
                {t("activate.successTitle")}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {state.data.packageName}
              </p>
            </>
          )}

          {state.phase === "error" && (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
                <XCircle size={26} aria-hidden="true" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-gray-900 dark:text-gray-50">
                {errorCopy[state.code].title}
              </h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                {errorCopy[state.code].text}
              </p>
            </>
          )}
        </div>
      </Container>
    </SiteShell>
  );
}
