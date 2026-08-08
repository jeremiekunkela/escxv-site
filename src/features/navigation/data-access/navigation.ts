import { getActivities } from "@/features/activities/data-access/activities";
import { getActivityIconName } from "@/features/activities/lib/activityIcons";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import { getClubInfo } from "@/features/club/data-access/club";
import type {
  FooterContent,
  NavigationContent,
  NavigationLink,
} from "@/features/navigation/types/navigation";

/**
 * Ordre de lecture : les besoins pratiques d'abord, l'institutionnel en
 * dernier. Le menu deroulant des activites les precede, dans le composant
 * d'en-tete — c'est la raison de venue la plus frequente.
 */
const mainLinks: NavigationLink[] = [
  { label: "Lieux", href: routes.locations },
  { label: "Actualités", href: routes.news },
  { label: "Le club", href: routes.club },
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

/**
 * Les activites n'ont pas de page d'index : l'en-tete les expose en menu
 * deroulant, le pied de page renvoie donc au repertoire de l'accueil. La
 * prevention VHSS, elle, est un signal de serieux qu'on ne trouve autrement
 * qu'en defilant au milieu de la page du club.
 */
const footerLinks: NavigationLink[] = [
  { label: "Activités", href: `${routes.home}#activities` },
  ...mainLinks,
  { label: "Prévention et VHSS", href: `${routes.club}#vhss` },
];

const legalLinks: NavigationLink[] = [
  { label: "Mentions légales", href: routes.legalNotice },
  { label: "Confidentialité", href: routes.privacy },
];

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
    mainLinks: footerLinks,
    legalLinks,
  };
}
