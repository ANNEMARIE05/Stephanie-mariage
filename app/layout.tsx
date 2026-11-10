import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Great_Vibes, Jost } from "next/font/google";
import "./globals.css";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const script = Great_Vibes({
  variable: "--font-script",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const sans = Jost({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alexandre & Stéphanie — Samedi 12 décembre 2026",
  description:
    "Invitation au mariage d’Alexandre et Stéphanie, le samedi 12 décembre 2026 à Cocody, Abidjan : programme, plans d’accès, confirmation de présence et mur des vœux.",
  openGraph: {
    title: "Alexandre & Stéphanie — 12 décembre 2026",
    description: "Mariage civil à l’Hôtel communal de Cocody (12h15) puis discours de mariage à Cocody Danga (13h30).",
    type: "website",
    locale: "fr_FR",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${serif.variable} ${script.variable} ${sans.variable}`}>
      {/* Certaines extensions (ColorZilla) ajoutent des attributs sur body avant l’hydratation. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
