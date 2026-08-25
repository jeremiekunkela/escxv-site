import { getClubInfo } from "@/features/club/data-access/club";
import type { ContactChannel } from "@/features/contact/types/contact";

/**
 * Coordonnees directes du club, mises a la forme des cartes de contact des
 * pages de section. Les sections gardent les leurs sur leur propre page :
 * les publier toutes ici en ferait une cible de moissonnage.
 */
export const getClubContactChannels = (): ContactChannel[] => {
  const club = getClubInfo();

  return club.email
    ? [
        {
          id: "contact-club",
          name: club.name,
          role: "Secrétariat du club",
          email: club.email,
          phone: null,
        },
      ]
    : [];
};
