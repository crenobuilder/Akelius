"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { listingTitle, roomsLabelLang, useI18n } from "@/lib/i18n";
import SmartImage from "./SmartImage";

interface Props {
  listing: Listing;
  onHover?: (id: string | null) => void;
  highlighted?: boolean;
  /** "grid" (carte verticale) ou "row" (carte horizontale) */
  variant?: "grid" | "row";
}

export default function ListingCard({
  listing,
  onHover,
  highlighted,
  variant = "grid",
}: Props) {
  const { lang, t } = useI18n();
  const title = listingTitle(listing, lang);

  const frame = `card-lift group block overflow-hidden rounded-[var(--radius-ak)] border bg-paper ${
    highlighted
      ? "border-brand shadow-[var(--shadow-float)] -translate-y-1"
      : "border-line shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)]"
  }`;

  const badges = (
    <div className="absolute left-3 top-3 flex gap-2">
      {listing.isNew && (
        <span className="rounded-full bg-brand px-2.5 py-1 text-[0.6875rem] font-bold lowercase text-white shadow-sm">
          {t("card.new")}
        </span>
      )}
      {listing.furnished && (
        <span className="rounded-full bg-ink/75 px-2.5 py-1 text-[0.6875rem] font-bold lowercase text-white shadow-sm backdrop-blur">
          {t("card.furnished")}
        </span>
      )}
    </div>
  );

  if (variant === "row") {
    return (
      <Link
        href={`/bien/${listing.slug}`}
        onMouseEnter={() => onHover?.(listing.id)}
        onMouseLeave={() => onHover?.(null)}
        className={`${frame} flex`}
      >
        <div className="relative w-40 shrink-0 overflow-hidden bg-sand-deep sm:w-52">
          <SmartImage
            src={listing.photos[0]}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          {badges}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 p-4">
          <p className="text-lg font-extrabold text-ink">
            {formatPrice(listing.price, listing.currency)}
            <span className="ml-1 text-xs font-medium text-muted">{t("card.month")}</span>
          </p>
          <h3 className="line-clamp-1 text-[0.9375rem] font-semibold text-ink">{title}</h3>
          <p className="text-sm lowercase text-muted">
            {listing.district} · {roomsLabelLang(listing.rooms, lang)} ·{" "}
            {Math.round(listing.surface)} m²
            {listing.station ? ` · ${t("f.metro")} ${listing.station}` : ""}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/bien/${listing.slug}`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className={frame}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
        <SmartImage
          src={listing.photos[0]}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {badges}
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-extrabold text-ink">
            {formatPrice(listing.price, listing.currency)}
            <span className="ml-1 text-xs font-medium text-muted">{t("card.month")}</span>
          </p>
          <p className="shrink-0 text-sm font-semibold text-ink-soft">
            {roomsLabelLang(listing.rooms, lang)} · {Math.round(listing.surface)} m²
          </p>
        </div>
        <h3 className="mt-1.5 line-clamp-1 text-[0.9375rem] font-semibold text-ink">
          {title}
        </h3>
        <p className="mt-1 text-sm lowercase text-muted">{listing.district}</p>
      </div>
    </Link>
  );
}
