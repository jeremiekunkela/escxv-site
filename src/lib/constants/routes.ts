export const routes = {
  home: "/",
  sections: "/sections",
  practicalInfo: "/#practical-info",
  contact: "/contact",
} as const;

export function getActivityRoute(slug: string) {
  return `/sections/${slug}`;
}
