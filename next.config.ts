import type { NextConfig } from "next";

/**
 * Anciennes URLs d'esc15.fr. Le nouveau site reprend le meme domaine : la
 * bascule se fait au DNS, l'ancien serveur disparait. Tout ce qui a ete
 * indexe, partage ou imprime en QR code doit donc atterrir ici.
 *
 * Regle appliquee : on ne redirige que vers une page dont le contenu existe
 * vraiment. Pas de repli vers l'accueil, que Google traiterait en soft-404 et
 * qui ferait perdre son contexte au visiteur. Les anciennes pages sans
 * equivalent (adhesion, documents, articles, FAQ, plan du site, recherche...)
 * ne sont volontairement pas listees : elles repondent 404.
 */

/** Prefixe d'ancre des cartes de lieu, cf. getActivityLocationAnchorId. */
const locationAnchorPrefix = "lieu-pratique-";

/**
 * Sections : ancien slug a la racine -> slug actuel sous /sections. La
 * plupart sont identiques, trois ont ete renommes ; on garde donc la table
 * explicite plutot qu'un /:slug attrape-tout, qui capturerait aussi les
 * lieux, les articles et les pages annexes.
 */
const activitySlugMapping: Record<string, string> = {
  aikibudo: "aikibudo",
  athletisme: "athletisme",
  badminton: "badminton",
  baseball: "baseball",
  capoeira: "capoeira",
  "course-a-pied-trail": "course-a-pied-trail",
  danse: "danse-moderne",
  escalade: "escalade",
  football: "football",
  // L'ancien site separait gym acrobatique et gym d'entretien ; il n'y a en
  // realite qu'une seule section, celle d'entretien.
  gymnastique: "gymnastique-entretien",
  "gymnastique-entretien": "gymnastique-entretien",
  judo: "judo",
  natation: "natation",
  pilates: "pilates",
  "renforcement-musculaire": "renforcement-musculaire",
  mercredi: "sport-mercredi",
  stretching: "stretching",
  tennis: "tennis",
  "tennis-de-table": "tennis-table",
  "volley-ball": "volley-ball",
  yoga: "yoga",
};

/**
 * Lieux : les treize pages de lieu de l'ancien site sont devenues autant de
 * fiches sur la page /lieux. On vise l'ancre de la fiche concernee, ce qui
 * reste une correspondance exacte au lieu d'un simple repli sur l'index.
 * Federation, Dupleix et le siege du club n'ont plus de fiche du tout.
 */
const locationIdMapping: Record<string, string> = {
  "emile-anthoine": "emile-anthoine",
  brancion: "brancion",
  "cambronne-sablonniere": "sablonniere",
  cevennes: "cevennes",
  "croix-nivert": "croix-nivert",
  keller: "keller",
  "la-plaine": "la-plaine",
  lacretelle: "lacretelle",
  barruel: "paul-barruel",
  pershing: "pershing",
  "saint-lambert": "saint-lambert",
  "suzanne-lenglen": "suzanne-lenglen",
};

const toPermanentRedirect = (source: string, destination: string) => ({
  source,
  destination,
  permanent: true,
});

const activityRedirects = Object.entries(activitySlugMapping).map(
  ([oldSlug, slug]) => toPermanentRedirect(`/${oldSlug}`, `/sections/${slug}`),
);

const locationRedirects = Object.entries(locationIdMapping).map(
  ([oldSlug, locationId]) =>
    toPermanentRedirect(
      `/${oldSlug}`,
      `/lieux#${locationAnchorPrefix}${locationId}`,
    ),
);

/** Navigation et pages annexes dont l'equivalent est direct. */
const staticRedirects = [
  // Navigation
  toPermanentRedirect("/index", "/"),
  // Lieux : l'index de la rubrique a simplement ete mis au pluriel.
  toPermanentRedirect("/lieu", "/lieux"),
  // Pages annexes
  toPermanentRedirect("/qui-sommes-nous", "/club"),
  toPermanentRedirect("/politique-confidentialite", "/confidentialite"),
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  async redirects() {
    return [...staticRedirects, ...activityRedirects, ...locationRedirects];
  },
};

export default nextConfig;
