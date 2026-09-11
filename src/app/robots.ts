import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants/routes";
import { isIndexableEnvironment } from "@/lib/seo/indexing";

/**
 * Tout est indexable sauf la route de contact : elle ne rend aucune page,
 * seulement des jetons et des reponses d'envoi. Le sitemap est declare ici en
 * plus d'etre soumis a Search Console — les autres moteurs ne lisent que ca.
 *
 * Hors production, tout est ferme : une preversion Vercel repond sur son
 * propre domaine et ferait doublon avec le site officiel.
 */
export default function robots(): MetadataRoute.Robots {
  return isIndexableEnvironment()
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: "/api/",
        },
        sitemap: new URL("/sitemap.xml", siteUrl).href,
        host: siteUrl,
      }
    : {
        rules: {
          userAgent: "*",
          disallow: "/",
        },
      };
}
