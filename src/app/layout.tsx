import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollReveal } from "@/components/shared/ScrollReveal/ScrollReveal";
import { siteUrl } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import { isIndexableEnvironment } from "@/lib/seo/indexing";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const club = getClubInfo();

/** « 15e arrondissement » se dit « Paris 15e » dans un titre de recherche. */
const district = club.arrondissement.replace(" arrondissement", "");
const siteTitle = `${club.shortName} – Club omnisports Paris ${district}`;

/**
 * Le gabarit place le nom du club puis son territoire derriere chaque titre de
 * page : « Judo – ESCXV | Paris 15e ». Google tronque autour de 60 signes et
 * coupe par la fin — le sujet de la page passe donc en premier, la marque et
 * le quartier suivent, et l'accueil garde son titre entier via `default`.
 */
export const metadata: Metadata = {
  title: {
    default: siteTitle,
    template: `%s – ${club.shortName} | Paris ${district}`,
  },
  description: club.description,
  metadataBase: new URL(siteUrl),
  applicationName: club.shortName,
  keywords: [
    club.shortName,
    "club omnisports",
    "Paris 15",
    `sport ${club.city} ${club.postalCode}`,
    "association sportive",
  ],
  authors: [{ name: club.shortName, url: siteUrl }],
  creator: club.shortName,
  publisher: club.shortName,
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png", sizes: "512x512" }],
    shortcut: "/favicon.png",
    apple: "/escxv-logo.png",
  },
  /**
   * Partage : sans ces balises, un lien colle dans WhatsApp ou Facebook
   * n'affiche qu'une adresse nue. Le logo sert d'illustration a defaut d'une
   * image dediee au format 1200x630.
   */
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: club.shortName,
    url: siteUrl,
    title: siteTitle,
    description: club.description,
    images: [
      {
        url: "/escxv-logo.png",
        width: 560,
        height: 445,
        alt: `Logo ${club.shortName}`,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: club.description,
    images: ["/escxv-logo.png"],
  },
  robots: isIndexableEnvironment()
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      }
    : { index: false, follow: false },
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
