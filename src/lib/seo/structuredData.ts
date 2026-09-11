import { siteUrl } from "@/lib/constants/routes";
import type { ClubInfo } from "@/features/club/types/club";

type BreadcrumbStep = {
  name: string;
  path: string;
};

const absolute = (path: string) => new URL(path, siteUrl).href;

/**
 * Fiche de l'association : le type `SportsClub` est celui que Google attend
 * d'un club, et l'adresse postale est ce qui le rattache au 15e dans les
 * resultats locaux. `alternateName` porte le nom complet, que personne ne
 * tape mais qui confirme l'identite.
 */
export const buildSportsClubSchema = (club: ClubInfo) => ({
  "@context": "https://schema.org",
  "@type": "SportsClub",
  "@id": `${siteUrl}/#club`,
  name: club.shortName,
  alternateName: club.name,
  description: club.description,
  url: siteUrl,
  logo: absolute("/escxv-logo.png"),
  image: absolute("/escxv-logo.png"),
  email: club.email,
  foundingDate: String(club.foundedYear),
  address: {
    "@type": "PostalAddress",
    streetAddress: club.address,
    postalCode: club.postalCode,
    addressLocality: club.city,
    addressCountry: "FR",
  },
  areaServed: {
    "@type": "AdministrativeArea",
    name: `${club.city} ${club.arrondissement}`,
  },
});

/**
 * Une section n'est pas une association a part : elle se declare comme
 * organisation sportive rattachee au club, avec son sport. C'est ce lien de
 * parente qui evite que vingt pages se presentent comme vingt clubs.
 */
export const buildSectionSchema = ({
  club,
  title,
  description,
  path,
  image,
}: {
  club: ClubInfo;
  title: string;
  description: string;
  path: string;
  image: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  name: `${title} – ${club.shortName}`,
  sport: title,
  description,
  url: absolute(path),
  image,
  parentOrganization: {
    "@type": "SportsClub",
    "@id": `${siteUrl}/#club`,
    name: club.shortName,
  },
});

/**
 * Fil d'ariane : c'est lui qui remplace l'adresse brute sous le titre dans
 * Google (« esc15.fr › Sections › Judo ») et qui aide a comprendre la
 * hierarchie du site.
 */
export const buildBreadcrumbSchema = (steps: BreadcrumbStep[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: steps.map((step, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: step.name,
    item: absolute(step.path),
  })),
});

export const buildNewsArticleSchema = ({
  club,
  title,
  description,
  path,
  publishedAt,
  image,
}: {
  club: ClubInfo;
  title: string;
  description: string;
  path: string;
  publishedAt: string;
  image?: string | null;
}) => ({
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  headline: title,
  description,
  datePublished: publishedAt,
  mainEntityOfPage: absolute(path),
  image: image ? [image] : undefined,
  author: { "@type": "Organization", name: club.shortName, url: siteUrl },
  publisher: {
    "@type": "Organization",
    name: club.shortName,
    logo: { "@type": "ImageObject", url: absolute("/escxv-logo.png") },
  },
});

/**
 * Les lieux de pratique, avec leur adresse postale : c'est par elles qu'un
 * gymnase du 15e peut remonter sur une recherche de quartier, et elles disent
 * a Google que le club a pignon sur rue en treize endroits.
 */
export const buildInstallationsSchema = (
  installations: {
    id: string;
    name: string;
    address: string;
    postalCode: string;
    city: string;
    sports: { title: string }[];
  }[],
  path: string,
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Lieux de pratique",
  url: absolute(path),
  numberOfItems: installations.length,
  itemListElement: installations.map((installation, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SportsActivityLocation",
      name: installation.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: installation.address,
        postalCode: installation.postalCode,
        addressLocality: installation.city,
        addressCountry: "FR",
      },
      sport: installation.sports.map((sport) => sport.title),
    },
  })),
});
