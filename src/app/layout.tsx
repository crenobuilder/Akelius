import type { Metadata } from "next";
import "@fontsource/figtree/400.css";
import "@fontsource/figtree/500.css";
import "@fontsource/figtree/600.css";
import "@fontsource/figtree/700.css";
import "@fontsource/figtree/800.css";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SplashScreen from "@/components/SplashScreen";
import { LangProvider } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "akelius — a better way to live",
  description:
    "Maquette de refonte du site akelius : appartements rénovés à louer à Paris, Londres et Montréal. Recherche par ville, surface et budget, carte interactive, espace pro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <LangProvider>
          <SplashScreen />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </LangProvider>
      </body>
    </html>
  );
}
