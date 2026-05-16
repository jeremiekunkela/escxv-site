export type ActivityCategory =
  | "arts-martiaux"
  | "athle-running"
  | "collectif"
  | "danse"
  | "eau"
  | "escalade"
  | "forme"
  | "raquette";

export type ActivityPublic = "enfants" | "adolescents" | "adultes";

export type ActivityStatus = "open" | "coming-soon";

export type Program = {
  title: string;
  audience: string;
  description: string;
  tags: string[];
};

export type ActivityContent = {
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaLabel: string;
  heroPrimaryCtaHref: string;
  heroSecondaryCtaLabel: string;
  heroSecondaryCtaHref: string;
  heroBadges: string[];
  introTitle: string;
  introText: string;
  introEyebrow?: string;
  schedulesTitle: string;
  schedulesSubtitle: string;
  schedulesEyebrow?: string;
  schedulesNoticeTitle: string;
  schedulesNoticeText: string;
  pricesTitle: string;
  pricesSubtitle: string;
  pricesEyebrow?: string;
  locationsTitle: string;
  locationsSubtitle: string;
  locationsEyebrow?: string;
  contactTitle: string;
  contactText: string;
  contactEyebrow?: string;
  contactFormTitle: string;
  contactFormText: string;
  formEyebrow?: string;
  formNameLabel?: string;
  formEmailLabel?: string;
  formPhoneLabel?: string;
  formMessageLabel?: string;
  formSubmitLabel?: string;
  contactNotes: string[];
};

export type ActivityLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  mapUrl: string;
  image?: string | null;
  description?: string;
  tags?: string[];
};

export type ActivitySchedule = {
  id: string;
  locationId: string;
  day: string;
  startTime: string;
  endTime: string;
  publics: ActivityPublic[];
  tags: string[];
  notes?: string;
};

export type ActivityExtraFee = {
  label: string;
  amount: number;
};

export type ActivityPrice = {
  id: string;
  season: string;
  label: string;
  clubFee: number;
  activityFee: number;
  total: number;
  extraFees: ActivityExtraFee[];
};

export type ActivityContact = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
};

export type Activity = {
  id: string;
  slug: string;
  title: string;
  shortName: string;
  icon: string;
  shortDescription: string;
  description: string;
  category: ActivityCategory[];
  publics: ActivityPublic[];
  tags: string[];
  status: ActivityStatus;
  image: string;
  registrationUrl: string | null;
  content: ActivityContent;
  programs: Program[];
  locations: ActivityLocation[];
  schedules: ActivitySchedule[];
  prices: ActivityPrice[];
  contacts: ActivityContact[];
};
