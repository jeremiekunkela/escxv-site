/**
 * Adresse publique du site : metadonnees, liens absolus, corps des emails.
 * Forme canonique avec `www` — l'apex redirige en 308, et un client de
 * messagerie ne suit pas forcement une redirection pour charger une image.
 */
export const siteUrl = "https://www.esc15.fr";

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
