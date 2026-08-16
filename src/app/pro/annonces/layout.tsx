import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mes annonces — back-office akelius",
  description:
    "Gestion des biens du parc : statuts, publication, brouillons et statistiques.",
};

export default function AnnoncesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
