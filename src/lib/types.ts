export type Currency = "EUR" | "GBP" | "CAD" | "USD";

export type CitySlug =
  | "paris"
  | "londres"
  | "toronto"
  | "montreal"
  | "ottawa"
  | "quebec"
  | "new-york"
  | "boston"
  | "washington"
  | "austin";

export type Dpe = "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  city: CitySlug;
  district: string;
  address: string;
  lat: number;
  lng: number;
  /** loyer mensuel charges comprises */
  price: number;
  /** dont charges */
  charges: number;
  currency: Currency;
  surface: number;
  rooms: number;
  bedrooms: number;
  floor: number;
  elevator: boolean;
  furnished: boolean;
  balcony: boolean;
  availableFrom: string; // ISO date
  dpe: Dpe;
  photos: string[];
  description: string;
  amenities: string[];
  featured?: boolean;
  isNew?: boolean;
  /** annonce créée depuis l’espace pro (stockée en local) */
  source?: "catalogue" | "pro";
  status?: "publiee" | "brouillon";
  createdAt?: string;
}

export interface CityMeta {
  slug: CitySlug;
  name: string;
  country: string;
  flag: string;
  currency: Currency;
  center: [number, number];
  zoom: number;
  image: string;
  blurb: string;
  /** page officielle akelius pour cette ville */
  officialUrl: string;
}
