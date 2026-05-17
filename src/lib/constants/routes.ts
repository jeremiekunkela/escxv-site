export const routes = {
  home: "/",
  sections: "/sections",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}
