"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Wordmark } from "@/components/Logo";

const COOKIE = "ak_demo_access";

function AccessForm() {
  const params = useSearchParams();
  const [code, setCode] = useState("");
  const hasError = params.get("err") === "1";

  function submit(e: React.FormEvent) {
    e.preventDefault();
    document.cookie = `${COOKIE}=${encodeURIComponent(code.trim())}; path=/; max-age=${
      60 * 60 * 24 * 30
    }; samesite=lax`;
    window.location.href = "/";
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-sand px-5 py-16">
      <div className="w-full max-w-sm rounded-[var(--radius-ak)] border border-line bg-paper p-8 shadow-[var(--shadow-card)]">
        <Wordmark className="h-6" />
        <p className="kicker mt-4">démo privée</p>
        <h1 className="mt-1 text-xl font-extrabold lowercase tracking-tight text-ink">
          accès sur invitation
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          cette maquette de démonstration n’est pas publique. entrez le code
          d’accès qui vous a été communiqué.
        </p>
        <form className="mt-6 space-y-4" onSubmit={submit}>
          <div>
            <label className="field-label" htmlFor="ac-code">
              code d’accès
            </label>
            <input
              id="ac-code"
              className="field-input"
              type="password"
              required
              autoFocus
              placeholder="••••••••"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          {hasError && (
            <p className="rounded-[var(--radius-ctl)] bg-warn/10 px-3 py-2 text-sm font-semibold text-warn">
              code incorrect.
            </p>
          )}
          <button type="submit" className="btn btn-primary w-full">
            entrer
          </button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-muted">
          maquette non officielle réalisée à titre de démonstration, non
          affiliée à akelius residential property ab.
        </p>
      </div>
    </div>
  );
}

export default function AccesPage() {
  return (
    <Suspense>
      <AccessForm />
    </Suspense>
  );
}
