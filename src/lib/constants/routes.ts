export const routes = {
  home: "/",
  association: "/association",
  news: "/actualités",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}

export function getNewsRoute(slug: string) {
  return `/actualités/${slug}`;
}
