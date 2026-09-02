import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/constants/routes";

/**
 * Tout est indexable sauf la route de contact : elle ne rend aucune page,
 * seulement des jetons et des reponses d'envoi. Le sitemap est declare ici en
 * plus d'etre soumis a Search Console — les autres moteurs ne lisent que ca.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: new URL("/sitemap.xml", siteUrl).href,
    host: siteUrl,
  };
}
