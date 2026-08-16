"use client";

import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatPrice, roomsLabel } from "@/lib/format";
import SmartImage from "./SmartImage";

interface Props {
  listing: Listing;
  onHover?: (id: string | null) => void;
  highlighted?: boolean;
}

export default function ListingCard({ listing, onHover, highlighted }: Props) {
  return (
    <Link
      href={`/bien/${listing.slug}`}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
      className={`group block overflow-hidden rounded-[var(--radius-ak)] border bg-paper transition-shadow ${
        highlighted
          ? "border-brand shadow-[var(--shadow-float)]"
          : "border-line shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-float)]"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-sand-deep">
        <SmartImage
          src={listing.photos[0]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {listing.isNew && (
            <span className="rounded-[var(--radius-ak)] bg-brand px-2 py-1 text-[0.6875rem] font-bold lowercase text-white">
              nouveau
            </span>
          )}
          {listing.furnished && (
            <span className="rounded-[var(--radius-ak)] bg-ink/80 px-2 py-1 text-[0.6875rem] font-bold lowercase text-white">
              meublé
            </span>
          )}
          {listing.source === "pro" && (
            <span className="rounded-[var(--radius-ak)] bg-warn px-2 py-1 text-[0.6875rem] font-bold lowercase text-white">
              annonce pro
            </span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-lg font-extrabold text-ink">
            {formatPrice(listing.price, listing.currency)}
            <span className="ml-1 text-xs font-medium text-muted">/ mois cc</span>
          </p>
          <p className="shrink-0 text-sm font-semibold text-ink-soft">
            {roomsLabel(listing.rooms)} · {listing.surface} m²
          </p>
        </div>
        <h3 className="mt-1.5 line-clamp-1 text-[0.9375rem] font-semibold text-ink">
          {listing.title}
        </h3>
        <p className="mt-1 text-sm lowercase text-muted">{listing.district}</p>
      </div>
    </Link>
  );
}
