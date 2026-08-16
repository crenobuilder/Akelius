"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

const NAV = [
  { href: "/recherche?ville=paris", label: "louer" },
  { href: "/#villes", label: "nos villes" },
  { href: "/#services", label: "services" },
];

export default function Header() {
  const pathname = usePathname();
  const isPro = pathname.startsWith("/pro");

  return (
    <header className="sticky top-0 z-[1100] border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="container-ak flex h-16 items-center justify-between gap-6">
        <Logo suffix={isPro ? "pro" : undefined} />

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((item) => (
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
          <Link
            href="/recherche?ville=paris"
            className="btn btn-ghost hidden !px-4 !py-2.5 sm:inline-flex"
          >
            trouver un logement
          </Link>
          <Link
            href={isPro ? "/pro/annonces" : "/pro"}
            className="btn btn-primary !px-4 !py-2.5"
          >
            {isPro ? "mes annonces" : "espace pro"}
          </Link>
        </div>
      </div>
    </header>
  );
}
