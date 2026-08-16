import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "espace pro — akelius",
  description:
    "Publiez et gérez vos annonces de location : création guidée, diffusion immédiate dans la recherche et sur la carte.",
};

const STEPS = [
  {
    n: "01",
    title: "décrivez le bien",
    text: "adresse, surface, pièces, étage, prestations : un formulaire guidé en quatre étapes.",
  },
  {
    n: "02",
    title: "ajoutez vos photos",
    text: "glissez vos visuels, la première photo devient la vignette de l’annonce.",
  },
  {
    n: "03",
    title: "fixez loyer et disponibilité",
    text: "loyer charges comprises, détail des charges, date d’entrée possible.",
  },
  {
    n: "04",
    title: "publiez",
    text: "l’annonce apparaît immédiatement dans les résultats de recherche et sur la carte.",
  },
];

const FEATURES = [
  ["diffusion instantanée", "vos biens sont visibles dans la recherche et sur la carte dès la publication."],
  ["brouillons", "préparez vos annonces à l’avance et publiez-les au bon moment."],
  ["statistiques", "vues, contacts et demandes de visite, bien par bien."],
  ["multi-villes", "gérez un portefeuille réparti entre paris, londres et montréal."],
];

export default function ProPage() {
  return (
    <>
      <section className="border-b border-line bg-sand">
        <div className="container-ak grid items-center gap-10 py-16 lg:grid-cols-2">
          <div>
            <p className="kicker">espace professionnel</p>
            <h1 className="mt-3 text-4xl font-extrabold lowercase leading-tight tracking-tight text-ink md:text-5xl">
              publiez vos biens, <br />gérez vos locations
            </h1>
            <p className="mt-4 max-w-md text-lg text-muted">
              un outil simple pour les équipes de gestion : création d’annonce
              guidée, diffusion immédiate, suivi des demandes.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/pro/annonces/nouvelle" className="btn btn-brand">
                publier une annonce
              </Link>
              <Link href="/pro/annonces" className="btn btn-ghost">
                voir mes annonces
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {FEATURES.map(([title, text]) => (
              <div
                key={title}
                className="rounded-[var(--radius-ak)] border border-line bg-paper p-5 shadow-[var(--shadow-card)]"
              >
                <h3 className="font-bold lowercase text-ink">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-ak py-16">
        <p className="kicker">comment ça marche</p>
        <h2 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
          en ligne en quatre étapes
        </h2>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s) => (
            <div key={s.n}>
              <p className="text-sm font-extrabold text-brand">{s.n}</p>
              <h3 className="mt-2 font-bold lowercase text-ink">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-[var(--radius-ak)] bg-ink p-8 text-center text-white">
          <p className="text-xl font-extrabold lowercase">prêt à publier votre premier bien ?</p>
          <Link href="/pro/annonces/nouvelle" className="btn btn-brand mt-5">
            créer une annonce
          </Link>
        </div>
      </section>
    </>
  );
}
