import Link from "next/link";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
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
    title: "professionnels",
    links: [
      { label: "espace pro", href: "/pro" },
      { label: "publier une annonce", href: "/pro/annonces/nouvelle" },
      { label: "gérer mes annonces", href: "/pro/annonces" },
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

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-line bg-sand">
      <div className="container-ak grid gap-10 py-14 md:grid-cols-[1.4fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-extrabold lowercase tracking-tight text-ink">
              akelius
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
          </div>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            des appartements rénovés avec soin, dans les plus beaux quartiers
            de paris, londres et montréal.
          </p>
          <p className="mt-4 text-sm font-semibold lowercase text-ink-soft">
            a better way to live
          </p>
        </div>
        {COLS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-xs font-bold lowercase tracking-[0.14em] text-muted">
              {col.title}
            </h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm lowercase text-ink-soft transition-colors hover:text-brand"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
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
