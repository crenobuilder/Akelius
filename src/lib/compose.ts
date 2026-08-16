import type { Listing } from "./types";
import { formatPrice } from "./format";

/*
  Composition des libellés par langue — module pur, utilisable côté client
  (via i18n) comme côté serveur (génération PDF).
*/

export const LANGS = ["fr", "en", "es"] as const;
export type Lang = (typeof LANGS)[number];

export function roomsLabelLang(rooms: number, lang: Lang): string {
  if (rooms === 1) return lang === "es" ? "estudio" : "studio";
  if (lang === "en") return `${rooms} rooms`;
  if (lang === "es") return `${rooms} habitaciones`;
  return `${rooms} pièces`;
}

const MONTHS: Record<Lang, string[]> = {
  fr: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
  en: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
  es: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
};

export function formatDateLang(iso: string, lang: Lang): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return iso;
  if (lang === "en") return `${MONTHS.en[m - 1]} ${d}, ${y}`;
  return `${d} ${MONTHS[lang][m - 1]} ${y}`;
}

/** titre du bien composé dans la langue courante (annonces catalogue) */
export function listingTitle(l: Listing, lang: Lang): string {
  if (l.source === "pro") return l.title;
  return `${roomsLabelLang(l.rooms, lang)} – ${l.address}`;
}

/** description factuelle composée dans la langue courante (annonces catalogue) */
export function listingDescription(l: Listing, lang: Lang): string {
  if (l.source === "pro") return l.description;
  const p: string[] = [];
  const size = Math.round(l.surface);
  const floorTxt =
    l.floor === null || l.floor === undefined
      ? ""
      : lang === "en"
        ? l.floor === 0
          ? " on the ground floor"
          : ` on floor ${l.floor}`
        : lang === "es"
          ? l.floor === 0
            ? " en planta baja"
            : ` en la planta ${l.floor}`
          : l.floor === 0
            ? " au rez-de-chaussée"
            : l.floor === 1
              ? " au 1er étage"
              : ` au ${l.floor}e étage`;
  const built = l.constructionYear
    ? lang === "en"
      ? ` in a ${l.constructionYear} building`
      : lang === "es"
        ? ` en un edificio de ${l.constructionYear}`
        : ` d’un immeuble de ${l.constructionYear}`
    : "";
  const unit = lang === "en" ? "sqm" : "m²";
  const of = lang === "en" ? "of" : "de";
  p.push(`${roomsLabelLang(l.rooms, lang)} ${of} ${size} ${unit}${floorTxt}${built}, ${l.address}.`);
  if (l.station)
    p.push(
      lang === "en"
        ? `Steps from ${l.station} metro station.`
        : lang === "es"
          ? `A dos pasos del metro ${l.station}.`
          : `À deux pas du métro ${l.station}.`
    );
  const rent = formatPrice(l.price, l.currency);
  const charges = l.charges ? formatPrice(l.charges, l.currency) : null;
  if (lang === "en")
    p.push(charges ? `Rent ${rent} per month including ${charges} charges.` : `Rent ${rent} per month.`);
  else if (lang === "es")
    p.push(charges ? `Alquiler ${rent} al mes, incluye ${charges} de gastos.` : `Alquiler ${rent} al mes.`);
  else
    p.push(charges ? `Loyer ${rent} par mois charges comprises, dont ${charges} de charges.` : `Loyer ${rent} par mois.`);
  if (l.deposit) {
    const dep = formatPrice(l.deposit, l.currency);
    p.push(lang === "en" ? `Deposit: ${dep}.` : lang === "es" ? `Fianza: ${dep}.` : `Dépôt de garantie : ${dep}.`);
  }
  p.push(
    lang === "en"
      ? "Available now, rented directly with no agency fees."
      : lang === "es"
        ? "Disponible ya, alquiler directo sin gastos de agencia."
        : "Disponible immédiatement, location en direct sans frais d’agence."
  );
  return p.join(" ");
}
