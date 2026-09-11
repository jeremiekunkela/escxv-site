import type {
  Installation,
  InstallationSport,
} from "@/features/activities/data-access/activities";

/**
 * Filtres du registre des lieux : la recherche libre, et le sport pratique.
 *
 * Pas de filtre par type d'equipement : `type` decrit le site, pas ce qu'on y
 * trouve. Un centre sportif abrite un gymnase, des salles et une piscine sans
 * etre typé ainsi — cocher « piscine » cachait donc La Plaine, qui en a une.
 * La nature reelle d'un equipement est portee par les espaces ; tant qu'ils ne
 * sont pas types, mieux vaut pas de filtre qu'un filtre qui masque.
 */
export type InstallationFilters = {
  sportSlugs: string[];
  query: string;
};

export const NO_INSTALLATION_FILTER: InstallationFilters = {
  sportSlugs: [],
  query: "",
};

/**
 * La recherche ne couvre que ce que la fiche affiche : nom, adresse,
 * description, espaces et sports. Un lieu qui remonterait sur un mot invisible
 * a l'ecran laisse son lecteur chercher pourquoi il est la.
 *
 * Les espaces comptent : c'est par eux qu'un complexe se trouve sur « piste »
 * ou « arts martiaux », que son nom ne mentionne pas.
 */
const matchesQuery = (installation: Installation, query: string) => {
  const normalizedQuery = query.trim().toLowerCase();

  return (
    normalizedQuery.length === 0 ||
    [
      installation.name,
      installation.address,
      installation.city,
      installation.postalCode,
      installation.description ?? "",
      ...installation.spaces.map((space) => space.label),
      ...installation.sports.map((sport) => sport.title),
    ]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery)
  );
};

const matchesSports = (installation: Installation, sportSlugs: string[]) =>
  sportSlugs.length === 0 ||
  installation.sports.some((sport) => sportSlugs.includes(sport.slug));

export const filterInstallations = (
  installations: Installation[],
  filters: InstallationFilters,
) =>
  installations.filter(
    (installation) =>
      matchesQuery(installation, filters.query) &&
      matchesSports(installation, filters.sportSlugs),
  );

/**
 * Registre des sports proposes au filtre : uniquement ceux rattaches a au
 * moins une installation, dedoublonnes et tries par titre.
 */
export const collectFilterableSports = (
  installations: Installation[],
): InstallationSport[] =>
  [
    ...new Map(
      installations.flatMap((installation) =>
        installation.sports.map((sport) => [sport.slug, sport] as const),
      ),
    ).values(),
  ].toSorted((left, right) => left.title.localeCompare(right.title, "fr"));
