"use client";

import { useCallback, useState } from "react";

export interface GeoState {
  status: "idle" | "locating" | "success" | "denied" | "error";
  coords: { latitude: number; longitude: number } | null;
}

/**
 * Geolocation on explicit user request only (spec 9.1): never call
 * `request()` on mount — only from a click handler.
 */
export function useGeolocation() {
  const [state, setState] = useState<GeoState>({ status: "idle", coords: null });

  const request = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setState({ status: "error", coords: null });
      return;
    }
    setState({ status: "locating", coords: null });
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: "success",
          coords: {
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          },
        }),
      (err) =>
        setState({
          status: err.code === err.PERMISSION_DENIED ? "denied" : "error",
          coords: null,
        }),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  }, []);

  return { ...state, request };
}
