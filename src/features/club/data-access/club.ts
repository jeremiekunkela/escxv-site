import club from "@/data/club.json";
import {
  getActivities,
  getLocations,
} from "@/features/activities/data-access/activities";
import type { ClubInfo } from "@/features/club/types/club";
import type { KeyFigure } from "@/types/content";

/**
 * Un chiffre qui se compte n'est pas un contenu : il se derive. La valeur
 * saisie dans club.json ne sert que de repli si la source est inconnue.
 */
function resolveKeyFigure(figure: KeyFigure): KeyFigure {
  const counts = {
    activities: () => getActivities().length,
    locations: () => getLocations().length,
  };
  const count = figure.source ? counts[figure.source]() : null;

  return count === null ? figure : { ...figure, value: String(count) };
}

export function getClubInfo(): ClubInfo {
  const info = club as ClubInfo;

  return { ...info, keyFigures: info.keyFigures.map(resolveKeyFigure) };
}
