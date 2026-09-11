import { DAY_ORDER } from "@/features/activities/lib/days";
import type {
  Activity,
  ActivityPublic,
  DayOfWeek,
} from "@/features/activities/types/activity";

/**
 * Filtres du repertoire, chacun multi-valeur. Une liste vide ne filtre rien :
 * c'est l'etat neutre, et c'est aussi ce que produit le fait de tout decocher
 * — deux facons d'arriver au meme ecran, une seule representation.
 */
export type ActivityFilters = {
  publics: ActivityPublic[];
  days: DayOfWeek[];
  locationIds: string[];
};

export type ActivityFilterLocation = {
  id: string;
  name: string;
};

/** Critere vise par une etiquette qu'on retire. */
export type ActivityFilterKey = keyof ActivityFilters & string;

export const NO_ACTIVITY_FILTER: ActivityFilters = {
  publics: [],
  days: [],
  locationIds: [],
};

const matchesPublics = (activity: Activity, publics: ActivityPublic[]) =>
  publics.length === 0 ||
  publics.some((value) => activity.publics.includes(value));

/**
 * Un jour retenu des qu'un seul creneau l'occupe : la question posee est
 * « que puis-je faire le mercredi », pas « qui ne pratique que le mercredi ».
 */
const matchesDays = (activity: Activity, days: DayOfWeek[]) =>
  days.length === 0 ||
  activity.schedules.some(
    (schedule) => schedule.day !== undefined && days.includes(schedule.day),
  );

const matchesLocations = (activity: Activity, locationIds: string[]) =>
  locationIds.length === 0 ||
  activity.locations.some((location) => locationIds.includes(location.id));

/**
 * « Ou » a l'interieur d'un critere, « et » entre criteres : cocher lundi et
 * mercredi elargit, ajouter un lieu restreint. C'est la lecture spontanee
 * d'une liste de cases, et celle de tous les moteurs de recherche.
 */
export const filterActivities = (
  activities: Activity[],
  filters: ActivityFilters,
) =>
  activities.filter(
    (activity) =>
      matchesPublics(activity, filters.publics) &&
      matchesDays(activity, filters.days) &&
      matchesLocations(activity, filters.locationIds),
  );

export const sortActivitiesByTitle = (activities: Activity[]) =>
  activities.toSorted((left, right) =>
    left.title.localeCompare(right.title, "fr"),
  );

/**
 * Jours et lieux proposes au filtre : uniquement ceux qu'une activite occupe
 * vraiment. Une case qui ne peut mener qu'a une liste vide n'a pas a exister,
 * et la liste se reduit d'elle-meme si une section arrete un creneau.
 */
export const collectFilterableDays = (activities: Activity[]): DayOfWeek[] =>
  DAY_ORDER.filter((day) =>
    activities.some((activity) =>
      activity.schedules.some((schedule) => schedule.day === day),
    ),
  );

export const collectFilterableLocations = (
  activities: Activity[],
): ActivityFilterLocation[] =>
  [
    ...new Map(
      activities.flatMap((activity) =>
        activity.locations.map(
          (location) =>
            [location.id, { id: location.id, name: location.name }] as const,
        ),
      ),
    ).values(),
  ].toSorted((left, right) => left.name.localeCompare(right.name, "fr"));
