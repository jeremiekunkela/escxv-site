export const routes = {
  home: "/",
  locations: "/lieux",
  association: "/association",
  news: "/actualites",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}

export function getNewsRoute(slug: string) {
  return `/actualites/${slug}`;
}
