import homepage from "@/data/homepage.json";
import { getActivities } from "@/features/activities/data-access/activities";
import type { HomepageContent } from "@/features/homepage/types/homepage";

/**
 * Les nombres cites dans les textes d'accueil sont des jetons, pas des mots :
 * `{activityCount}` est remplace au build par le compte reel. Le texte reste
 * modifiable sans toucher au code, et aucune phrase ne peut annoncer vingt
 * sports le jour ou une section s'ajoute.
 */
const TOKENS: Record<string, () => string> = {
  "{activityCount}": () => String(getActivities().length),
};

function fillTokens(text: string) {
  return Object.entries(TOKENS).reduce(
    (filled, [token, resolve]) => filled.replaceAll(token, resolve()),
    text,
  );
}

export function getHomepageContent(): HomepageContent {
  const content = homepage as HomepageContent;

  return {
    ...content,
    hero: {
      ...content.hero,
      subtitle: content.hero.subtitle
        ? fillTokens(content.hero.subtitle)
        : undefined,
    },
  };
}
