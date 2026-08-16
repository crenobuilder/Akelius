import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "mes annonces — akelius pro",
  description:
    "Gérez vos annonces de location : statuts, publication, brouillons et statistiques.",
};

export default function AnnoncesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
