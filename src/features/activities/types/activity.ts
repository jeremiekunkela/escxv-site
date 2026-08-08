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
  schedulesNoticeText?: string;
  contactText?: string;
  contactFormText?: string;
};

/**
 * Espace de pratique d'un lieu : une meme adresse en abrite plusieurs
 * (La Plaine : terrain, piscine, salle d'arts martiaux). Le lieu porte
 * l'adresse et la carte, l'espace porte ce que la section voit reellement.
 *
 * `amenities` appartient a l'espace, pas au site : les gradins sont au terrain
 * de football, pas dans la salle de tennis de table.
 *
 * `id` est stable et prefixe par le lieu : future cle primaire de la
 * collection Directus `location_spaces` (FK vers `locations`).
 */
export type LocationSpace = {
  id: string;
  label: string;
  description?: string;
  image?: string | null;
  amenities?: string[];
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
  spaces?: LocationSpace[];
};

/**
 * Lieu tel qu'une section le voit : le registre du lieu, restreint aux espaces
 * ou elle pratique vraiment. Derive des creneaux, jamais saisi a la main.
 */
export type ActivityPracticeLocation = Omit<ActivityLocation, "spaces"> & {
  spaces: LocationSpace[];
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
  /**
   * Espace ou se deroule le creneau, et non simple lieu : c'est de lui que se
   * deduisent les lieux de la section. Optionnel car un creneau peut exister
   * avant que le lieu exact soit connu (cf. volley « Plaisir »).
   */
  spaceId?: string;
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
  ageRange?: string;
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
  locations: ActivityPracticeLocation[];
  schedules: ActivitySchedule[];
  prices: ActivityPrice[];
  contacts: ActivityContact[];
  socialLinks?: ActivitySocialLink[];
};

/**
 * Forme de stockage d'une activité (telle qu'elle est dans activities.json
 * et telle que Directus la renverra plus tard). L'activité ne declare aucun
 * lieu : chaque creneau pointe son espace, et `locations` s'en deduit. Une
 * seule saisie, donc aucune divergence possible entre les deux.
 */
export type ActivityRecord = Omit<Activity, "locations">;
