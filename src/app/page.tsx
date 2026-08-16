import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import SmartImage from "@/components/SmartImage";
import Reveal from "@/components/Reveal";
import { LISTINGS } from "@/data/listings";
import { CITIES } from "@/data/cities";

const HERO_IMG =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2200&q=80";


/* tuiles de services, iconographie et couleurs reprises du site akelius */
const SERVICES = [
  {
    title: "des logements rénovés",
    text: "chaque appartement est remis à neuf avant votre arrivée : cuisine, salle de bains, sols et peintures.",
    color: "var(--color-tile-rose)",
    icon: "M4 21V8l8-5 8 5v13h-6v-7h-4v7H4z",
  },
  {
    title: "un service qui répond",
    text: "une équipe locale joignable 24 h/24 pour les urgences, et un suivi des demandes en ligne.",
    color: "var(--color-tile-blue)",
    icon: "M12 3a9 9 0 100 18 9 9 0 000-18zm1 5v4.2l3.2 1.9-.9 1.5L11 13V8h2z",
  },
  {
    title: "sans frais cachés",
    text: "des loyers clairs, charges détaillées, dossier 100 % en ligne et état des lieux transparent.",
    color: "var(--color-tile-green)",
    icon: "M4 20V4h2v14h14v2H4zm4-5l4-6 3 3 4-7 1.8 1-5.3 9-3-3-3 4.5L8 15z",
  },
  {
    title: "présents dans 4 pays",
    text: "des immeubles détenus et gérés en propre dans neuf métropoles, de paris à new york — un seul interlocuteur.",
    color: "var(--color-tile-orange)",
    icon: "M12 3a9 9 0 100 18 9 9 0 000-18zM3.6 9h16.8M3.6 15h16.8M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z",
  },
];

export default function Home() {
  const featured = LISTINGS.filter((l) => l.featured).slice(0, 4);

  return (
    <>
      {/* ---- hero ---- */}
      <section className="relative">
        <div className="absolute inset-0 overflow-hidden">
          <SmartImage
            src={HERO_IMG}
            alt="séjour lumineux d’un appartement akelius"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-ink/55 via-ink/25 to-ink/45" />
        </div>
        <div className="container-ak relative flex min-h-[560px] flex-col justify-center py-20">
          <Reveal>
            <p className="kicker !text-white/85">location d’appartements</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-extrabold lowercase leading-[1.08] tracking-tight text-white md:text-6xl">
              a better way <br />to live
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/90">
              des appartements rénovés avec soin, dans neuf métropoles
              d’europe et d’amérique du nord.
            </p>
          </Reveal>
          <Reveal delay={150} className="mt-8 max-w-4xl">
            <div className="rounded-[var(--radius-ak)] bg-paper p-4 shadow-[var(--shadow-float)]">
              <Suspense>
                <SearchBar variant="compact" />
              </Suspense>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- chiffres ---- */}
      <section className="border-b border-line bg-sand">
        <div className="container-ak grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            ["19 000", "appartements en propre"],
            ["9", "villes dans le monde"],
            ["24 h/24", "service locataire"],
            ["0 €", "frais d’agence"],
          ].map(([n, label], i) => (
            <Reveal key={label} delay={i * 90}>
              <p className="text-3xl font-extrabold tracking-tight text-navy">{n}</p>
              <p className="mt-1 text-sm lowercase text-muted">{label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- biens à la une ---- */}
      <section className="container-ak py-16">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="kicker">sélection</p>
              <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
                biens à la une
              </h2>
            </div>
            <Link
              href="/recherche?ville=paris"
              className="nav-link hidden text-sm font-semibold lowercase text-brand-deep sm:block"
            >
              voir toutes les annonces →
            </Link>
          </div>
        </Reveal>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l, i) => (
            <Reveal key={l.id} delay={i * 90}>
              <ListingCard listing={l} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- villes ---- */}
      <section id="villes" className="border-y border-line bg-sand py-16">
        <div className="container-ak">
          <Reveal>
            <p className="kicker">où nous trouver</p>
            <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
              nos villes
            </h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
            {CITIES.map((c, i) => {
              const count = LISTINGS.filter((l) => l.city === c.slug).length;
              return (
                <Reveal key={c.slug} delay={(i % 5) * 80}>
                  <Link
                    href={`/recherche?ville=${c.slug}`}
                    className="card-lift group relative block overflow-hidden rounded-[var(--radius-ak)] shadow-[var(--shadow-card)]"
                  >
                    <div className="aspect-[4/5] bg-sand-deep">
                      <SmartImage
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/10 to-transparent" />
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2 py-0.5 text-sm shadow-sm backdrop-blur">
                      {c.flag}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-lg font-extrabold lowercase leading-tight text-white">
                        {c.name}
                      </h3>
                      <p className="mt-0.5 text-xs text-white/85">
                        {count > 0 ? `${count} logements dans la démo` : c.blurb}
                      </p>
                    </div>
                  </Link>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- services : tuiles colorées akelius ---- */}
      <section id="services" className="container-ak py-16">
        <Reveal>
          <p className="kicker">pourquoi akelius</p>
          <h2 className="mt-2 max-w-lg text-3xl font-extrabold lowercase tracking-tight text-ink">
            louer en direct auprès du propriétaire
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <span
                className="ak-tile h-20 w-20"
                style={{ backgroundColor: s.color }}
              >
                <svg viewBox="0 0 24 24" className="h-9 w-9 fill-none stroke-white stroke-[1.7]">
                  <path d={s.icon} strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold lowercase text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---- bande pro ---- */}
      <section className="bg-navy py-16 text-white">
        <div className="container-ak flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <Reveal className="max-w-xl">
            <p className="kicker !text-brand">back-office — outil interne</p>
            <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight">
              équipes akelius : publiez un bien en quelques minutes
            </h2>
            <p className="mt-3 text-white/75">
              l’outil de gestion du parc : création d’annonce guidée, photos,
              loyer et disponibilité. le bien apparaît immédiatement dans la
              recherche et sur la carte.
            </p>
          </Reveal>
          <Reveal delay={120} className="flex gap-3">
            <Link href="/pro/annonces/nouvelle" className="btn btn-brand">
              publier un bien
            </Link>
            <Link
              href="/pro"
              className="btn !border-white/30 !text-white btn-ghost hover:!border-white hover:!bg-white/10"
            >
              découvrir le back-office
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
