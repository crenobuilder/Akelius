"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import Loader from "@/components/Loader";
import { LISTINGS } from "@/data/listings";
import { cityBySlug } from "@/data/cities";
import { getPublishedProListings } from "@/lib/proStore";
import type { Listing } from "@/lib/types";

const ListingsMap = dynamic(() => import("@/components/ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sand">
      <Loader label="chargement de la carte…" />
    </div>
  ),
});

type SortKey = "pertinence" | "prix-asc" | "prix-desc" | "surface-desc" | "nouveautes";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "pertinence", label: "pertinence" },
  { key: "prix-asc", label: "prix croissant" },
  { key: "prix-desc", label: "prix décroissant" },
  { key: "surface-desc", label: "surface" },
  { key: "nouveautes", label: "nouveautés" },
];

export default function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();

  const ville = params.get("ville") ?? "";
  const surface = Number(params.get("surface")) || 0;
  const budget = Number(params.get("budget")) || 0;
  const pieces = Number(params.get("pieces")) || 0;

  const [sort, setSort] = useState<SortKey>("pertinence");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"liste" | "carte">("liste");
  const [proListings, setProListings] = useState<Listing[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const load = () => setProListings(getPublishedProListings());
    load();
    window.addEventListener("akelius:pro-listings-changed", load);
    return () => window.removeEventListener("akelius:pro-listings-changed", load);
  }, []);

  const results = useMemo(() => {
    let all = [...LISTINGS, ...proListings];
    if (ville) all = all.filter((l) => l.city === ville);
    if (surface) all = all.filter((l) => l.surface >= surface);
    if (budget) all = all.filter((l) => l.price <= budget);
    if (pieces) all = all.filter((l) => l.rooms >= pieces);

    switch (sort) {
      case "prix-asc":
        all.sort((a, b) => a.price - b.price);
        break;
      case "prix-desc":
        all.sort((a, b) => b.price - a.price);
        break;
      case "surface-desc":
        all.sort((a, b) => b.surface - a.surface);
        break;
      case "nouveautes":
        all.sort((a, b) => Number(b.isNew ?? false) - Number(a.isNew ?? false));
        break;
      default:
        all.sort(
          (a, b) =>
            Number(b.featured ?? false) - Number(a.featured ?? false) ||
            Number(b.isNew ?? false) - Number(a.isNew ?? false)
        );
    }
    return all;
  }, [ville, surface, budget, pieces, sort, proListings]);

  const city = cityBySlug(ville);
  const center: [number, number] = city?.center ?? [48.8606, 2.3376];
  const zoom = city?.zoom ?? 5;

  const chips: { label: string; param: string }[] = [];
  if (surface) chips.push({ label: `≥ ${surface} m²`, param: "surface" });
  if (budget) chips.push({ label: `≤ ${budget} / mois`, param: "budget" });
  if (pieces) chips.push({ label: `${pieces}+ pièces`, param: "pieces" });

  function removeChip(param: string) {
    const q = new URLSearchParams(params.toString());
    q.delete(param);
    router.push(`/recherche?${q.toString()}`);
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* barre de filtres */}
      <div className="border-b border-line bg-paper">
        <div className="container-ak !max-w-none flex flex-wrap items-center gap-3 py-3">
          <button
            className="btn btn-ghost !px-4 !py-2.5 lg:hidden"
            onClick={() => setFiltersOpen((v) => !v)}
          >
            filtres
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} w-full lg:block lg:flex-1`}>
            <SearchBar variant="compact" />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <label htmlFor="sort" className="text-xs lowercase text-muted">
              trier par
            </label>
            <select
              id="sort"
              className="field-input !w-auto !py-2"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* corps liste + carte */}
      <div className="relative flex min-h-0 flex-1">
        {/* liste */}
        <section
          className={`min-h-0 w-full overflow-y-auto lg:block lg:w-[55%] xl:w-[52%] ${
            mobileView === "carte" ? "hidden" : "block"
          }`}
        >
          <div className="px-5 py-5 md:px-7">
            <h1 className="text-xl font-extrabold lowercase tracking-tight text-ink">
              {results.length} logement{results.length > 1 ? "s" : ""} à louer
              {city ? ` à ${city.name}` : ""}
            </h1>
            {chips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c.param}
                    className="chip"
                    onClick={() => removeChip(c.param)}
                    title="retirer ce filtre"
                  >
                    {c.label}
                    <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
            )}
            {results.length === 0 ? (
              <div className="mt-10 rounded-[var(--radius-ak)] border border-line bg-sand p-8 text-center">
                <p className="font-semibold lowercase text-ink">
                  aucun logement ne correspond à votre recherche
                </p>
                <p className="mt-2 text-sm text-muted">
                  élargissez votre budget ou réduisez la surface minimale.
                </p>
              </div>
            ) : (
              <div className="mt-5 grid gap-5 pb-10 sm:grid-cols-2">
                {results.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    onHover={setHoveredId}
                    highlighted={hoveredId === l.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* carte */}
        <section
          className={`min-h-0 flex-1 lg:block ${
            mobileView === "liste" ? "hidden" : "block"
          }`}
        >
          <ListingsMap
            listings={results}
            center={center}
            zoom={zoom}
            highlightedId={hoveredId}
            onPinHover={setHoveredId}
            className="h-full w-full"
          />
        </section>

        {/* bascule mobile */}
        <button
          className="btn btn-primary absolute bottom-5 left-1/2 z-[1000] -translate-x-1/2 shadow-[var(--shadow-float)] lg:hidden"
          onClick={() => setMobileView((v) => (v === "liste" ? "carte" : "liste"))}
        >
          {mobileView === "liste" ? "voir la carte" : "voir la liste"}
        </button>
      </div>
    </div>
  );
}
