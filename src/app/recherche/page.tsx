import { Suspense } from "react";
import type { Metadata } from "next";
import SearchResults from "./SearchResults";

export const metadata: Metadata = {
  title: "recherche — akelius",
  description:
    "Tous les appartements à louer : filtrez par ville, surface, budget et nombre de pièces, et explorez la carte interactive.",
};

export default function RecherchePage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center text-sm lowercase text-muted">
          chargement de la recherche…
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
