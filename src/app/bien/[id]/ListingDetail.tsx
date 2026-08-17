"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import SmartImage from "@/components/SmartImage";
import ListingCard from "@/components/ListingCard";
import Lightbox from "@/components/Lightbox";
import { LISTINGS, listingBySlug } from "@/data/listings";
import { cityBySlug } from "@/data/cities";
import { proListingBySlug } from "@/lib/proStore";
import type { Dpe, Listing } from "@/lib/types";
import { DPE_COLORS, formatPrice, isAvailableNow } from "@/lib/format";
import {
  formatDateLang,
  listingDescription,
  listingTitle,
  roomsLabelLang,
  useI18n,
} from "@/lib/i18n";

const ListingsMap = dynamic(() => import("@/components/ListingsMap"), { ssr: false });

const DPE_SCALE: Dpe[] = ["A", "B", "C", "D", "E", "F", "G"];

export default function ListingDetail({ slug }: { slug: string }) {
  const { lang, t } = useI18n();
  const [proListing, setProListing] = useState<Listing | null>(null);
  const [checkedPro, setCheckedPro] = useState(false);
  const [photoIdx, setPhotoIdx] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
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
        <h1 className="text-2xl font-extrabold lowercase text-ink">
          {t("detail.notfound")}
        </h1>
        <p className="mt-2 text-muted">{t("detail.notfoundSub")}</p>
        <Link href="/recherche" className="btn btn-primary mt-6">
          {t("detail.back")}
        </Link>
      </div>
    );
  }

  const city = cityBySlug(listing.city);
  const available = isAvailableNow(listing.availableFrom);
  const photos = listing.photos.length > 0 ? listing.photos : [""];
  const title = listingTitle(listing, lang);
  const description = listingDescription(listing, lang);

  const facts: [string, string][] = [
    ["f.surface", `${Math.round(listing.surface)} m²`],
    ["f.rooms", roomsLabelLang(listing.rooms, lang)],
    ["f.bedrooms", String(listing.bedrooms)],
  ];
  if (listing.floor !== null && listing.floor !== undefined)
    facts.push(["f.floor", listing.floor === 0 ? t("f.ground") : `${listing.floor}`]);
  if (listing.elevator !== undefined)
    facts.push(["f.elevator", listing.elevator ? t("yes") : t("no")]);
  if (listing.furnished !== undefined)
    facts.push(["f.furnished", listing.furnished ? t("yes") : t("no")]);
  if (listing.balcony !== undefined)
    facts.push(["f.balcony", listing.balcony ? t("yes") : t("no")]);
  if (listing.station) facts.push(["f.metro", listing.station]);
  if (listing.constructionYear) facts.push(["f.built", String(listing.constructionYear)]);
  if (listing.deposit)
    facts.push(["f.deposit", formatPrice(listing.deposit, listing.currency)]);
  facts.push([
    "f.available",
    available ? t("f.now") : t("f.on", { d: formatDateLang(listing.availableFrom, lang) }),
  ]);

  return (
    <div className="pb-16">
      {/* fil d’ariane */}
      <div className="container-ak py-4 text-sm lowercase text-muted">
        <Link href="/" className="hover:text-brand-deep">
          {t("detail.home")}
        </Link>
        {" / "}
        <Link href={`/recherche?ville=${listing.city}`} className="hover:text-brand-deep">
          {city?.name ?? listing.city}
        </Link>
        {" / "}
        <span className="text-ink-soft">{listing.district.toLowerCase()}</span>
      </div>

      {/* galerie */}
      <div className="container-ak">
        <div className="grid gap-2 lg:grid-cols-[2fr_1fr]">
          <button
            onClick={() => setGalleryOpen(true)}
            className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-[var(--radius-ak)] bg-sand-deep text-left"
            aria-label="ouvrir la galerie"
          >
            <SmartImage
              src={photos[photoIdx]}
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              loading="eager"
            />
            <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full bg-ink/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition-colors group-hover:bg-ink/85">
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2">
                <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" strokeLinecap="round" />
              </svg>
              {photoIdx + 1} / {photos.length}
            </span>
          </button>
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
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink">{title}</h1>
          <p className="mt-1 text-muted">{listing.address}</p>

          <div className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-ctl)] border border-line bg-line sm:grid-cols-4">
            {facts.map(([k, v]) => (
              <div key={k} className="bg-paper p-4">
                <p className="text-xs lowercase text-muted">{t(k)}</p>
                <p className="mt-1 text-sm font-bold lowercase text-ink">{v}</p>
              </div>
            ))}
          </div>

          <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">
            {t("detail.desc")}
          </h2>
          <p className="mt-3 leading-relaxed text-ink-soft">{description}</p>

          {listing.amenities.length > 0 && (
            <>
              <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">
                {t("detail.amen")}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((a) => (
                  <span key={a} className="chip !cursor-default">
                    {a}
                  </span>
                ))}
              </div>
            </>
          )}

          {listing.dpe && (
            <>
              <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">
                {t("detail.dpe")}
              </h2>
              <div className="mt-3 flex items-center gap-1.5">
                {DPE_SCALE.map((d) => (
                  <span
                    key={d}
                    className={`flex items-center justify-center rounded-[var(--radius-ctl)] font-bold text-white ${
                      d === listing.dpe
                        ? "h-11 w-11 text-base"
                        : "h-8 w-8 text-xs opacity-45"
                    }`}
                    style={{ backgroundColor: DPE_COLORS[d] }}
                  >
                    {d}
                  </span>
                ))}
                <span className="ml-3 text-sm text-muted">
                  {t("detail.dpeClass", { c: listing.dpe })}
                </span>
              </div>
            </>
          )}

          <h2 className="mt-10 text-xl font-extrabold lowercase text-ink">
            {t("detail.loc")}
          </h2>
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
              <span className="ml-1.5 text-sm font-medium text-muted">
                {t("card.month")}
              </span>
            </p>
            {listing.charges > 0 && (
              <p className="mt-1 text-sm text-muted">
                {t("detail.charges", {
                  x: formatPrice(listing.charges, listing.currency),
                })}
              </p>
            )}
            <p className="mt-3 inline-flex items-center gap-2 text-sm font-semibold lowercase">
              <span className={`h-2 w-2 rounded-full ${available ? "bg-ok" : "bg-warn"}`} />
              {available
                ? t("detail.availNow")
                : t("detail.availOn", {
                    d: formatDateLang(listing.availableFrom, lang),
                  })}
            </p>

            {sent ? (
              <div className="mt-6 rounded-[var(--radius-ctl)] bg-brand-wash p-4 text-sm">
                <p className="font-bold lowercase text-brand-deep">{t("detail.sent")}</p>
                <p className="mt-1 text-ink-soft">{t("detail.sentSub")}</p>
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
                    {t("detail.name")}
                  </label>
                  <input
                    id="c-nom"
                    className="field-input"
                    required
                    placeholder={t("detail.namePh")}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="c-email">
                    {t("detail.email")}
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
                    {t("detail.msg")}
                  </label>
                  <textarea
                    id="c-msg"
                    className="field-input min-h-24"
                    defaultValue={t("detail.msgDefault", { t: title })}
                  />
                </div>
                <button type="submit" className="btn btn-brand w-full">
                  {t("detail.visit")}
                </button>
                <p className="text-center text-xs text-muted">{t("detail.reply")}</p>
              </form>
            )}

            {listing.source !== "pro" && (
              <a
                href={`/api/pdf/${listing.slug}?lang=${lang}`}
                download={`akelius-${listing.slug}.pdf`}
                className="btn btn-ghost mt-3 w-full"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4 fill-none stroke-current stroke-2"
                  aria-hidden
                >
                  <path
                    d="M12 3v12m0 0l-4-4m4 4l4-4M5 21h14"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {t("detail.pdf")}
              </a>
            )}
          </div>

          <div className="mt-4 rounded-[var(--radius-ak)] border border-line bg-sand p-5 text-sm">
            <p className="font-bold lowercase text-ink">akelius {city?.name ?? ""}</p>
            <p className="mt-1 text-muted">{t("detail.owner")}</p>
            {listing.officialUrl && (
              <a
                href={listing.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-semibold lowercase text-brand-deep hover:underline"
              >
                {t("detail.official")}
              </a>
            )}
          </div>
        </aside>
      </div>

      {galleryOpen && (
        <Lightbox
          photos={photos}
          index={photoIdx}
          onNavigate={setPhotoIdx}
          onClose={() => setGalleryOpen(false)}
          title={title}
        />
      )}

      {/* biens similaires */}
      {similar.length > 0 && (
        <div className="container-ak mt-16">
          <h2 className="text-2xl font-extrabold lowercase tracking-tight text-ink">
            {t("detail.similar")}
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
