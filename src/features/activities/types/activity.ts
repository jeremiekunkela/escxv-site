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

export type Gender = "mixte" | "feminin" | "masculin";

export type DayOfWeek =
  "lundi" | "mardi" | "mercredi" | "jeudi" | "vendredi" | "samedi" | "dimanche";

export type ScheduleType = "training" | "match";

export type Program = {
  title: string;
  audience: string;
  description: string;
  tags: string[];
};

export type ActivityContent = {
  heroSubtitle?: string;
  heroBadges: string[];
  introText?: string;
  schedulesSubtitle?: string;
  schedulesNoticeText?: string;
  pricesSubtitle?: string;
  locationsSubtitle?: string;
  contactText?: string;
  contactFormText?: string;
};

/**
 * Equipement d'un lieu de pratique (registre partage club-wide).
 * `relatedActivitySlugs` permet de mettre en avant, sur une page d'activite,
 * l'equipement pertinent pour ce sport (un equipement sans slug reste neutre).
 */
export type LocationEquipment = {
  label: string;
  relatedActivitySlugs?: string[];
  note?: string;
};

export type LocationType =
  "centre-sportif" | "gymnase" | "stade" | "piscine" | "salle" | "exterieur";

export type ActivityLocation = {
  id: string;
  name: string;
  address: string;
  city: string;
  postalCode: string;
  type: LocationType;
  mapUrl: string;
  mapEmbedUrl?: string;
  image?: string | null;
  description?: string;
  equipments?: LocationEquipment[];
};

/**
 * Groupe de pratique structuré (catégorie d'âge / niveau).
 * Remplace l'ancien `groupLabel` en texte libre : tri fiable, pas de doublon,
 * et flexible quel que soit le sport (codes U-, niveaux, ceintures...).
 */
export type PracticeGroup = {
  id: string;
  label: string;
  code?: string;
  public: ActivityPublic;
  birthYearMin?: number;
  birthYearMax?: number;
  gender: Gender;
  sortOrder: number;
};

export type ActivitySchedule = {
  id: string;
  practiceGroupId: string;
  locationId: string;
  type: ScheduleType;
  day?: DayOfWeek;
  startTime?: string;
  endTime?: string;
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

export type ActivitySocialNetwork = "facebook" | "instagram" | "x";

export type ActivitySocialLink = {
  network: ActivitySocialNetwork;
  handle: string;
  url?: string;
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
  image: string;
  registrationUrl: string | null;
  content: ActivityContent;
  programs: Program[];
  practiceGroups: PracticeGroup[];
  locations: ActivityLocation[];
  schedules: ActivitySchedule[];
  prices: ActivityPrice[];
  contacts: ActivityContact[];
  socialLinks?: ActivitySocialLink[];
};

/**
 * Forme de stockage d'une activité (telle qu'elle est dans activities.json
 * et telle que Directus la renverra plus tard) : les lieux ne sont pas
 * embarqués mais référencés par id. La data-access hydrate `locations`.
 */
export type ActivityRecord = Omit<Activity, "locations"> & {
  locationIds: string[];
};
