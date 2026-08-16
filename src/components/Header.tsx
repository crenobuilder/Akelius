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
      <div className="container-ak relative flex h-16 items-center justify-between">
        {/* gauche : logo */}
        <div className="flex h-10 items-center">
          <Logo suffix={isPro ? "back-office" : undefined} />
        </div>

        {/* centre : navigation, réellement centrée dans la page */}
        <nav
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 lg:flex"
          aria-label="navigation principale"
        >
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

        {/* droite : langues + action, hauteurs alignées */}
        <div className="flex h-10 items-center gap-3">
          <div
            className="flex h-9 items-center rounded-full bg-fill p-1"
            role="group"
            aria-label="langue"
          >
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`flex h-7 items-center rounded-full px-2.5 text-[0.6875rem] font-bold uppercase tracking-wide transition-colors ${
                  lang === l ? "bg-navy text-white" : "text-muted hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            href="/recherche?ville=paris"
            className="btn btn-primary hidden h-9 !px-4 !py-0 text-sm sm:inline-flex"
          >
            {t("nav.find")}
          </Link>
        </div>
      </div>
    </header>
  );
}
