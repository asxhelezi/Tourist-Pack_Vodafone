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

const STORAGE_KEY = "vf-auth-user";

export interface AuthUser {
  name: string;
  surname: string;
  username: string;
  email: string;
  /** Last 4 digits of the payment method on file (demo data only). */
  cardLast4: string;
}

interface AuthContextValue {
  isLoggedIn: boolean;
  user: AuthUser | null;
  /** Demo-only sign-in: stores a mock profile, no real authentication happens. */
  login: (user: AuthUser) => void;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const DEMO_USER: AuthUser = {
  name: "Asja",
  surname: "Hoxha",
  username: "asja",
  email: "asja@gmail.com",
  cardLast4: "192",
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      // ignore
    }
  }, []);

  const persist = (next: AuthUser | null) => {
    try {
      if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      else window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const login = useCallback((nextUser: AuthUser) => {
    setUser(nextUser);
    persist(nextUser);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    persist(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      const next = prev ? { ...prev, ...patch } : null;
      persist(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ isLoggedIn: user !== null, user, login, logout, updateUser }),
    [user, login, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

/** Demo seed data used by the "sign in" shortcut on the profile panel. */
export { DEMO_USER };
