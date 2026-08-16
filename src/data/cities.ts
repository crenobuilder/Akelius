import type { CityMeta } from "@/lib/types";

/*
  Les 9 villes du sélecteur officiel akelius.fr
  (endpoint files/v2/cities/cities.json — voir docs/SCRAPE-NOTES.md),
  avec leurs vraies URLs de recherche officielles.
  Photos de villes : placeholders libres de droits (Unsplash), à remplacer
  par les visuels officiels lors de l’intégration finale.
*/
export const CITIES: CityMeta[] = [
  {
    slug: "paris",
    name: "paris",
    country: "france",
    flag: "🇫🇷",
    currency: "EUR",
    center: [48.8606, 2.3376],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80",
    blurb: "du 18e à neuilly-sur-seine",
    officialUrl: "https://rent.akelius.com/en/search/france/apartment/paris",
  },
  {
    slug: "londres",
    name: "londres",
    country: "royaume-uni",
    flag: "🇬🇧",
    currency: "GBP",
    center: [51.515, -0.13],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1400&q=80",
    blurb: "de notting hill à islington",
    officialUrl: "https://rent.akelius.com/en/search/united-kingdom/apartment/london",
  },
  {
    slug: "toronto",
    name: "toronto",
    country: "canada",
    flag: "🇨🇦",
    currency: "CAD",
    center: [43.6532, -79.3832],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1517090504586-fde19ea6066f?auto=format&fit=crop&w=1400&q=80",
    blurb: "d’annex à midtown",
    officialUrl: "https://rent.akelius.com/en/search/canada/apartment/toronto",
  },
  {
    slug: "montreal",
    name: "montréal",
    country: "canada",
    flag: "🇨🇦",
    currency: "CAD",
    center: [45.5145, -73.577],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1519178614-68673b201f36?auto=format&fit=crop&w=1400&q=80",
    blurb: "du plateau à griffintown",
    officialUrl: "https://rent.akelius.com/en/search/canada/apartment/montreal",
  },
  {
    slug: "ottawa",
    name: "ottawa",
    country: "canada",
    flag: "🇨🇦",
    currency: "CAD",
    center: [45.4215, -75.6972],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1569880153113-76e33fc52d5f?auto=format&fit=crop&w=1400&q=80",
    blurb: "centretown et la capitale",
    officialUrl: "https://rent.akelius.com/en/search/canada/apartment/ottawa",
  },
  {
    slug: "quebec",
    name: "québec",
    country: "canada",
    flag: "🇨🇦",
    currency: "CAD",
    center: [46.8139, -71.208],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1558489580-faa74691fdc5?auto=format&fit=crop&w=1400&q=80",
    blurb: "du vieux-québec à limoilou",
    officialUrl: "https://rent.akelius.com/en/search/canada/apartment/quebec%20city",
  },
  {
    slug: "new-york",
    name: "new york",
    country: "états-unis",
    flag: "🇺🇸",
    currency: "USD",
    center: [40.7128, -74.006],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1400&q=80",
    blurb: "de brooklyn à harlem",
    officialUrl: "https://www.akelius-properties.us/searchlisting?citystate=NY",
  },
  {
    slug: "boston",
    name: "boston",
    country: "états-unis",
    flag: "🇺🇸",
    currency: "USD",
    center: [42.3601, -71.0589],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1494522358652-f30e61a60313?auto=format&fit=crop&w=1400&q=80",
    blurb: "back bay et south end",
    officialUrl: "https://www.akelius-properties.us/searchlisting?citystate=MA",
  },
  {
    slug: "washington",
    name: "washington d.c.",
    country: "états-unis",
    flag: "🇺🇸",
    currency: "USD",
    center: [38.9072, -77.0369],
    zoom: 12,
    image:
      "https://images.unsplash.com/photo-1501466044931-62695aada8e9?auto=format&fit=crop&w=1400&q=80",
    blurb: "dupont circle et columbia heights",
    officialUrl: "https://www.akelius-properties.us/",
  },
];

export function cityBySlug(slug: string | null | undefined) {
  return CITIES.find((c) => c.slug === slug);
}
