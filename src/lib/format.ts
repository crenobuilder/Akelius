import type { Currency, Dpe } from "./types";

const SYMBOLS: Record<Currency, string> = {
  EUR: "€",
  GBP: "£",
  CAD: "$",
  USD: "$",
};

/** 1950 -> "1 950 €" — formatage manuel, identique serveur/client (pas de mismatch d’hydratation) */
export function formatPrice(value: number, currency: Currency = "EUR"): string {
  const grouped = value
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return currency === "GBP" || currency === "USD" ? `${SYMBOLS[currency]}${grouped}` : `${grouped} ${SYMBOLS[currency]}`;
}

export function isAvailableNow(iso: string, today = "2026-08-16"): boolean {
  return iso <= today;
}

export function roomsLabel(rooms: number): string {
  return rooms === 1 ? "studio" : `${rooms} pièces`;
}

export const DPE_COLORS: Record<Dpe, string> = {
  A: "#2e9b43",
  B: "#54b64b",
  C: "#a8ce38",
  D: "#f2e30e",
  E: "#f0b410",
  F: "#e2751b",
  G: "#d21e1e",
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
