import Link from "next/link";
import { Wordmark } from "./Logo";

const INTERNAL_COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "louer",
    links: [
      { label: "appartements à paris", href: "/recherche?ville=paris" },
      { label: "appartements à londres", href: "/recherche?ville=londres" },
      { label: "appartements à montréal", href: "/recherche?ville=montreal" },
      { label: "toutes nos annonces", href: "/recherche" },
    ],
  },
  {
    title: "équipe akelius",
    links: [
      { label: "back-office", href: "/pro" },
      { label: "publier un bien", href: "/pro/annonces/nouvelle" },
      { label: "gérer les annonces", href: "/pro/annonces" },
    ],
  },
  {
    title: "akelius",
    links: [
      { label: "nos services", href: "/#services" },
      { label: "nos villes", href: "/#villes" },
      { label: "contact", href: "/#contact" },
    ],
  },
];

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
  return (
    <footer id="contact" className="border-t border-line bg-sand">
      <div className="container-ak grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.3fr_repeat(4,1fr)]">
        <div>
          <Wordmark className="text-xl" />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            des appartements rénovés avec soin, dans dix métropoles
            d’europe et d’amérique du nord.
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

        {INTERNAL_COLS.map((col) => (
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

        <nav aria-label="sites officiels">
          <h3 className="text-xs font-bold lowercase tracking-[0.14em] text-muted">
            sites officiels
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
          <p>
            maquette de refonte non officielle — démonstration produit, non
            affiliée à akelius residential property ab
          </p>
          <p>© 2026 — prototype</p>
        </div>
      </div>
    </footer>
  );
}
