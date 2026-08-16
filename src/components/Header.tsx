"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { LANGS, useI18n } from "@/lib/i18n";

export default function Header() {
  const pathname = usePathname();
  const isPro = pathname.startsWith("/pro");
  const { lang, setLang, t } = useI18n();

  const nav = [
    { href: "/recherche?ville=paris", label: t("nav.rent") },
    { href: "/#villes", label: t("nav.cities") },
    { href: "/#services", label: t("nav.services") },
  ];

  return (
    <header className="sticky top-0 z-[1100] border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-ak flex h-16 items-center justify-between gap-6">
        <Logo suffix={isPro ? "back-office" : undefined} />

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="nav-link text-[0.9375rem] font-medium lowercase text-ink-soft transition-colors hover:text-navy"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* sélecteur de langue */}
          <div
            className="flex items-center rounded-full bg-fill p-0.5"
            role="group"
            aria-label="langue"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition-colors ${
                  lang === l ? "bg-navy text-white" : "text-muted hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/recherche?ville=paris"
            className="btn btn-primary hidden !px-4 !py-2.5 sm:inline-flex"
          >
            {t("nav.find")}
          </Link>
        </div>
      </div>
    </header>
  );
}
