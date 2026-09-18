"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

/**
 * Full-bleed background image that swaps between photo1 (light) and
 * photo2 (dark) as the dark-mode toggle changes. If the image for the
 * active mode fails to load, falls back to a solid color instead of a
 * broken image icon: white for light mode, near-black (#0d0d0d, matching
 * UtilityBar) for dark mode.
 */
export default function AppBackground() {
  const { darkMode, backgroundImage } = useTheme();
  const [failed, setFailed] = useState(false);

  // Reset the failure state whenever we switch which image we're trying to load.
  useEffect(() => {
    setFailed(false);
  }, [backgroundImage]);

  const fallbackColor = darkMode ? "#0d0d0d" : "#ffffff";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        backgroundColor: fallbackColor,
      }}
    >
      {!failed && (
        // Plain <img> (not next/image) so onError can drive a true fallback
        // for locally-supplied placeholder assets.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={backgroundImage}
          alt=""
          onError={() => setFailed(true)}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      )}
    </div>
  );
}
