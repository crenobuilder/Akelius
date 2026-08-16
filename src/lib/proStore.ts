"use client";

import type { Listing } from "./types";

/*
  Persistance locale des annonces créées dans l’espace pro (démo).
  En production : API + base de données (voir docs/PLAN.md).
*/

const KEY = "akelius.pro.listings.v1";

export function getProListings(): Listing[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Listing[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getPublishedProListings(): Listing[] {
  return getProListings().filter((l) => l.status === "publiee");
}

export function saveProListing(listing: Listing): void {
  const all = getProListings();
  const idx = all.findIndex((l) => l.id === listing.id);
  if (idx >= 0) all[idx] = listing;
  else all.unshift(listing);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("akelius:pro-listings-changed"));
}

export function deleteProListing(id: string): void {
  const all = getProListings().filter((l) => l.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("akelius:pro-listings-changed"));
}

export function setProListingStatus(id: string, status: "publiee" | "brouillon"): void {
  const all = getProListings();
  const item = all.find((l) => l.id === id);
  if (!item) return;
  item.status = status;
  window.localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("akelius:pro-listings-changed"));
}

export function proListingBySlug(slug: string): Listing | undefined {
  return getProListings().find((l) => l.slug === slug);
}

export function newProId(): string {
  return `pro-${Math.random().toString(36).slice(2, 8)}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;
}
