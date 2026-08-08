import type { ActivityIconName } from "@/features/activities/lib/activityIcons";

export type NavigationLink = {
  label: string;
  href: string;
  iconName?: ActivityIconName;
};

export type NavigationContent = {
  mainLinks: NavigationLink[];
  activityLinks: NavigationLink[];
  club: {
    shortName: string;
    city: string;
    arrondissement: string;
  };
};

export type FooterContent = {
  /**
   * Le pied de page est un point de secours : il reprend la navigation, y
   * compris ce que l'en-tete n'expose pas (les activites, qui n'y vivent que
   * dans un menu deroulant) et la prevention, enfouie au milieu d'une page.
   */
  mainLinks: NavigationLink[];
  /** Obligations legales : separees de la navigation, jamais melangees a elle. */
  legalLinks: NavigationLink[];
  club: {
    shortName: string;
    address: string;
    postalCode: string;
    city: string;
    arrondissement: string;
    phone: string;
    email: string | null;
    description: string;
  };
};
