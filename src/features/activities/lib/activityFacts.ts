import type { Activity } from "@/features/activities/types/activity";
import { formatEuro, formatPublicLabel } from "@/lib/utils";
import { formatDayShort, getDistinctDays } from "./days";

export type ActivityFact = {
  label: string;
  value: string;
};

function getPublicsValue(activity: Activity) {
  return activity.publics.map(formatPublicLabel).join(" · ");
}

function getDaysValue(activity: Activity) {
  return getDistinctDays(activity.schedules).map(formatDayShort).join(" · ");
}

/**
 * Un seul lieu : on le nomme, c'est l'information que le visiteur cherche.
 * Plusieurs : on compte, car empiler des noms d'equipements municipaux ne se
 * lit pas d'un coup d'oeil — le detail est de toute facon plus bas.
 */
function getLocationsValue(activity: Activity) {
  return activity.locations.length > 1
    ? `${activity.locations.length} lieux`
    : (activity.locations[0]?.name ?? "");
}

/**
 * Le total inclut deja cotisation club et participation activite : c'est le
 * montant reellement demande, donc le seul qu'on puisse annoncer sans tromper.
 */
function getPriceValue(activity: Activity) {
  const totals = activity.prices.map((price) => price.total);

  return totals.length === 0 ? "" : `${formatEuro(Math.min(...totals))} / saison`;
}

/**
 * Les quatre questions posees avant toutes les autres : pour qui, quand, ou,
 * combien. Entierement derive des donnees de la section — aucune saisie en
 * plus, donc aucune divergence possible avec les creneaux et tarifs detailles
 * plus bas dans la page.
 *
 * Un fait sans donnee est omis plutot qu'affiche vide : trois faits justes
 * valent mieux qu'un quatrieme « a confirmer ».
 */
export function getActivityFacts(activity: Activity): ActivityFact[] {
  return [
    { label: "Public", value: getPublicsValue(activity) },
    { label: "Jours", value: getDaysValue(activity) },
    { label: "Lieu", value: getLocationsValue(activity) },
    { label: "À partir de", value: getPriceValue(activity) },
  ].filter((fact) => fact.value.length > 0);
}
