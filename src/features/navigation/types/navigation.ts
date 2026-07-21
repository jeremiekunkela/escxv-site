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
  mainLinks: NavigationLink[];
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
