"use client";

import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import Container from "@/components/layout/Container";

const FOOTER_SECTIONS = [
  {
    titleKey: "footer.company",
    links: [
      { href: "#home", labelKey: "footer.aboutUs" },
      { href: "#home", labelKey: "footer.careers" },
      { href: "#events", labelKey: "footer.news" },
    ],
  },
  {
    titleKey: "footer.services",
    links: [
      { href: "#packs", labelKey: "footer.packages" },
      { href: "#packs", labelKey: "footer.roaming" },
      { href: "#packs", labelKey: "footer.internet" },
    ],
  },
  {
    titleKey: "footer.support",
    links: [
      { href: "#support", labelKey: "footer.helpCenter" },
      { href: "#support", labelKey: "footer.contact" },
      { href: "#support", labelKey: "footer.faq" },
    ],
  },
] as const;

const SOCIAL_LINKS = [
  { label: "Facebook", Icon: Facebook },
  { label: "Instagram", Icon: Instagram },
  { label: "Twitter", Icon: Twitter },
  { label: "YouTube", Icon: Youtube },
] as const;

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-neutral-950 text-white">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-8 md:grid-cols-[1.2fr_2fr]">
          <p className="text-sm leading-relaxed text-neutral-300">
            {t("footer.description")}
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {FOOTER_SECTIONS.map((section) => (
              <nav key={section.titleKey} aria-label={t(section.titleKey)}>
                <h3 className="mb-3 text-sm font-bold">{t(section.titleKey)}</h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.labelKey}>
                      <a
                        href={link.href}
                        className="text-sm text-neutral-400 transition hover:text-[#E60000]"
                      >
                        {t(link.labelKey)}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-800 pt-6 sm:flex-row">
          <div className="text-xs text-neutral-400">
            © {year} Vodafone Albania. {t("footer.rights")}
            <span className="mt-1 block text-neutral-500">
              {t("footer.demoProject")}
            </span>
          </div>
          <ul className="flex gap-3">
            {SOCIAL_LINKS.map(({ label, Icon }) => (
              <li key={label}>
                <a
                  href="https://www.vodafone.al"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex rounded-full p-2 text-neutral-400 transition hover:bg-neutral-800 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E60000]"
                >
                  <Icon size={18} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
