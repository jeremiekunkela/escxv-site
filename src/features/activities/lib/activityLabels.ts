import type {
  ActivityCategory,
  LocationType,
} from "@/features/activities/types/activity";

export const categoryLabels: Record<ActivityCategory, string> = {
  "arts-martiaux": "Arts martiaux",
  "athle-running": "Athle & running",
  collectif: "Sport collectif",
  danse: "Danse",
  eau: "Eau",
  escalade: "Escalade",
  forme: "Forme & sante",
  raquette: "Raquette",
};

export const locationTypeLabels: Record<LocationType, string> = {
  "centre-sportif": "Centre sportif",
  gymnase: "Gymnase",
  stade: "Stade",
  piscine: "Piscine",
  salle: "Salle",
  exterieur: "Exterieur",
};
