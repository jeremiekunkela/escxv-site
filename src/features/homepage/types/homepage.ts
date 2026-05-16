export type HomepageInfoItem = {
  title: string;
  description: string;
};

export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    badges: string[];
    primaryCtaLabel: string;
    primaryCtaHref: string;
    secondaryCtaLabel: string;
    secondaryCtaHref: string;
  };
  practicalInfo: {
    eyebrow?: string;
    title: string;
    items: HomepageInfoItem[];
  };
  activitiesSection: {
    eyebrow?: string;
    title: string;
    subtitle: string;
  };
};
