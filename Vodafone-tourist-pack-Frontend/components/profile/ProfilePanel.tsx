"use client";

import { useState } from "react";
import { Bookmark, LogIn, LogOut, MapPin, Moon, Pencil, Sun, Bell, BellOff } from "lucide-react";
import Drawer from "@/components/ui/Drawer";
import Button from "@/components/ui/Button";
import { useAuth, DEMO_USER } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useTranslation } from "@/hooks/useTranslation";
import { DESTINATIONS } from "@/data/destinations";

interface ProfilePanelProps {
  open: boolean;
  onClose: () => void;
}

/** Profile panel (spec item 12): profile details, saved locations, and
 * appearance/notification preferences, opened from the header's profile icon. */
export default function ProfilePanel({ open, onClose }: ProfilePanelProps) {
  const { t } = useTranslation();
  const { isLoggedIn, user, login, logout, updateUser } = useAuth();
  const { darkMode, toggleDarkMode, notificationsEnabled, toggleNotifications } = useTheme();
  const [saved, setSaved] = useLocalStorage<string[]>("vf-saved-places", []);

  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(user);

  const savedDestinations = DESTINATIONS.filter((d) => saved.includes(d.id));

  const removeSaved = (id: string) => setSaved((prev) => prev.filter((s) => s !== id));

  const startEditing = () => {
    setDraft(user);
    setEditing(true);
  };

  const saveEditing = () => {
    if (draft) updateUser(draft);
    setEditing(false);
  };

  const inputClassName =
    "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-50 focus:border-[#E60000] focus:outline-none focus:ring-2 focus:ring-[#E60000]/30";

  return (
    <Drawer
      open={open}
      onClose={onClose}
      label={t("profile.title")}
      closeLabel={t("common.close")}
      title={t("profile.title")}
    >
      <div className="space-y-6">
        {/* Profile details */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("profile.details")}
          </h3>

          {!isLoggedIn && (
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-300">{t("profile.notSignedIn")}</p>
              <Button
                size="sm"
                className="mx-auto mt-3 flex"
                onClick={() => login(DEMO_USER)}
              >
                <LogIn size={15} aria-hidden="true" />
                {t("profile.demoSignIn")}
              </Button>
            </div>
          )}

          {isLoggedIn && user && !editing && (
            <div className="mt-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-50">
                    {user.name} {user.surname}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">@{user.username}</p>
                  <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">•••• {user.cardLast4}</p>
                </div>
                <button
                  type="button"
                  onClick={startEditing}
                  aria-label={t("profile.edit")}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-500 dark:text-gray-400 transition hover:bg-gray-100 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
                >
                  <Pencil size={16} aria-hidden="true" />
                </button>
              </div>
              <button
                type="button"
                onClick={logout}
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
              >
                <LogOut size={13} aria-hidden="true" />
                {t("profile.signOut")}
              </button>
            </div>
          )}

          {isLoggedIn && draft && editing && (
            <form
              className="mt-3 space-y-3 rounded-xl border border-gray-200 dark:border-gray-700 p-4"
              onSubmit={(e) => {
                e.preventDefault();
                saveEditing();
              }}
            >
              <div>
                <label htmlFor="profile-name" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {t("payment.firstName")}
                </label>
                <input
                  id="profile-name"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className={`${inputClassName} mt-1`}
                />
              </div>
              <div>
                <label htmlFor="profile-email" className="text-xs font-semibold text-gray-700 dark:text-gray-200">
                  {t("payment.email")}
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={draft.email}
                  onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                  className={`${inputClassName} mt-1`}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">
                  {t("common.confirm")}
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  {t("common.close")}
                </Button>
              </div>
            </form>
          )}
        </section>

        {/* Saved locations */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("profile.savedLocations")}
          </h3>
          {savedDestinations.length === 0 ? (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{t("profile.noSavedLocations")}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {savedDestinations.map((d) => (
                <li
                  key={d.id}
                  className="flex items-center justify-between gap-2 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2"
                >
                  <span className="inline-flex min-w-0 items-center gap-2 text-sm text-gray-800 dark:text-gray-100">
                    <MapPin size={14} className="shrink-0 text-[#E60000] dark:text-red-400" aria-hidden="true" />
                    <span className="truncate">{d.name}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSaved(d.id)}
                    aria-label={t("map.removeFavorite")}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 dark:text-gray-500 transition hover:bg-gray-100 hover:text-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
                  >
                    <Bookmark size={16} fill="currentColor" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Preferences */}
        <section>
          <h3 className="text-sm font-bold uppercase tracking-wide text-gray-500 dark:text-gray-400">
            {t("profile.preferences")}
          </h3>
          <div className="mt-2 space-y-2">
            <button
              type="button"
              onClick={toggleDarkMode}
              aria-pressed={darkMode}
              className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-left text-sm font-medium text-gray-800 dark:text-gray-100 transition hover:border-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <span className="inline-flex items-center gap-2">
                {darkMode ? (
                  <Moon size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
                ) : (
                  <Sun size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
                )}
                {t("profile.darkMode")}
              </span>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  darkMode ? "bg-[#E60000]" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white dark:bg-gray-900 shadow transition-transform ${
                    darkMode ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>

            <button
              type="button"
              onClick={toggleNotifications}
              aria-pressed={notificationsEnabled}
              className="flex min-h-[44px] w-full items-center justify-between rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2.5 text-left text-sm font-medium text-gray-800 dark:text-gray-100 transition hover:border-[#E60000] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
            >
              <span className="inline-flex items-center gap-2">
                {notificationsEnabled ? (
                  <Bell size={16} className="text-[#E60000] dark:text-red-400" aria-hidden="true" />
                ) : (
                  <BellOff size={16} className="text-gray-400 dark:text-gray-500" aria-hidden="true" />
                )}
                {t("profile.notifications")}
              </span>
              <span
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  notificationsEnabled ? "bg-[#E60000]" : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white dark:bg-gray-900 shadow transition-transform ${
                    notificationsEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </span>
            </button>
          </div>
        </section>
      </div>
    </Drawer>
  );
}
