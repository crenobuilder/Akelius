"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Wordmark } from "./Logo";

/*
  Contrôle d’accès du back-office (démo).
  En production : SSO d’entreprise (Entra ID / Okta) réservé aux
  collaborateurs akelius — voir docs/PLAN.md.
*/

const AUTH_KEY = "akelius.pro.auth";
const DEMO_CODE = "akelius2026";
const EMAIL_RE = /@akelius\.(fr|com|de|se|ca|us)$/i;

export default function ProGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<"checking" | "locked" | "open">("checking");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setState(window.sessionStorage.getItem(AUTH_KEY) === "1" ? "open" : "locked");
    } catch {
      setState("locked");
    }
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) {
      setError("accès réservé aux collaborateurs akelius (e-mail @akelius.fr).");
      return;
    }
    if (code.trim().toLowerCase() !== DEMO_CODE) {
      setError("code d’accès incorrect.");
      return;
    }
    try {
      window.sessionStorage.setItem(AUTH_KEY, "1");
    } catch {}
    setState("open");
  }

  function logout() {
    try {
      window.sessionStorage.removeItem(AUTH_KEY);
    } catch {}
    setState("locked");
    setEmail("");
    setCode("");
  }

  if (state === "checking") return null;

  if (state === "locked") {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-sand px-5 py-16">
        <div className="w-full max-w-sm rounded-[var(--radius-ak)] border border-line bg-paper p-8 shadow-[var(--shadow-card)]">
          <Wordmark className="h-6" />
          <p className="kicker mt-4">back-office</p>
          <h1 className="mt-1 text-xl font-extrabold lowercase tracking-tight text-ink">
            accès réservé aux équipes akelius
          </h1>
          <form className="mt-6 space-y-4" onSubmit={submit}>
            <div>
              <label className="field-label" htmlFor="g-email">
                e-mail professionnel
              </label>
              <input
                id="g-email"
                className="field-input"
                type="email"
                required
                placeholder="prenom.nom@akelius.fr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                }}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="g-code">
                code d’accès
              </label>
              <input
                id="g-code"
                className="field-input"
                type="password"
                required
                placeholder="••••••••"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError(null);
                }}
              />
            </div>
            {error && (
              <p className="rounded-[var(--radius-ctl)] bg-warn/10 px-3 py-2 text-sm font-semibold text-warn">
                {error}
              </p>
            )}
            <button type="submit" className="btn btn-primary w-full">
              se connecter
            </button>
          </form>
          <p className="mt-5 text-xs leading-relaxed text-muted">
            démo : utilisez un e-mail <strong>@akelius.fr</strong> et le code{" "}
            <strong>akelius2026</strong>. en production, connexion sso
            d’entreprise.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block text-sm lowercase text-brand-deep hover:underline"
          >
            ← retour au site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="border-b border-line bg-brand-wash">
        <div className="container-ak flex items-center justify-between py-2 text-xs">
          <p className="font-semibold lowercase text-brand-deep">
            back-office akelius — session collaborateur
          </p>
          <button onClick={logout} className="lowercase text-muted hover:text-ink">
            se déconnecter
          </button>
        </div>
      </div>
      {children}
    </>
  );
}
