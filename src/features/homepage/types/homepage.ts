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
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
  };
  activitiesSection: {
    eyebrow?: string;
    title: string;
  };
};
