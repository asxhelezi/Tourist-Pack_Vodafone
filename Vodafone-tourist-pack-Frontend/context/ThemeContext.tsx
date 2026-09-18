"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const DARK_MODE_KEY = "vf-dark-mode";
const NOTIFICATIONS_KEY = "vf-notifications-enabled";

export const BACKGROUND_LIGHT = "/assets/backgrounds/photo1.png";
export const BACKGROUND_DARK = "/assets/backgrounds/photo2.png";

interface ThemeContextValue {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  toggleDarkMode: () => void;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (value: boolean) => void;
  toggleNotifications: () => void;
  /** Background image path for the current mode (light -> photo1, dark -> photo2). */
  backgroundImage: string;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkModeState] = useState(false);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(true);

  useEffect(() => {
    try {
      const storedDark = window.localStorage.getItem(DARK_MODE_KEY);
      if (storedDark != null) setDarkModeState(storedDark === "true");

      const storedNotif = window.localStorage.getItem(NOTIFICATIONS_KEY);
      if (storedNotif != null) setNotificationsEnabledState(storedNotif === "true");
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const setDarkMode = useCallback((value: boolean) => {
    setDarkModeState(value);
    try {
      window.localStorage.setItem(DARK_MODE_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode);
  }, [darkMode, setDarkMode]);

  const setNotificationsEnabled = useCallback((value: boolean) => {
    setNotificationsEnabledState(value);
    try {
      window.localStorage.setItem(NOTIFICATIONS_KEY, String(value));
    } catch {
      // ignore
    }
  }, []);

  const toggleNotifications = useCallback(() => {
    setNotificationsEnabled(!notificationsEnabled);
  }, [notificationsEnabled, setNotificationsEnabled]);

  const backgroundImage = darkMode ? BACKGROUND_DARK : BACKGROUND_LIGHT;

  const value = useMemo(
    () => ({
      darkMode,
      setDarkMode,
      toggleDarkMode,
      notificationsEnabled,
      setNotificationsEnabled,
      toggleNotifications,
      backgroundImage,
    }),
    [
      darkMode,
      setDarkMode,
      toggleDarkMode,
      notificationsEnabled,
      setNotificationsEnabled,
      toggleNotifications,
      backgroundImage,
    ]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
