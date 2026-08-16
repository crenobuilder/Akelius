"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CITIES } from "@/data/cities";
import { useI18n } from "@/lib/i18n";

interface Props {
  variant?: "hero" | "compact";
}

export default function SearchBar({ variant = "hero" }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const { t } = useI18n();

  const [ville, setVille] = useState(params.get("ville") ?? "paris");
  const [surface, setSurface] = useState(params.get("surface") ?? "");
  const [budget, setBudget] = useState(params.get("budget") ?? "");
  const [pieces, setPieces] = useState(params.get("pieces") ?? "");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (ville) q.set("ville", ville);
    if (surface) q.set("surface", surface);
    if (budget) q.set("budget", budget);
    if (pieces) q.set("pieces", pieces);
    router.push(`/recherche?${q.toString()}`);
  }

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={submit}
      className={
        isHero
          ? "grid w-full gap-3 rounded-[var(--radius-ak)] bg-paper p-4 shadow-[var(--shadow-float)] sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end"
          : "grid w-full gap-3 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_1fr_auto] lg:items-end"
      }
    >
      <div>
        <label className="field-label" htmlFor="sb-ville">
          {t("search.city")}
        </label>
        <select
          id="sb-ville"
          className="field-input"
          value={ville}
          onChange={(e) => setVille(e.target.value)}
        >
          {CITIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="field-label" htmlFor="sb-surface">
          {t("search.surface")}
        </label>
        <input
          id="sb-surface"
          className="field-input"
          type="number"
          min={0}
          step={5}
          placeholder={t("search.exSurface")}
          value={surface}
          onChange={(e) => setSurface(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="sb-budget">
          {t("search.budget")}
        </label>
        <input
          id="sb-budget"
          className="field-input"
          type="number"
          min={0}
          step={100}
          placeholder={t("search.exBudget")}
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>
      <div>
        <label className="field-label" htmlFor="sb-pieces">
          {t("search.rooms")}
        </label>
        <select
          id="sb-pieces"
          className="field-input"
          value={pieces}
          onChange={(e) => setPieces(e.target.value)}
        >
          <option value="">{t("search.any")}</option>
          <option value="1">{t("search.studio")}</option>
          <option value="2">{t("search.roomsN", { n: 2 })}</option>
          <option value="3">{t("search.roomsN", { n: 3 })}</option>
          <option value="4">{t("search.roomsN", { n: 4 })}</option>
        </select>
      </div>
      <button type="submit" className="btn btn-brand h-[46px]">
        {t("search.go")}
      </button>
    </form>
  );
}
