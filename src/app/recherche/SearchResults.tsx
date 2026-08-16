"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";
import SearchBar from "@/components/SearchBar";
import Loader from "@/components/Loader";
import AlertButton from "@/components/AlertButton";
import SmartImage from "@/components/SmartImage";
import { LISTINGS } from "@/data/listings";
import { cityBySlug } from "@/data/cities";
import { getPublishedProListings } from "@/lib/proStore";
import { formatPrice } from "@/lib/format";
import { listingTitle, roomsLabelLang, useI18n } from "@/lib/i18n";
import type { Listing } from "@/lib/types";
import type { MapBounds } from "@/components/ListingsMap";

const ListingsMap = dynamic(() => import("@/components/ListingsMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-sand">
      <Loader />
    </div>
  ),
});

type SortKey = "pertinence" | "prix-asc" | "prix-desc" | "surface-desc" | "nouveautes";

const SORTS: { key: SortKey; labelKey: string }[] = [
  { key: "pertinence", labelKey: "sort.relevance" },
  { key: "prix-asc", labelKey: "sort.priceAsc" },
  { key: "prix-desc", labelKey: "sort.priceDesc" },
  { key: "surface-desc", labelKey: "sort.surface" },
  { key: "nouveautes", labelKey: "sort.new" },
];

export default function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const { lang, t } = useI18n();

  const ville = params.get("ville") ?? "";
  const surface = Number(params.get("surface")) || 0;
  const budget = Number(params.get("budget")) || 0;
  const pieces = Number(params.get("pieces")) || 0;

  const [sort, setSort] = useState<SortKey>("pertinence");
  const [view, setView] = useState<"grid" | "rows">("grid");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinHover, setPinHover] = useState(false);
  const [mobileView, setMobileView] = useState<"liste" | "carte">("liste");
  const [proListings, setProListings] = useState<Listing[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [bounds, setBounds] = useState<MapBounds | null>(null);
  const [mapFilter, setMapFilter] = useState(true);

  useEffect(() => {
    const load = () => setProListings(getPublishedProListings());
    load();
    window.addEventListener("akelius:pro-listings-changed", load);
    return () => window.removeEventListener("akelius:pro-listings-changed", load);
  }, []);

  /* biens correspondant aux critères (pins de la carte) */
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

  /* liste affichée : critères ∩ fenêtre visible de la carte */
  const visible = useMemo(() => {
    if (!mapFilter || !bounds) return results;
    return results.filter(
      (l) =>
        l.lat >= bounds.south &&
        l.lat <= bounds.north &&
        l.lng >= bounds.west &&
        l.lng <= bounds.east
    );
  }, [results, bounds, mapFilter]);

  const city = cityBySlug(ville);
  const center: [number, number] = city?.center ?? [48.8606, 2.3376];
  const zoom = city?.zoom ?? 5;
  const cityTotal = ville
    ? [...LISTINGS, ...proListings].filter((l) => l.city === ville).length
    : LISTINGS.length + proListings.length;
  const fitKey = `${ville}|${surface}|${budget}|${pieces}`;

  const hoveredListing = pinHover
    ? results.find((l) => l.id === hoveredId) ?? null
    : null;

  const chips: { label: string; param: string }[] = [];
  if (surface) chips.push({ label: `≥ ${surface} m²`, param: "surface" });
  if (budget) chips.push({ label: `≤ ${budget} / ${lang === "en" ? "mo" : "mois"}`, param: "budget" });
  if (pieces) chips.push({ label: `${pieces}+ ${roomsLabelLang(2, lang).split(" ")[1]}`, param: "pieces" });

  const alertCriteria = [
    ...(city ? [city.name] : []),
    ...chips.map((c) => c.label),
  ];

  function removeChip(param: string) {
    const q = new URLSearchParams(params.toString());
    q.delete(param);
    router.push(`/recherche?${q.toString()}`);
  }

  function onPinHover(id: string | null) {
    setHoveredId(id);
    setPinHover(id !== null);
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
            {t("filters")}
          </button>
          <div className={`${filtersOpen ? "block" : "hidden"} w-full lg:block lg:flex-1`}>
            <SearchBar variant="compact" />
          </div>
          <div className="ml-auto">
            <AlertButton criteria={alertCriteria} />
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
              {t(visible.length > 1 ? "results.many" : "results.one", {
                n: visible.length,
              })}
              {city ? ` ${t("results.in")} ${city.name}` : ""}
            </h1>

            {chips.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <button
                    key={c.param}
                    className="chip"
                    onClick={() => removeChip(c.param)}
                    title={t("chip.remove")}
                  >
                    {c.label}
                    <span aria-hidden>×</span>
                  </button>
                ))}
              </div>
            )}

            {/* tri + vue */}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5" role="group" aria-label={t("sort.label")}>
                {SORTS.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`chip ${sort === s.key ? "chip-on" : ""}`}
                    aria-pressed={sort === s.key}
                  >
                    {t(s.labelKey)}
                  </button>
                ))}
              </div>
              <div
                className="flex items-center rounded-full bg-fill p-0.5"
                role="group"
                aria-label="affichage"
              >
                <button
                  onClick={() => setView("grid")}
                  aria-pressed={view === "grid"}
                  title={t("view.grid")}
                  className={`rounded-full p-2 transition-colors ${
                    view === "grid" ? "bg-ink text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("rows")}
                  aria-pressed={view === "rows"}
                  title={t("view.rows")}
                  className={`rounded-full p-2 transition-colors ${
                    view === "rows" ? "bg-ink text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2">
                    <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </div>

            {visible.length === 0 ? (
              results.length > 0 ? (
                <div className="mt-8 rounded-[var(--radius-ak)] border border-line bg-sand p-8 text-center">
                  <p className="font-semibold lowercase text-ink">{t("emptyMap.title")}</p>
                  <p className="mt-2 text-sm text-muted">{t("emptyMap.sub")}</p>
                </div>
              ) : cityTotal === 0 && city ? (
                <div className="mt-8 rounded-[var(--radius-ak)] border border-line bg-sand p-8 text-center">
                  <p className="text-2xl">{city.flag}</p>
                  <p className="mt-2 font-semibold lowercase text-ink">
                    {t("emptyCity.title", { city: city.name })}
                  </p>
                  <p className="mt-2 text-sm text-muted">
                    {t("emptyCity.sub", { city: city.name })}
                  </p>
                  <a
                    href={city.officialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost mt-5"
                  >
                    {t("emptyCity.cta")}
                  </a>
                </div>
              ) : (
                <div className="mt-8 rounded-[var(--radius-ak)] border border-line bg-sand p-8 text-center">
                  <p className="font-semibold lowercase text-ink">{t("empty.title")}</p>
                  <p className="mt-2 text-sm text-muted">{t("empty.sub")}</p>
                </div>
              )
            ) : (
              <div
                className={`mt-5 gap-5 pb-10 ${
                  view === "grid" ? "grid sm:grid-cols-2" : "grid grid-cols-1"
                }`}
              >
                {visible.map((l) => (
                  <ListingCard
                    key={l.id}
                    listing={l}
                    variant={view === "rows" ? "row" : "grid"}
                    onHover={(id) => {
                      setHoveredId(id);
                      setPinHover(false);
                    }}
                    highlighted={hoveredId === l.id}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* carte */}
        <section
          className={`relative min-h-0 flex-1 lg:block ${
            mobileView === "liste" ? "hidden" : "block"
          }`}
        >
          <ListingsMap
            listings={results}
            center={center}
            zoom={zoom}
            highlightedId={hoveredId}
            onPinHover={onPinHover}
            onBoundsChange={setBounds}
            fitKey={fitKey}
            className="h-full w-full"
          />

          {/* filtrage par la carte */}
          <label className="absolute right-3 top-3 z-[1000] flex cursor-pointer items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-xs font-semibold lowercase text-ink shadow-[var(--shadow-card)]">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 accent-[var(--color-brand)]"
              checked={mapFilter}
              onChange={(e) => setMapFilter(e.target.checked)}
            />
            {t("map.filterToggle")}
          </label>

          {/* mini-carte au survol d’un pin */}
          {hoveredListing && (
            <Link
              href={`/bien/${hoveredListing.slug}`}
              onMouseEnter={() => onPinHover(hoveredListing.id)}
              onMouseLeave={() => onPinHover(null)}
              className="map-minicard absolute bottom-5 left-1/2 z-[1000] flex w-[340px] max-w-[calc(100%-2rem)] -translate-x-1/2 items-center gap-3 overflow-hidden rounded-[var(--radius-ak)] bg-paper p-2.5 shadow-[var(--shadow-float)]"
            >
              <div className="h-20 w-24 shrink-0 overflow-hidden rounded-[var(--radius-ctl)] bg-sand-deep">
                <SmartImage
                  src={hoveredListing.photos[0]}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-base font-extrabold text-ink">
                  {formatPrice(hoveredListing.price, hoveredListing.currency)}
                  <span className="ml-1 text-[0.6875rem] font-medium text-muted">
                    {t("card.month")}
                  </span>
                </p>
                <p className="mt-0.5 line-clamp-1 text-sm font-semibold text-ink">
                  {listingTitle(hoveredListing, lang)}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs lowercase text-muted">
                  {hoveredListing.district} ·{" "}
                  {roomsLabelLang(hoveredListing.rooms, lang)} ·{" "}
                  {Math.round(hoveredListing.surface)} m²
                </p>
              </div>
            </Link>
          )}
        </section>

        {/* bascule mobile */}
        <button
          className="btn btn-primary absolute bottom-5 left-1/2 z-[1000] -translate-x-1/2 shadow-[var(--shadow-float)] lg:hidden"
          onClick={() => setMobileView((v) => (v === "liste" ? "carte" : "liste"))}
        >
          {mobileView === "liste" ? t("view.map") : t("view.list")}
        </button>
      </div>
    </div>
  );
}
