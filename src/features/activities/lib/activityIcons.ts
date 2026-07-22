/**
 * Pictogrammes Material Symbols associés aux activités.
 * Partage par la navigation et le repertoire d'activités : une activité doit
 * porter la même icône partout sur le site.
 */
export type ActivityIconName =
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

const activityIconNamesBySlug: Record<string, ActivityIconName> = {
  aikibudo: "sports_martial_arts",
  athletisme: "directions_run",
  badminton: "sports_tennis",
  baseball: "sports_baseball",
  capoeira: "sports_martial_arts",
  "course-a-pied-trail": "hiking",
  "danse-moderne": "music_note",
  escalade: "hiking",
  football: "sports_soccer",
  "gymnastique-entretien": "sports_gymnastics",
  judo: "sports_martial_arts",
  natation: "pool",
  pilates: "self_improvement",
  "renforcement-musculaire": "fitness_center",
  "sport-mercredi": "sports",
  stretching: "self_improvement",
  tennis: "sports_tennis",
  "tennis-table": "sports_tennis",
  "volley-ball": "sports_volleyball",
  yoga: "self_improvement",
};

/** Retombe sur le pictogramme generique si le slug n'est pas encore mappe. */
export function getActivityIconName(slug: string): ActivityIconName {
  return activityIconNamesBySlug[slug] ?? "sports";
}
