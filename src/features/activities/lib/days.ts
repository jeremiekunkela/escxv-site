import type { DayOfWeek } from "@/features/activities/types/activity";

export const DAY_ORDER: DayOfWeek[] = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const DAY_SHORT_LABELS: Record<DayOfWeek, string> = {
  lundi: "Lun.",
  mardi: "Mar.",
  mercredi: "Mer.",
  jeudi: "Jeu.",
  vendredi: "Ven.",
  samedi: "Sam.",
  dimanche: "Dim.",
};

/** Un jour inconnu est renvoye en fin de semaine, jamais en tete de liste. */
export function getDayRank(day?: DayOfWeek) {
  const index = day ? DAY_ORDER.indexOf(day) : -1;

  return index === -1 ? DAY_ORDER.length : index;
}

export function formatDayShort(day: DayOfWeek) {
  return DAY_SHORT_LABELS[day];
}

/**
 * Jours distincts couverts par des creneaux, dans l'ordre de la semaine.
 * Sert a resumer un rythme sans detailler les horaires.
 */
export function getDistinctDays(schedules: { day?: DayOfWeek }[]) {
  return DAY_ORDER.filter((day) =>
    schedules.some((schedule) => schedule.day === day),
  );
}
