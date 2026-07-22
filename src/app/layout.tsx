import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { ScrollReveal } from "@/components/shared/ScrollReveal/ScrollReveal";
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
  metadataBase: new URL("https://escxv.fr"),
  icons: {
    icon: [{ url: "/escxv-logo.png", type: "image/png" }],
    shortcut: "/escxv-logo.png",
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
      </body>
    </html>
  );
}
