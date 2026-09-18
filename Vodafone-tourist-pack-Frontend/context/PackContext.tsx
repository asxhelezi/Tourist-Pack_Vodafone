"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Pack } from "@/data/packs";
import type { GroupPack } from "@/data/groupPacks";

export type ActivationStage = "none" | "chosen" | "pendingScan" | "activated";

export interface SelectedPack {
  pack: Pack;
  groupPack: GroupPack | null;
  travellers: number;
}

interface PackContextValue {
  selected: SelectedPack | null;
  selectPack: (pack: Pack, groupPack?: GroupPack | null, travellers?: number) => void;
  clearSelection: () => void;
  stage: ActivationStage;
  /** Step 2 complete (payment confirmed) — moves to the "pending QR scan" state. */
  submitForConfirmation: () => void;
  /** Demo-only: simulates the QR-code scan that would normally happen outside the app. */
  confirmActivation: () => void;
  /** Fired listeners for mascot reactions. */
  lastAction: "selected" | "activated" | null;
}

const PackContext = createContext<PackContextValue | null>(null);

export function PackProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<SelectedPack | null>(null);
  const [stage, setStage] = useState<ActivationStage>("none");
  const [lastAction, setLastAction] = useState<"selected" | "activated" | null>(null);

  const selectPack = useCallback(
    (pack: Pack, groupPack: GroupPack | null = null, travellers = 1) => {
      setSelected({ pack, groupPack, travellers });
      setStage("chosen");
      setLastAction("selected");
    },
    []
  );

  const clearSelection = useCallback(() => {
    setSelected(null);
    setStage("none");
    setLastAction(null);
  }, []);

  const submitForConfirmation = useCallback(() => {
    setStage("pendingScan");
  }, []);

  const confirmActivation = useCallback(() => {
    setStage("activated");
    setLastAction("activated");
  }, []);

  const value = useMemo(
    () => ({
      selected,
      selectPack,
      clearSelection,
      stage,
      submitForConfirmation,
      confirmActivation,
      lastAction,
    }),
    [selected, selectPack, clearSelection, stage, submitForConfirmation, confirmActivation, lastAction]
  );

  return <PackContext.Provider value={value}>{children}</PackContext.Provider>;
}

export function usePack(): PackContextValue {
  const ctx = useContext(PackContext);
  if (!ctx) throw new Error("usePack must be used within PackProvider");
  return ctx;
}
