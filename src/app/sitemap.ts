import type { MetadataRoute } from "next";
import { getActivities } from "@/features/activities/data-access/activities";
import { getPublishedNews } from "@/features/news/data-access/news";
import { getActivityRoute, getNewsRoute, routes, siteUrl } from "@/lib/constants/routes";

/**
 * Sitemap derive des donnees, jamais saisi : une page ajoutee y entre seule,
 * une section retiree en sort. Les brouillons d'actualites en sont exclus par
 * `getPublishedNews`, comme ailleurs sur le site.
 *
 * Ni `priority` ni `changeFrequency` : Google les ignore depuis longtemps, et
 * les renseigner ne ferait qu'ajouter une valeur a maintenir. `lastModified`
 * n'est pose que sur les actualites, seules pages a porter une vraie date —
 * un sitemap qui annonce toutes ses pages modifiees aujourd'hui apprend a
 * Google a ne plus lire le champ.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    routes.home,
    routes.club,
    routes.locations,
    routes.news,
    routes.contact,
    routes.legalNotice,
    routes.privacy,
  ].map((route) => ({ url: new URL(route, siteUrl).href }));

  const activityRoutes = getActivities().map((activity) => ({
    url: new URL(getActivityRoute(activity.slug), siteUrl).href,
  }));

  const newsRoutes = getPublishedNews().map((newsItem) => ({
    url: new URL(getNewsRoute(newsItem.slug), siteUrl).href,
    lastModified: new Date(newsItem.publishedAt),
  }));

  return [...staticRoutes, ...activityRoutes, ...newsRoutes];
}
