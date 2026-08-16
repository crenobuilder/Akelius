"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SmartImage from "@/components/SmartImage";
import ListingCard from "@/components/ListingCard";
import { LISTINGS, listingBySlug } from "@/data/listings";
import { cityBySlug } from "@/data/cities";
import { proListingBySlug } from "@/lib/proStore";
import type { Dpe, Listing } from "@/lib/types";
import { DPE_COLORS, formatDate, formatPrice, isAvailableNow, roomsLabel } from "@/lib/format";

const ListingsMap = dynamic(() => import("@/components/ListingsMap"), { ssr: false });

const DPE_SCALE: Dpe[] = ["A", "B", "C", "D", "E", "F", "G"];

export default function ListingDetail({ slug }: { slug: string }) {
  const [proListing, setProListing] = useState<Listing | null>(null);
  const [checkedPro, setCheckedPro] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [sent, setSent] = useState(false);

  const catalogListing = listingBySlug(slug);

  useEffect(() => {
    if (!catalogListing) {
      setProListing(proListingBySlug(slug) ?? null);
    }
    setCheckedPro(true);
  }, [slug, catalogListing]);

  const listing = catalogListing ?? proListing ?? undefined;

  const similar = useMemo(() => {
    if (!listing) return [];
    return LISTINGS.filter(
      (l) =>
        l.slug !== listing.slug &&
        l.city === listing.city &&
        Math.abs(l.rooms - listing.rooms) <= 1
    ).slice(0, 3);
  }, [listing]);

  if (!listing) {
    if (!checkedPro) return null;
    return (
      <div className="container-ak py-24 text-center">
        <h1 className="text-2xl font-extrabold lowercase text-ink">bien introuvable</h1>
        <p className="mt-2 text-muted">
          cette annonce n’existe plus ou n’a pas encore été publiée.
        </p>
        <Link href="/recherche" className="btn btn-primary mt-6">
          retour à la recherche
        </Link>
      </div>
    );
  }

  const city = cityBySlug(listing.city);
  const available = isAvailableNow(listing.availableFrom);
  const photos = listing.photos.length > 0 ? listing.photos : [""];

  const facts: [string, string][] = [
    ["surface", `${listing.surface} m²`],
    ["pièces", roomsLabel(listing.rooms)],
    ["chambres", String(listing.bedrooms)],
    ["étage", listing.floor === 0 ? "rez-de-chaussée" : `${listing.floor}e`],
    ["ascenseur", listing.elevator ? "oui" : "non"],
    ["meublé", listing.furnished ? "oui" : "non"],
    ["balcon", listing.balcony ? "oui" : "non"],
    ["disponible", available ? "immédiatement" : formatDate(listing.availableFrom)],
  ];

  return (
    <div className="pb-16">
      {/* fil d’ariane */}
      <div className="container-ak py-4 text-sm lowercase text-muted">
        <Link href="/" className="hover:text-brand">
          accueil
        </Link>
        {" / "}
        <Link href={`/recherche?ville=${listing.city}`} className="hover:text-brand">
          {city?.name ?? listing.city}
        </Link>
        {" / "}
        <span className="text-ink-soft">{listing.district.toLowerCase()}</span>
      </div>

      {/* galerie */}
      <div className="container-ak">
        <div className="grid gap-2 lg:grid-cols-[2fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[var(--radius-ak)] bg-sand-deep">
            <SmartImage
              src={photos[photoIdx]}
              alt={listing.title}
              className="h-full w-full object-cover"
              loading="eager"
            />
            {photos.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-ink/70 px-3 py-1 text-xs font-semibold text-white">
                {photoIdx + 1} / {photos.length}
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 gap-2 lg:h-full lg:grid-cols-2 lg:grid-rows-2">
            {photos.slice(0, 4).map((p, i) => (
              <button
                key={i}
                onClick={() => setPhotoIdx(i)}
                className={`relative aspect-[16/10] overflow-hidden rounded-[var(--radius-ctl)] bg-sand-deep transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] lg:aspect-auto lg:h-full ${
                  i === photoIdx ? "ring-2 ring-brand ring-offset-2" : ""
                }`}
                aria-label={`photo ${i + 1}`}
              >
                <SmartImage src={p} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* contenu */}
      <div className="container-ak mt-8 grid gap-10 lg:grid-cols-[1.7fr_1fr]">
        <div>
          <p className="kicker">{listing.district.toLowerCase()}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {listing.title}
          </h1>
          <p className="mt-1 text-muted">{listing.address}</p>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-ak)] border border-line bg-line sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="bg-paper p-4">
                <p className="text-xs lowercase text-muted">{k}</p>
                <p className="mt-1 text-sm font-bold lowercase text-ink">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">description</h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{listing.description}</p>

          {listing.amenities.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">prestations</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="chip">
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}

          <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">
            diagnostic énergie
          </h2>
          <div className="mt-3 flex items-center gap-1.5">
            {DPE_SCALE.map((d) => (
              <span
                key={d}
                className={`flex items-center justify-center rounded-[var(--radius-ak)] font-bold text-white ${
                  d === listing.dpe ? "h-11 w-11 text-base" : "h-8 w-8 text-xs opacity-45"
                }`}
                style={{ backgroundColor: DPE_COLORS[d] }}
              >
                {d}
              </span>
            ))}
            <span className="ml-3 text-sm text-muted">classe {listing.dpe}</span>
          </div>

          <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">localisation</h2>
          <div className="mt-3 h-[320px] overflow-hidden rounded-[var(--radius-ak)] border border-line">
            <ListingsMap
              listings={[listing]}
              center={[listing.lat, listing.lng]}
              zoom={15}
              className="h-full w-full"
            />
          </div>
        </div>

        {/* panneau contact */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--radius-ak)] border border-line bg-paper p-6 shadow-[var(--shadow-card)]">
            <p className="text-3xl font-extrabold tracking-tight text-ink">
              {formatPrice(listing.price, listing.currency)}
              <span className="ml-1.5 text-sm font-medium text-muted">/ mois cc</span>
            </p>
            {listing.charges > 0 && (
              <p className="mt-1 text-sm text-muted">
                dont {formatPrice(listing.charges, listing.currency)} de charges
              </p>
            )}
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold lowercase">
              <span
                className={`h-2 w-2 rounded-full ${available ? "bg-ok" : "bg-warn"}`}
              />
              {available
                ? "disponible immédiatement"
                : `disponible le ${formatDate(listing.availableFrom)}`}
            </p>

            {sent ? (
              <div className="mt-6 rounded-[var(--radius-ak)] bg-brand-wash p-4 text-sm">
                <p className="font-bold lowercase text-brand-deep">demande envoyée ✓</p>
                <p className="mt-1 text-ink-soft">
                  notre équipe locale vous recontacte sous 24 h pour organiser
                  la visite.
                </p>
              </div>
            ) : (
              <form
                className="mt-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <div>
                  <label className="field-label" htmlFor="c-nom">
                    nom
                  </label>
                  <input id="c-nom" className="field-input" required placeholder="votre nom" />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">
                    e-mail
                  </label>
                  <input
                    id="c-email"
                    className="field-input"
                    type="email"
                    required
                    placeholder="vous@exemple.fr"
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-msg">
                    message
                  </label>
                  <textarea
                    id="c-msg"
                    className="field-input min-h-24"
                    defaultValue={`bonjour, je souhaite visiter « ${listing.title} ».`}
                  />
                </div>
                <button type="submit" className="btn btn-brand w-full">
                  planifier une visite
                </button>
                <p className="text-center text-xs text-muted">
                  réponse sous 24 h — sans engagement
                </p>
              </form>
            )}
          </div>

          <div className="mt-4 rounded-[var(--radius-ak)] border border-line bg-sand p-5 text-sm">
            <p className="font-bold lowercase text-ink">akelius {city?.name ?? ""}</p>
            <p className="mt-1 text-muted">
              propriétaire-bailleur — location en direct, sans frais d’agence.
            </p>
          </div>
        </aside>
      </div>

      {/* biens similaires */}
      {similar.length > 0 && (
        <div className="container-ak mt-16">
          <h2 className="text-2xl font-extrabold lowercase tracking-tight text-ink">
            dans le même quartier
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {similar.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
