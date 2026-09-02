/** Adresse publique du site : metadonnees, liens absolus, corps des emails. */
export const siteUrl = "https://escxv.fr";

export const routes = {
  home: "/",
  locations: "/lieux",
  club: "/club",
  news: "/actualites",
  contact: "/contact",
  legalNotice: "/mentions-legales",
  privacy: "/confidentialite",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}

export function getNewsRoute(slug: string) {
  return `/actualites/${slug}`;
}
