import { describe, expect, it } from "vitest";
import {
  collectFilterableSports,
  filterInstallations,
  NO_INSTALLATION_FILTER,
} from "@/features/activities/lib/installationFilters";
import type { Installation } from "@/features/activities/data-access/activities";

const judo = { slug: "judo", title: "Judo", shortName: "Judo", icon: "🥋" };
const natation = {
  slug: "natation",
  title: "Natation",
  shortName: "Natation",
  icon: "🏊",
};

const buildInstallation = (
  installation: Partial<Installation>,
): Installation => ({
  id: "lieu",
  name: "Lieu",
  address: "1 rue du Test",
  city: "Paris",
  postalCode: "75015",
  type: "gymnase",
  mapUrl: "",
  spaces: [],
  sports: [],
  ...installation,
});

const laPlaine = buildInstallation({
  id: "la-plaine",
  name: "Centre sportif de La Plaine",
  type: "centre-sportif",
  spaces: [
    { id: "la-plaine-piscine", label: "Piscine", sports: [natation] },
    { id: "la-plaine-boxe", label: "Salle de boxe", sports: [] },
  ],
  sports: [judo, natation],
});

const keller = buildInstallation({
  id: "keller",
  name: "Salle Keller",
  address: "16 rue de l'Ingénieur Robert Keller",
  type: "salle",
  sports: [],
});

const pershing = buildInstallation({
  id: "pershing",
  name: "Stade Pershing",
  city: "Paris",
  postalCode: "75012",
  type: "stade",
  sports: [judo],
});

const installations = [laPlaine, keller, pershing];

describe("filterInstallations", () => {
  it("rend tout quand rien n'est demande", () => {
    expect(
      filterInstallations(installations, NO_INSTALLATION_FILTER),
    ).toHaveLength(3);
  });

  it("retient les lieux ou un sport coche se pratique", () => {
    const result = filterInstallations(installations, {
      ...NO_INSTALLATION_FILTER,
      sportSlugs: ["natation"],
    });

    expect(result.map((installation) => installation.id)).toEqual(["la-plaine"]);
  });

  it("croise la recherche libre et les sports coches", () => {
    const result = filterInstallations(installations, {
      sportSlugs: ["judo"],
      query: "pershing",
    });

    expect(result.map((installation) => installation.id)).toEqual(["pershing"]);
  });

  it("cherche aussi dans l'adresse et le nom complet", () => {
    expect(
      filterInstallations(installations, {
        ...NO_INSTALLATION_FILTER,
        query: "ingénieur",
      }).map((installation) => installation.id),
    ).toEqual(["keller"]);

    expect(
      filterInstallations(installations, {
        ...NO_INSTALLATION_FILTER,
        query: "centre sportif",
      }).map((installation) => installation.id),
    ).toEqual(["la-plaine"]);
  });

  /**
   * Le nom et le type de La Plaine ne disent ni « piscine » ni « boxe » : sans
   * les espaces, un complexe reste introuvable par ce qu'il abrite.
   */
  it("trouve un lieu par le nom d'un de ses espaces", () => {
    expect(
      filterInstallations(installations, {
        ...NO_INSTALLATION_FILTER,
        query: "piscine",
      }).map((installation) => installation.id),
    ).toEqual(["la-plaine"]);

    expect(
      filterInstallations(installations, {
        ...NO_INSTALLATION_FILTER,
        query: "boxe",
      }).map((installation) => installation.id),
    ).toEqual(["la-plaine"]);
  });

  it("ignore la casse et les espaces autour de la recherche", () => {
    expect(
      filterInstallations(installations, {
        ...NO_INSTALLATION_FILTER,
        query: "  KELLER ",
      }),
    ).toHaveLength(1);
  });
});

describe("collectFilterableSports", () => {
  it("dedoublonne les sports et les trie par titre", () => {
    expect(
      collectFilterableSports(installations).map((sport) => sport.slug),
    ).toEqual(["judo", "natation"]);
  });
});

describe("espaces du registre", () => {
  /**
   * Garde-fou sur les donnees reelles : un espace que le club n'utilise pas ne
   * doit ni s'afficher ni se chercher. La Plaine a une salle de boxe ou aucune
   * section ne va.
   */
  it("n'expose que les espaces ou une section pratique", async () => {
    const { getInstallations } = await import(
      "@/features/activities/data-access/activities"
    );
    const installations = getInstallations();
    const orphelins = installations.flatMap((installation) =>
      installation.spaces
        .filter((space) => space.sports.length === 0)
        .map((space) => `${installation.name} / ${space.label}`),
    );

    expect(orphelins).toEqual([]);
  });

  it("ne fait pas remonter le club sur un sport qu'il ne propose pas", async () => {
    const { getInstallations } = await import(
      "@/features/activities/data-access/activities"
    );

    expect(
      filterInstallations(getInstallations(), {
        ...NO_INSTALLATION_FILTER,
        query: "boxe",
      }),
    ).toEqual([]);
  });
});
