import type { Dpe, Listing } from "@/lib/types";
import { formatPrice, roomsLabel, slugify } from "@/lib/format";
import realParis from "./real/akelius-paris.json";

/*
  Annonces réelles akelius — importées de akelius.fr
  (endpoint lettings/marketing/v2/FR/published-adverts.json, voir
  docs/SCRAPE-NOTES.md). Les titres et descriptions sont composés à partir
  des champs factuels de l’API ; les photos pointent vers le CDN officiel.
  Pour ré-importer : relancer le scraping qui régénère
  src/data/real/akelius-paris.json.
*/

interface RawListing {
  id: string;
  title: string;
  address: string;
  district: string;
  price: number;
  baseRent: number | null;
  charges: number | null;
  deposit: number | null;
  surface: number;
  rooms: number;
  bedrooms: number | null;
  floor: number | null;
  furnished: boolean | null;
  availableFrom: string | null;
  availableNow: boolean;
  constructionYear: number | null;
  energyClass: string | null;
  metroStation: string | null;
  lat: number;
  lng: number;
  photos: string[];
  url: string;
  description: string | null;
}

const DPE_SCALE = ["A", "B", "C", "D", "E", "F", "G"];

function floorLabel(floor: number | null): string | null {
  if (floor === null) return null;
  if (floor === 0) return "au rez-de-chaussée";
  return floor === 1 ? "au 1er étage" : `au ${floor}e étage`;
}

/** description factuelle composée à partir des données officielles */
function describe(r: RawListing): string {
  const parts: string[] = [];
  let first = `${roomsLabel(r.rooms)} de ${Math.round(r.surface)} m²`;
  const fl = floorLabel(r.floor);
  if (fl) first += ` ${fl}`;
  if (r.constructionYear) first += ` d’un immeuble de ${r.constructionYear}`;
  parts.push(`${first}, ${r.address}.`);
  if (r.metroStation) parts.push(`À deux pas du métro ${r.metroStation}.`);
  const rent = `Loyer ${formatPrice(r.price)} par mois charges comprises`;
  parts.push(
    r.charges ? `${rent}, dont ${formatPrice(r.charges)} de charges.` : `${rent}.`
  );
  if (r.deposit) parts.push(`Dépôt de garantie : ${formatPrice(r.deposit)}.`);
  parts.push("Disponible immédiatement, location en direct sans frais d’agence.");
  return parts.join(" ");
}

function toListing(r: RawListing, index: number): Listing {
  const amenities: string[] = [];
  if (r.metroStation) amenities.push(`métro ${r.metroStation}`);
  if (r.constructionYear) amenities.push(`immeuble de ${r.constructionYear}`);
  if (r.bedrooms) amenities.push(`${r.bedrooms} chambre${r.bedrooms > 1 ? "s" : ""}`);
  amenities.push("location en direct", "sans frais d’agence");

  return {
    id: r.id,
    slug: slugify(`${r.address}-${r.id}`),
    title: r.title,
    city: "paris",
    district: r.district,
    address: r.address,
    lat: r.lat,
    lng: r.lng,
    price: Math.round(r.price),
    charges: Math.round(r.charges ?? 0),
    currency: "EUR",
    surface: r.surface,
    rooms: r.rooms,
    bedrooms: r.bedrooms ?? 0,
    floor: r.floor,
    furnished: r.furnished ?? undefined,
    availableFrom: r.availableFrom ?? "2026-01-01", // available now (donnée site)
    dpe:
      r.energyClass && DPE_SCALE.includes(r.energyClass)
        ? (r.energyClass as Dpe)
        : undefined,
    photos: r.photos,
    description: describe(r),
    amenities,
    station: r.metroStation ?? undefined,
    constructionYear: r.constructionYear ?? undefined,
    deposit: r.deposit ?? undefined,
    baseRent: r.baseRent ?? undefined,
    officialUrl: r.url,
    featured: index < 4,
    source: "catalogue",
  };
}

export const LISTINGS: Listing[] = (realParis.listings as RawListing[]).map(toListing);

export function listingBySlug(slug: string): Listing | undefined {
  return LISTINGS.find((l) => l.slug === slug);
}

export function listingsByCity(city: string): Listing[] {
  return LISTINGS.filter((l) => l.city === city);
}
