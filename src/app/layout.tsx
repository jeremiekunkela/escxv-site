import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollReveal } from "@/components/shared/ScrollReveal/ScrollReveal";
import { siteUrl } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const club = getClubInfo();

export const metadata: Metadata = {
  title: {
    default: `${club.shortName} | Club omnisports Paris 15`,
    template: `%s | ${club.shortName}`,
  },
  description: club.description,
  metadataBase: new URL(siteUrl),
  /**
   * Deux icones pour deux usages, et c'est deliberé : Google Search ne lit pas
   * le SVG (BMP, GIF, ICO, PNG, JPEG, PPM et TIFF uniquement), il retient donc
   * le PNG detoure — le logo apparait dans les resultats sans la plaque
   * blanche. Les navigateurs, eux, savent lire le SVG et le preferent : l'icone
   * d'onglet reste celle d'avant, logo sur pastille blanche.
   */
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-plain.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/escxv-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth">
      <body className={`${inter.className} ${inter.variable}`}>
        <ScrollReveal />
        <SiteHeader />
        {children}
        <SiteFooter />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
