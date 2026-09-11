import { describe, expect, it } from "vitest";
import {
  collectFilterableDays,
  collectFilterableLocations,
  filterActivities,
  NO_ACTIVITY_FILTER,
  sortActivitiesByTitle,
} from "@/features/activities/lib/activityFilters";
import type { Activity } from "@/features/activities/types/activity";

const buildActivity = (activity: Partial<Activity>): Activity =>
  ({
    id: "test",
    slug: "test",
    title: "Test",
    shortName: "Test",
    icon: "🏅",
    shortDescription: "",
    description: "",
    category: [],
    publics: [],
    tags: [],
    image: "",
    registrationUrl: null,
    content: {},
    programs: [],
    practiceGroups: [],
    locations: [],
    schedules: [],
    prices: [],
    contacts: [],
    ...activity,
  }) as Activity;

const laPlaine = {
  id: "la-plaine",
  name: "Centre sportif de La Plaine",
} as Activity["locations"][number];

const keller = {
  id: "keller",
  name: "Salle Keller",
} as Activity["locations"][number];

const judo = buildActivity({
  id: "judo",
  title: "Judo",
  publics: ["enfants"],
  locations: [laPlaine],
  schedules: [
    { id: "judo-lundi", practiceGroupId: "g", type: "training", day: "lundi", tags: [] },
    { id: "judo-mercredi", practiceGroupId: "g", type: "training", day: "mercredi", tags: [] },
  ],
});

const badminton = buildActivity({
  id: "badminton",
  title: "Badminton",
  publics: ["adultes"],
  locations: [keller],
  schedules: [
    { id: "bad-mercredi", practiceGroupId: "g", type: "training", day: "mercredi", tags: [] },
  ],
});

/** Creneau sans jour connu : le volley existe, mais aucun jour ne le porte. */
const volley = buildActivity({
  id: "volley",
  title: "Volley-ball",
  publics: ["adultes"],
  locations: [],
  schedules: [{ id: "volley-?", practiceGroupId: "g", type: "training", tags: [] }],
});

const activities = [judo, badminton, volley];

describe("filterActivities", () => {
  it("rend tout quand aucune case n'est cochee", () => {
    expect(filterActivities(activities, NO_ACTIVITY_FILTER)).toHaveLength(3);
  });

  it("retient une activite des qu'un seul creneau tombe un jour coche", () => {
    const result = filterActivities(activities, {
      ...NO_ACTIVITY_FILTER,
      days: ["lundi"],
    });

    expect(result.map((activity) => activity.id)).toEqual(["judo"]);
  });

  it("elargit quand deux jours sont coches", () => {
    const result = filterActivities(activities, {
      ...NO_ACTIVITY_FILTER,
      days: ["lundi", "mercredi"],
    });

    expect(result.map((activity) => activity.id)).toEqual(["judo", "badminton"]);
  });

  it("restreint quand deux criteres differents sont poses", () => {
    const result = filterActivities(activities, {
      publics: ["adultes"],
      days: ["mercredi"],
      locationIds: ["keller"],
    });

    expect(result.map((activity) => activity.id)).toEqual(["badminton"]);
  });

  it("ecarte l'activite dont le creneau n'a pas de jour", () => {
    const result = filterActivities(activities, {
      ...NO_ACTIVITY_FILTER,
      days: ["mercredi"],
    });

    expect(result.map((activity) => activity.id)).toEqual(["judo", "badminton"]);
  });

  it("ne rend rien quand les criteres ne se croisent pas", () => {
    const result = filterActivities(activities, {
      ...NO_ACTIVITY_FILTER,
      publics: ["enfants"],
      locationIds: ["keller"],
    });

    expect(result).toEqual([]);
  });
});

describe("collectFilterableDays", () => {
  it("ne propose que les jours occupes, dans l'ordre de la semaine", () => {
    expect(collectFilterableDays(activities)).toEqual(["lundi", "mercredi"]);
  });

  it("ne propose aucun jour sans creneau date", () => {
    expect(collectFilterableDays([volley])).toEqual([]);
  });
});

describe("collectFilterableLocations", () => {
  it("dedoublonne et trie les lieux par nom", () => {
    const doublon = buildActivity({ id: "autre", locations: [laPlaine] });

    expect(
      collectFilterableLocations([...activities, doublon]).map(
        (location) => location.name,
      ),
    ).toEqual(["Centre sportif de La Plaine", "Salle Keller"]);
  });
});

describe("sortActivitiesByTitle", () => {
  it("trie sans toucher au tableau recu", () => {
    const sorted = sortActivitiesByTitle(activities);

    expect(sorted.map((activity) => activity.title)).toEqual([
      "Badminton",
      "Judo",
      "Volley-ball",
    ]);
    expect(activities[0].title).toBe("Judo");
  });
});
