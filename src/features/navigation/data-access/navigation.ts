import { getActivities } from "@/features/activities/data-access/activities";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import type {
  FooterContent,
  NavigationContent,
  NavigationIconName,
  NavigationLink,
} from "@/features/navigation/types/navigation";

const mainLinks: NavigationLink[] = [
  { label: "Accueil", href: routes.home },
  { label: "Installations", href: routes.installations },
  { label: "Actualités", href: routes.news },
];

const activityIconNamesBySlug: Record<string, NavigationIconName> = {
  aikibudo: "sports_martial_arts",
  athletisme: "directions_run",
  badminton: "sports_tennis",
  baseball: "sports_baseball",
  capoeira: "sports_martial_arts",
  "course-a-pied-trail": "hiking",
  "danse-moderne": "music_note",
  escalade: "hiking",
  football: "sports_soccer",
  "gymnastique-entretien": "sports_gymnastics",
  judo: "sports_martial_arts",
  natation: "pool",
  pilates: "self_improvement",
  "renforcement-musculaire": "fitness_center",
  "sport-mercredi": "sports",
  stretching: "self_improvement",
  tennis: "sports_tennis",
  "tennis-table": "sports_tennis",
  "volley-ball": "sports_volleyball",
  yoga: "self_improvement",
};

export function getNavigationContent(): NavigationContent {
  const club = getClubInfo();

  return {
    club: {
      shortName: club.shortName,
      city: club.city,
      arrondissement: club.arrondissement,
    },
    mainLinks,
    activityLinks: getActivities().map((activity) => ({
      label: activity.title,
      href: getActivityRoute(activity.slug),
      iconName: activityIconNamesBySlug[activity.slug],
    })),
  };
}

export function getFooterContent(): FooterContent {
  const club = getClubInfo();

  return {
    club: {
      shortName: club.shortName,
      city: club.city,
      arrondissement: club.arrondissement,
      description: club.description,
    },
    mainLinks,
  };
}
