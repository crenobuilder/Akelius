import Link from "next/link";
import { Suspense } from "react";
import SearchBar from "@/components/SearchBar";
import ListingCard from "@/components/ListingCard";
import SmartImage from "@/components/SmartImage";
import { LISTINGS } from "@/data/listings";
import { CITIES } from "@/data/cities";

const HERO_IMG =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=2200&q=80";

const SERVICES = [
  {
    title: "des logements rénovés",
    text: "chaque appartement est remis à neuf avant votre arrivée : cuisine, salle de bains, sols et peintures.",
    icon: "M4 21V8l8-5 8 5v13h-6v-7h-4v7H4z",
  },
  {
    title: "un service qui répond",
    text: "une équipe locale joignable 24 h/24 pour les urgences, et un suivi des demandes en ligne.",
    icon: "M12 3a9 9 0 100 18 9 9 0 000-18zm1 5v4.2l3.2 1.9-.9 1.5L11 13V8h2z",
  },
  {
    title: "sans frais cachés",
    text: "des loyers clairs, charges détaillées, dossier 100 % en ligne et état des lieux transparent.",
    icon: "M5 4h14v16l-3.5-2-3.5 2-3.5-2L5 20V4zm3 5h8v2H8V9zm0 4h5v2H8v-2z",
  },
  {
    title: "présents dans 3 pays",
    text: "des immeubles détenus et gérés en propre à paris, londres et montréal — un seul interlocuteur.",
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
        <div className="container-ak relative flex min-h-[540px] flex-col justify-center py-20">
          <p className="kicker !text-white/85">location d’appartements</p>
          <h1 className="mt-3 max-w-2xl text-4xl font-extrabold lowercase leading-[1.08] tracking-tight text-white md:text-6xl">
            a better way<br />to live
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/90">
            des appartements rénovés avec soin, dans les plus beaux quartiers
            de paris, londres et montréal.
          </p>
          <div className="mt-8 max-w-4xl">
            <Suspense>
              <SearchBar variant="hero" />
            </Suspense>
          </div>
        </div>
      </section>

      {/* ---- chiffres ---- */}
      <section className="border-b border-line bg-sand">
        <div className="container-ak grid grid-cols-2 gap-6 py-10 md:grid-cols-4">
          {[
            ["19 000", "appartements en propre"],
            ["10", "villes dans le monde"],
            ["24 h/24", "service locataire"],
            ["0 €", "frais d’agence"],
          ].map(([n, label]) => (
            <div key={label}>
              <p className="text-3xl font-extrabold tracking-tight text-ink">{n}</p>
              <p className="mt-1 text-sm lowercase text-muted">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- biens à la une ---- */}
      <section className="container-ak py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="kicker">sélection</p>
            <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
              biens à la une
            </h2>
          </div>
          <Link
            href="/recherche?ville=paris"
            className="hidden text-sm font-semibold lowercase text-brand hover:text-brand-deep sm:block"
          >
            voir toutes les annonces →
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((l) => (
            <ListingCard key={l.id} listing={l} />
          ))}
        </div>
      </section>

      {/* ---- villes ---- */}
      <section id="villes" className="border-y border-line bg-sand py-16">
        <div className="container-ak">
          <p className="kicker">où nous trouver</p>
          <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
            nos villes
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {CITIES.map((c) => {
              const count = LISTINGS.filter((l) => l.city === c.slug).length;
              return (
                <Link
                  key={c.slug}
                  href={`/recherche?ville=${c.slug}`}
                  className="group relative block overflow-hidden rounded-[var(--radius-ak)] shadow-[var(--shadow-card)]"
                >
                  <div className="aspect-[4/3] bg-sand-deep">
                    <SmartImage
                      src={c.image}
                      alt={c.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h3 className="text-xl font-extrabold lowercase text-white">{c.name}</h3>
                    <p className="mt-0.5 text-sm text-white/85">
                      {count} logements · {c.blurb}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- services ---- */}
      <section id="services" className="container-ak py-16">
        <p className="kicker">pourquoi akelius</p>
        <h2 className="mt-2 max-w-lg text-3xl font-extrabold lowercase tracking-tight text-ink">
          louer en direct auprès du propriétaire
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((s) => (
            <div key={s.title}>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand-wash">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-brand stroke-[1.6]">
                  <path d={s.icon} strokeLinejoin="round" strokeLinecap="round" />
                </svg>
              </span>
              <h3 className="mt-4 text-base font-bold lowercase text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---- bande pro ---- */}
      <section className="bg-ink py-16 text-white">
        <div className="container-ak flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <p className="kicker">espace professionnel</p>
            <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight">
              gestionnaire ? publiez vos biens en quelques minutes
            </h2>
            <p className="mt-3 text-white/75">
              création d’annonce guidée, photos, loyer et disponibilité :
              votre bien apparaît immédiatement dans la recherche et sur la
              carte.
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/pro/annonces/nouvelle" className="btn btn-brand">
              publier une annonce
            </Link>
            <Link
              href="/pro"
              className="btn !border-white/30 !text-white btn-ghost hover:!border-white"
            >
              découvrir l’espace pro
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
