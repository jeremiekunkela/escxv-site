import { getOpenActivities } from "@/features/activities/data-access/activities";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import type { FooterContent, NavigationContent, NavigationLink } from "@/features/navigation/types/navigation";

const mainLinks: NavigationLink[] = [
  { label: "Accueil", href: routes.home },
  { label: "Infos pratiques", href: routes.practicalInfo },
];

export function getNavigationContent(): NavigationContent {
  const club = getClubInfo();

  return {
    club: {
      shortName: club.shortName,
      city: club.city,
      arrondissement: club.arrondissement,
    },
    mainLinks,
    activityLinks: getOpenActivities().map((activity) => ({
      label: activity.title,
      href: getActivityRoute(activity.slug),
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
