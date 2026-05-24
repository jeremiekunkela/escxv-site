export type NavigationIconName =
  | "directions_run"
  | "fitness_center"
  | "hiking"
  | "music_note"
  | "pool"
  | "self_improvement"
  | "sports"
  | "sports_baseball"
  | "sports_gymnastics"
  | "sports_martial_arts"
  | "sports_soccer"
  | "sports_tennis"
  | "sports_volleyball";

export type NavigationLink = {
  label: string;
  href: string;
  iconName?: NavigationIconName;
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
