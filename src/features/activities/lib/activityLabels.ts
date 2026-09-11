import type {
  ActivityCategory,
  ActivityPublic,
} from "@/features/activities/types/activity";

/**
 * « Jeunes » plutot qu'« Adolescents » : c'est le mot des familles et des
 * sections. Le code garde le terme du modele, l'ecran garde le leur.
 */
export const publicLabels: Record<ActivityPublic, string> = {
  enfants: "Enfants",
  adolescents: "Jeunes",
  adultes: "Adultes",
};

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
