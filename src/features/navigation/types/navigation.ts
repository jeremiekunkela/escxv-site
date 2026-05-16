export type NavigationLink = {
  label: string;
  href: string;
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
    city: string;
    arrondissement: string;
    description: string;
  };
};
