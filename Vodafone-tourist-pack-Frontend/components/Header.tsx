"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu, User, X } from "lucide-react";

import logo from "@/public/assets/branding/logo.png";
import LanguageSelector from "@/components/i18n/LanguageSelector";
import CurrencySelector from "@/components/currency/CurrencySelector";
import EventNotificationBell from "@/components/events/EventNotificationBell";
import Container from "@/components/layout/Container";
import ProfilePanel from "@/components/profile/ProfilePanel";
import { useTranslation } from "@/hooks/useTranslation";

const NAV_ITEMS = [
  { key: "nav.home", href: "/" },
  { key: "nav.explore", href: "/explore-albania" },
  { key: "nav.support", href: "/support" },
] as const;

export default function Header() {
  const { t } = useTranslation();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-red-950 bg-[#850100] text-white shadow-md">
      <Container className="flex items-center justify-between gap-3 py-3">
        {/* Vodafone logo */}
        <Link
          href="/"
          aria-label="Vodafone Albania"
          className="flex shrink-0 items-center gap-2"
          onClick={() => setMobileMenuOpen(false)}
        >
          <Image
            src={logo}
            alt="Vodafone logo"
            width={40}
            height={40}
            className="object-contain"
          />

          <span className="hidden text-lg font-bold text-white md:inline">
            Vodafone
          </span>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label={t("common.menu")}
          className="hidden items-center gap-1 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-lg px-3 py-2 text-sm font-medium text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                  active
                    ? "after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-white"
                    : "text-red-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>

        {/* Language, currency, notifications and mobile menu */}
        <div className="flex items-center gap-1 text-white">
          <EventNotificationBell />

          <LanguageSelector />

          <CurrencySelector />

          <button
            type="button"
            onClick={() => setProfileOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={profileOpen}
            aria-label={t("profile.title")}
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <User size={19} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="rounded-lg p-2 text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white lg:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label={
              mobileMenuOpen
                ? t("common.closeMenu")
                : t("common.openMenu")
            }
            onClick={() => setMobileMenuOpen((value) => !value)}
          >
            {mobileMenuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      <ProfilePanel
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label={t("common.menu")}
          className="border-t border-red-950 bg-[#7A0000] px-4 py-2 lg:hidden"
        >
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.key}
                href={item.href}
                aria-current={active ? "page" : undefined}
                onClick={() => setMobileMenuOpen(false)}
                className={`block border-b border-white/10 px-2 py-3 text-sm font-medium text-white transition-colors last:border-0 ${
                  active
                    ? "bg-white/10"
                    : "text-red-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t(item.key)}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}