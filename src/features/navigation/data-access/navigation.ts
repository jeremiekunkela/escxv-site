import { getActivities } from "@/features/activities/data-access/activities";
import { getActivityIconName } from "@/features/activities/lib/activityIcons";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import type {
  FooterContent,
  NavigationContent,
  NavigationLink,
} from "@/features/navigation/types/navigation";

const mainLinks: NavigationLink[] = [
  { label: "Accueil", href: routes.home },
  { label: "Installations", href: routes.installations },
  { label: "Actualités", href: routes.news },
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
    activityLinks: getActivities().map((activity) => ({
      label: activity.title,
      href: getActivityRoute(activity.slug),
      iconName: getActivityIconName(activity.slug),
    })),
  };
}

export function getFooterContent(): FooterContent {
  const club = getClubInfo();

  return {
    club: {
      shortName: club.shortName,
      address: club.address,
      postalCode: club.postalCode,
      city: club.city,
      arrondissement: club.arrondissement,
      phone: club.phone,
      email: club.email,
      description: club.description,
    },
    mainLinks,
  };
}
