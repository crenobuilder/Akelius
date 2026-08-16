"use client";

import Link from "next/link";
import { Wordmark } from "./Logo";
import { useI18n } from "@/lib/i18n";

/* liens vers les sites officiels du groupe (nouvel onglet) */
const OFFICIAL_LINKS: { label: string; href: string }[] = [
  { label: "akelius.fr — site officiel", href: "https://akelius.fr/en" },
  { label: "annonces paris (site actuel)", href: "https://akelius.fr/en/search/france/apartment/paris" },
  { label: "akelius.com — groupe", href: "https://www.akelius.com/en/akelius" },
  { label: "à propos d’akelius", href: "https://www.akelius.fr/en/akelius/about" },
  { label: "contact paris", href: "https://akelius.fr/en/contact/paris" },
  { label: "akelius royaume-uni", href: "https://www.residential-akelius.co.uk" },
  { label: "mentions légales", href: "https://www.akelius.fr/mentions-legales" },
];

export default function Footer() {
  const { t } = useI18n();

  const cols: { title: string; links: { label: string; href: string }[] }[] = [
    {
      title: t("footer.rent"),
      links: [
        { label: t("footer.inCity", { city: "paris" }), href: "/recherche?ville=paris" },
        { label: t("footer.inCity", { city: "londres" }), href: "/recherche?ville=londres" },
        { label: t("footer.inCity", { city: "new york" }), href: "/recherche?ville=new-york" },
        { label: t("footer.allListings"), href: "/recherche" },
      ],
    },
    {
      title: t("footer.about"),
      links: [
        { label: t("footer.services"), href: "/#services" },
        { label: t("footer.cities"), href: "/#villes" },
        { label: t("footer.contact"), href: "/#contact" },
      ],
    },
    {
      title: t("footer.team"),
      links: [
        { label: t("footer.backoffice"), href: "/pro" },
        { label: t("footer.publish"), href: "/pro/annonces/nouvelle" },
        { label: t("footer.manage"), href: "/pro/annonces" },
      ],
    },
  ];

  return (
    <footer id="contact" className="border-t border-line bg-sand">
      <div className="container-ak grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Wordmark className="h-6" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {t("footer.blurb")}
          </p>
          <p className="mt-4 text-sm font-semibold lowercase text-ink-soft">
            a better way to live
          </p>
          <address className="mt-4 text-sm not-italic leading-relaxed text-muted">
            akelius france
            <br />
            37-41 rue du rocher, 75008 paris
            <br />
            <a href="mailto:info@akelius.fr" className="hover:text-brand-deep">
              info@akelius.fr
            </a>
          </address>
        </div>

        {cols.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-xs font-bold lowercase tracking-[0.14em] text-muted">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm lowercase text-ink-soft transition-colors hover:text-brand-deep"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <nav aria-label={t("footer.official")}>
          <h3 className="text-xs font-bold lowercase tracking-[0.14em] text-muted">
            {t("footer.official")}
          </h3>
          <ul className="mt-4 space-y-2.5">
            {OFFICIAL_LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm lowercase text-ink-soft transition-colors hover:text-brand-deep"
                >
                  {l.label}
                  <span aria-hidden className="text-[0.7em] opacity-60">
                    ↗
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="container-ak flex flex-col gap-2 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.disclaimer")}</p>
          <p>{t("footer.proto")}</p>
        </div>
      </div>
    </footer>
  );
}
