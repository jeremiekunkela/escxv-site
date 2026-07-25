export type HomepageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle?: string;
    imageUrl: string;
    primaryCtaLabel: string;
    primaryCtaHref: string;
    primaryCtaTarget?: "_blank" | "_self";
    primaryCtaRel?: string;
  };
  activitiesSection: {
    eyebrow?: string;
    title: string;
  };
};
