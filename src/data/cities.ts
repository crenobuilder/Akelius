import type { CityMeta } from "@/lib/types";

/*
  Photos : placeholders libres de droits (Unsplash) — à remplacer par les
  visuels officiels akelius lors de l’intégration finale.
*/
export const CITIES: CityMeta[] = [
  {
    slug: "paris",
    name: "paris",
    country: "france",
    center: [48.8606, 2.3376],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
    blurb: "haussmannien rénové, du marais à passy",
  },
  {
    slug: "londres",
    name: "londres",
    country: "royaume-uni",
    center: [51.515, -0.13],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80",
    blurb: "de notting hill à islington",
  },
  {
    slug: "montreal",
    name: "montréal",
    country: "canada",
    center: [45.5145, -73.577],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=1400&q=80",
    blurb: "du plateau à griffintown",
  },
];

export function cityBySlug(slug: string | null | undefined) {
  return CITIES.find((c) => c.slug === slug);
}
