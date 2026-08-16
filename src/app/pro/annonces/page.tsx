"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SmartImage from "@/components/SmartImage";
import {
  deleteProListing,
  getProListings,
  setProListingStatus,
} from "@/lib/proStore";
import { formatPrice } from "@/lib/format";
import type { Listing } from "@/lib/types";

export default function ProAnnoncesPage() {
  const [items, setItems] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = () => {
      setItems(getProListings());
      setLoaded(true);
    };
    load();
    window.addEventListener("akelius:pro-listings-changed", load);
    return () => window.removeEventListener("akelius:pro-listings-changed", load);
  }, []);

  const published = items.filter((l) => l.status === "publiee").length;
  const drafts = items.length - published;

  return (
    <div className="container-ak py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">back-office</p>
          <h1 className="mt-2 text-3xl font-extrabold lowercase tracking-tight text-ink">
            mes annonces
          </h1>
        </div>
        <Link href="/pro/annonces/nouvelle" className="btn btn-brand">
          + nouvelle annonce
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          [String(items.length), "annonces au total"],
          [String(published), "publiées"],
          [String(drafts), "brouillons"],
          ["—", "demandes de visite"],
        ].map(([n, label]) => (
          <div
            key={label}
            className="rounded-[var(--radius-ak)] border border-line bg-sand p-5"
          >
            <p className="text-2xl font-extrabold text-ink">{n}</p>
            <p className="mt-1 text-sm lowercase text-muted">{label}</p>
          </div>
        ))}
      </div>

      {loaded && items.length === 0 && (
        <div className="mt-10 rounded-[var(--radius-ak)] border border-dashed border-line bg-sand p-12 text-center">
          <p className="text-lg font-bold lowercase text-ink">
            aucune annonce pour le moment
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
            créez votre première annonce : elle apparaîtra immédiatement dans
            la recherche et sur la carte une fois publiée.
          </p>
          <Link href="/pro/annonces/nouvelle" className="btn btn-primary mt-6">
            créer une annonce
          </Link>
        </div>
      )}

      {items.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-[var(--radius-ak)] border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-sand text-xs lowercase text-muted">
              <tr>
                <th className="px-4 py-3 font-semibold">bien</th>
                <th className="hidden px-4 py-3 font-semibold md:table-cell">loyer</th>
                <th className="hidden px-4 py-3 font-semibold sm:table-cell">statut</th>
                <th className="px-4 py-3 font-semibold">actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-paper">
              {items.map((l) => (
                <tr key={l.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-16 shrink-0 overflow-hidden rounded-[var(--radius-ak)] bg-sand-deep">
                        {l.photos[0] && (
                          <SmartImage
                            src={l.photos[0]}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink">{l.title}</p>
                        <p className="truncate text-xs lowercase text-muted">
                          {l.district} · {Math.round(l.surface)} m²
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 font-semibold text-ink md:table-cell">
                    {formatPrice(l.price, l.currency)}
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-bold lowercase ${
                        l.status === "publiee"
                          ? "bg-brand-wash text-brand-deep"
                          : "bg-sand-deep text-muted"
                      }`}
                    >
                      {l.status === "publiee" ? "publiée" : "brouillon"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2 text-xs">
                      <Link
                        href={`/bien/${l.slug}`}
                        className="chip"
                        title="voir l’annonce"
                      >
                        voir
                      </Link>
                      <button
                        className="chip"
                        onClick={() =>
                          setProListingStatus(
                            l.id,
                            l.status === "publiee" ? "brouillon" : "publiee"
                          )
                        }
                      >
                        {l.status === "publiee" ? "dépublier" : "publier"}
                      </button>
                      <button
                        className="chip hover:!bg-warn/15 hover:!text-warn"
                        onClick={() => {
                          if (confirm("supprimer cette annonce ?")) deleteProListing(l.id);
                        }}
                      >
                        supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
