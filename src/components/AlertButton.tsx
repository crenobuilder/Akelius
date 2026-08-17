"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";

/*
  Alerte e-mail sur les critères de recherche courants.
  Démo : persistance localStorage — en production, service e-mail
  (voir docs/PLAN.md).
*/

const KEY = "akelius.alerts.v1";

interface Props {
  /** libellés des critères actifs (ville, surface, budget, pièces) */
  criteria: string[];
}

export default function AlertButton({ criteria }: Props) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const raw = window.localStorage.getItem(KEY);
      const all = raw ? (JSON.parse(raw) as unknown[]) : [];
      all.push({ email: email.trim(), criteria, createdAt: "2026-08-16" });
      window.localStorage.setItem(KEY, JSON.stringify(all));
    } catch {}
    setDone(true);
  }

  function close() {
    setOpen(false);
    setDone(false);
    setEmail("");
  }

  return (
    <>
      <button className="btn btn-ghost h-[46px] !px-5 !py-0" onClick={() => setOpen(true)}>
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4 fill-none stroke-current stroke-[1.8]"
          aria-hidden
        >
          <path
            d="M18 9a6 6 0 10-12 0c0 5-2 6-2 6h16s-2-1-2-6zm-5.3 9a2 2 0 01-3.4 0"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {t("alert.cta")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-ink/40 p-5 backdrop-blur-sm"
          onClick={close}
          role="dialog"
          aria-modal="true"
          aria-label={t("alert.title")}
        >
          <div
            className="map-minicard w-full max-w-md !translate-x-0 rounded-[var(--radius-ak)] bg-paper p-7 shadow-[var(--shadow-float)]"
            onClick={(e) => e.stopPropagation()}
          >
            {done ? (
              <div className="text-center">
                <p className="text-3xl">✉️</p>
                <h2 className="mt-3 text-xl font-extrabold lowercase tracking-tight text-ink">
                  {t("alert.success")}
                </h2>
                <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                  {t("alert.successSub")}
                </p>
                <button className="btn btn-primary mt-6" onClick={close}>
                  {t("alert.close")}
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-extrabold lowercase tracking-tight text-ink">
                  {t("alert.title")}
                </h2>
                <p className="mt-1.5 text-sm text-muted">{t("alert.sub")}</p>

                <p className="field-label mt-5">{t("alert.criteria")}</p>
                <div className="flex flex-wrap gap-2">
                  {(criteria.length ? criteria : [t("alert.any")]).map((c) => (
                    <span key={c} className="chip !cursor-default">
                      {c}
                    </span>
                  ))}
                </div>

                <form className="mt-5 space-y-4" onSubmit={submit}>
                  <div>
                    <label className="field-label" htmlFor="al-email">
                      {t("alert.email")}
                    </label>
                    <input
                      id="al-email"
                      className="field-input"
                      type="email"
                      required
                      placeholder="vous@exemple.fr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" className="btn btn-ghost" onClick={close}>
                      {t("alert.close")}
                    </button>
                    <button type="submit" className="btn btn-brand">
                      {t("alert.submit")}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
