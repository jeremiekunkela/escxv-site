export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    badges: string[];
    primaryCtaLabel: string;
    primaryCtaHref: string;
  };
  activitiesSection: {
    eyebrow?: string;
    title: string;
    subtitle: string;
  };
};
