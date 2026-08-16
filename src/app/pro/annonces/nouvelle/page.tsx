"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import ListingCard from "@/components/ListingCard";
import { CITIES, cityBySlug } from "@/data/cities";
import { newProId, saveProListing } from "@/lib/proStore";
import { slugify } from "@/lib/format";
import type { CitySlug, Dpe, Listing } from "@/lib/types";

const STEPS = ["localisation", "caractéristiques", "photos", "loyer", "aperçu"] as const;

const DEFAULT_PHOTO =
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80";

interface FormState {
  title: string;
  city: CitySlug;
  district: string;
  address: string;
  lat: string;
  lng: string;
  surface: string;
  rooms: string;
  bedrooms: string;
  floor: string;
  elevator: boolean;
  furnished: boolean;
  balcony: boolean;
  dpe: Dpe;
  description: string;
  amenities: string;
  photos: string[];
  price: string;
  charges: string;
  availableFrom: string;
}

const INITIAL: FormState = {
  title: "",
  city: "paris",
  district: "",
  address: "",
  lat: "",
  lng: "",
  surface: "",
  rooms: "2",
  bedrooms: "1",
  floor: "0",
  elevator: false,
  furnished: false,
  balcony: false,
  dpe: "C",
  description: "",
  amenities: "cuisine équipée, parquet, fibre optique",
  photos: [DEFAULT_PHOTO],
  price: "",
  charges: "",
  availableFrom: "2026-10-01",
}

export default function NouvelleAnnoncePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(INITIAL);
  const [photoInput, setPhotoInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  const cityMeta = cityBySlug(form.city);

  const preview: Listing = useMemo(() => {
    const fallbackCenter = cityMeta?.center ?? [48.8606, 2.3376];
    return {
      id: "preview",
      slug: slugify(`${form.city}-${form.district || "quartier"}-${form.title || "annonce"}`),
      title: form.title || "titre de l’annonce",
      city: form.city,
      district: form.district || "quartier",
      address: form.address || "adresse",
      lat: Number(form.lat) || fallbackCenter[0],
      lng: Number(form.lng) || fallbackCenter[1],
      price: Number(form.price) || 0,
      charges: Number(form.charges) || 0,
      currency: cityMeta?.currency ?? "EUR",
      surface: Number(form.surface) || 0,
      rooms: Number(form.rooms) || 1,
      bedrooms: Number(form.bedrooms) || 0,
      floor: Number(form.floor) || 0,
      elevator: form.elevator,
      furnished: form.furnished,
      balcony: form.balcony,
      availableFrom: form.availableFrom,
      dpe: form.dpe,
      photos: form.photos.length ? form.photos : [DEFAULT_PHOTO],
      description: form.description || "description à venir.",
      amenities: form.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      source: "pro",
      status: "brouillon",
      isNew: true,
    };
  }, [form, cityMeta]);

  function validateStep(): string | null {
    if (step === 0) {
      if (!form.title.trim()) return "donnez un titre à votre annonce.";
      if (!form.district.trim()) return "indiquez le quartier.";
      if (!form.address.trim()) return "indiquez l’adresse.";
    }
    if (step === 1) {
      if (!Number(form.surface)) return "indiquez la surface.";
    }
    if (step === 3) {
      if (!Number(form.price)) return "indiquez le loyer mensuel.";
    }
    return null;
  }

  function next() {
    const err = validateStep();
    if (err) {
      setError(err);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function save(status: "publiee" | "brouillon") {
    const listing: Listing = {
      ...preview,
      id: newProId(),
      status,
      createdAt: "2026",
    };
    saveProListing(listing);
    router.push("/pro/annonces");
  }

  return (
    <div className="container-ak py-10">
      <p className="kicker">back-office</p>
      <h1 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
        nouvelle annonce
      </h1>

      {/* étapes */}
      <ol className="mt-8 flex flex-wrap gap-2">
        {STEPS.map((label, i) => (
          <li key={label}>
            <button
              onClick={() => i < step && setStep(i)}
              className={`chip ${
                i === step ? "chip-on" : i < step ? "!text-brand-deep" : ""
              }`}
            >
              {i + 1}. {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[var(--radius-ak)] border border-line bg-paper p-6 shadow-[var(--shadow-card)]">
          {/* étape 1 : localisation */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="f-title">
                  titre de l’annonce
                </label>
                <input
                  id="f-title"
                  className="field-input"
                  placeholder="ex. 3 pièces lumineux avec balcon"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="f-city">
                    ville
                  </label>
                  <select
                    id="f-city"
                    className="field-input"
                    value={form.city}
                    onChange={(e) => set("city", e.target.value as CitySlug)}
                  >
                    {CITIES.map((c) => (
                      <option key={c.slug} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="f-district">
                    quartier
                  </label>
                  <input
                    id="f-district"
                    className="field-input"
                    placeholder="ex. 11e — Oberkampf"
                    value={form.district}
                    onChange={(e) => set("district", e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="f-address">
                  adresse complète
                </label>
                <input
                  id="f-address"
                  className="field-input"
                  placeholder="ex. 12 rue de la Roquette, 75011 Paris"
                  value={form.address}
                  onChange={(e) => set("address", e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="f-lat">
                    latitude (optionnel)
                  </label>
                  <input
                    id="f-lat"
                    className="field-input"
                    placeholder="48.8582"
                    value={form.lat}
                    onChange={(e) => set("lat", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="f-lng">
                    longitude (optionnel)
                  </label>
                  <input
                    id="f-lng"
                    className="field-input"
                    placeholder="2.3387"
                    value={form.lng}
                    onChange={(e) => set("lng", e.target.value)}
                  />
                </div>
              </div>
              <p className="text-xs text-muted">
                sans coordonnées, le bien est positionné au centre de la ville
                sur la carte.
              </p>
            </div>
          )}

          {/* étape 2 : caractéristiques */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label" htmlFor="f-surface">
                    surface (m²)
                  </label>
                  <input
                    id="f-surface"
                    className="field-input"
                    type="number"
                    min={9}
                    value={form.surface}
                    onChange={(e) => set("surface", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="f-rooms">
                    pièces
                  </label>
                  <select
                    id="f-rooms"
                    className="field-input"
                    value={form.rooms}
                    onChange={(e) => set("rooms", e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n === 1 ? "studio" : `${n} pièces`}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="f-bedrooms">
                    chambres
                  </label>
                  <select
                    id="f-bedrooms"
                    className="field-input"
                    value={form.bedrooms}
                    onChange={(e) => set("bedrooms", e.target.value)}
                  >
                    {[0, 1, 2, 3, 4, 5].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label" htmlFor="f-floor">
                    étage
                  </label>
                  <input
                    id="f-floor"
                    className="field-input"
                    type="number"
                    min={0}
                    value={form.floor}
                    onChange={(e) => set("floor", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="f-dpe">
                    classe énergie (dpe)
                  </label>
                  <select
                    id="f-dpe"
                    className="field-input"
                    value={form.dpe}
                    onChange={(e) => set("dpe", e.target.value as Dpe)}
                  >
                    {["A", "B", "C", "D", "E", "F", "G"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <fieldset className="flex items-end gap-4 pb-1">
                  {(
                    [
                      ["elevator", "ascenseur"],
                      ["furnished", "meublé"],
                      ["balcony", "balcon"],
                    ] as const
                  ).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2 text-sm lowercase">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-[var(--color-brand)]"
                        checked={form[key]}
                        onChange={(e) => set(key, e.target.checked)}
                      />
                      {label}
                    </label>
                  ))}
                </fieldset>
              </div>
              <div>
                <label className="field-label" htmlFor="f-desc">
                  description
                </label>
                <textarea
                  id="f-desc"
                  className="field-input min-h-28"
                  placeholder="décrivez le bien, son exposition, ses atouts…"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                />
              </div>
              <div>
                <label className="field-label" htmlFor="f-amenities">
                  prestations (séparées par des virgules)
                </label>
                <input
                  id="f-amenities"
                  className="field-input"
                  value={form.amenities}
                  onChange={(e) => set("amenities", e.target.value)}
                />
              </div>
            </div>
          )}

          {/* étape 3 : photos */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="field-label" htmlFor="f-photo">
                  ajouter une photo (url)
                </label>
                <div className="flex gap-2">
                  <input
                    id="f-photo"
                    className="field-input"
                    placeholder="https://…"
                    value={photoInput}
                    onChange={(e) => setPhotoInput(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => {
                      if (photoInput.trim()) {
                        set("photos", [...form.photos, photoInput.trim()]);
                        setPhotoInput("");
                      }
                    }}
                  >
                    ajouter
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted">
                  démo : collez l’url d’une image. en production, glisser-déposer
                  et upload direct. la première photo sert de vignette.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {form.photos.map((p, i) => (
                  <div
                    key={`${p}-${i}`}
                    className="group relative aspect-[4/3] overflow-hidden rounded-[var(--radius-ak)] border border-line bg-sand-deep"
                  >
                    <img src={p} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-ink/75 px-1.5 py-0.5 text-[0.625rem] font-bold lowercase text-white">
                        vignette
                      </span>
                    )}
                    <button
                      type="button"
                      className="absolute right-2 top-2 hidden rounded-full bg-ink/75 px-2 py-0.5 text-xs text-white group-hover:block"
                      onClick={() =>
                        set(
                          "photos",
                          form.photos.filter((_, idx) => idx !== i)
                        )
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* étape 4 : loyer */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="field-label" htmlFor="f-price">
                    loyer mensuel cc ({cityMeta?.currency ?? "EUR"})
                  </label>
                  <input
                    id="f-price"
                    className="field-input"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="f-charges">
                    dont charges
                  </label>
                  <input
                    id="f-charges"
                    className="field-input"
                    type="number"
                    min={0}
                    value={form.charges}
                    onChange={(e) => set("charges", e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="f-avail">
                    disponible à partir du
                  </label>
                  <input
                    id="f-avail"
                    className="field-input"
                    type="date"
                    value={form.availableFrom}
                    onChange={(e) => set("availableFrom", e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* étape 5 : aperçu */}
          {step === 4 && (
            <div>
              <p className="text-sm text-muted">
                voici votre annonce telle qu’elle apparaîtra dans les résultats
                de recherche. publiez-la ou enregistrez-la en brouillon.
              </p>
              <div className="mx-auto mt-6 max-w-sm">
                <ListingCard listing={preview} />
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 rounded-[var(--radius-ak)] bg-warn/10 px-3 py-2 text-sm font-semibold text-warn">
              {error}
            </p>
          )}

          {/* navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <div>
              {step > 0 && (
                <button className="btn btn-ghost" onClick={() => setStep((s) => s - 1)}>
                  ← précédent
                </button>
              )}
            </div>
            <div className="flex gap-3">
              {step < STEPS.length - 1 ? (
                <button className="btn btn-primary" onClick={next}>
                  continuer →
                </button>
              ) : (
                <>
                  <button className="btn btn-ghost" onClick={() => save("brouillon")}>
                    enregistrer le brouillon
                  </button>
                  <button className="btn btn-brand" onClick={() => save("publiee")}>
                    publier l’annonce
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* aperçu latéral permanent */}
        <aside className="hidden lg:block">
          <p className="field-label">aperçu en direct</p>
          <ListingCard listing={preview} />
          <p className="mt-3 text-xs leading-relaxed text-muted">
            l’aperçu se met à jour à chaque champ renseigné. une fois publiée,
            l’annonce apparaît dans{" "}
            <Link href="/recherche" className="text-brand underline">
              la recherche
            </Link>{" "}
            et sur la carte.
          </p>
        </aside>
      </div>
    </div>
  );
}
