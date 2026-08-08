export const routes = {
  home: "/",
  locations: "/lieux",
  club: "/club",
  news: "/actualites",
  legalNotice: "/mentions-legales",
  privacy: "/confidentialite",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}

export function getNewsRoute(slug: string) {
  return `/actualites/${slug}`;
}
