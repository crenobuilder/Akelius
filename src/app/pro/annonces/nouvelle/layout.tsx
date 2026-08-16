import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "nouvelle annonce — back-office akelius",
  description:
    "Créez une annonce de location en cinq étapes avec aperçu en direct, puis publiez-la dans la recherche.",
};

export default function NouvelleAnnonceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
