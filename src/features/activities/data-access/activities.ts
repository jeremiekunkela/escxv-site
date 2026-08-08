import activities from "@/data/activities.json";
import locations from "@/data/locations.json";
import type {
  Activity,
  ActivityLocation,
  ActivityPracticeLocation,
  ActivityRecord,
  ActivitySchedule,
  LocationSpace,
} from "@/features/activities/types/activity";

const allLocations = locations as ActivityLocation[];

function getSpaceIds(schedules: ActivitySchedule[]) {
  return new Set(
    schedules
      .map((schedule) => schedule.spaceId)
      .filter((spaceId): spaceId is string => Boolean(spaceId)),
  );
}

/**
 * Lieux de pratique d'une section, deduits de ses creneaux : chaque lieu
 * n'expose que les espaces ou elle pratique vraiment. C'est ce qui permet a
 * la page judo de ne montrer que la salle d'arts martiaux, et non la piscine
 * du meme centre sportif.
 */
function derivePracticeLocations(
  schedules: ActivitySchedule[],
): ActivityPracticeLocation[] {
  const spaceIds = getSpaceIds(schedules);

  return allLocations
    .map((location) => ({
      ...location,
      spaces: (location.spaces ?? []).filter((space) => spaceIds.has(space.id)),
    }))
    .filter((location) => location.spaces.length > 0);
}

function hydrateActivity(record: ActivityRecord): Activity {
  return {
    ...record,
    locations: derivePracticeLocations(record.schedules),
  };
}

const allActivities = (activities as ActivityRecord[]).map(hydrateActivity);

export function getActivities() {
  return allActivities;
}

export function getActivityBySlug(slug: string) {
  return allActivities.find((activity) => activity.slug === slug);
}

export function getActivitySlugs() {
  return allActivities.map((activity) => activity.slug);
}

export function getLocations() {
  return allLocations;
}

export type InstallationSport = Pick<
  Activity,
  "slug" | "title" | "shortName" | "icon"
>;

export type InstallationSpace = LocationSpace & {
  sports: InstallationSport[];
};

export type Installation = Omit<ActivityLocation, "spaces"> & {
  spaces: InstallationSpace[];
  sports: InstallationSport[];
};

function toSport(activity: Activity): InstallationSport {
  return {
    slug: activity.slug,
    title: activity.title,
    shortName: activity.shortName,
    icon: activity.icon,
  };
}

function sortSports(sports: InstallationSport[]) {
  return sports.toSorted((left, right) =>
    left.title.localeCompare(right.title),
  );
}

/**
 * Index inverse espace -> sports : pour chaque installation du registre, les
 * sports pratiques dans chacun de ses espaces. Le lieu agrege les sports de
 * ses espaces, il ne les declare pas.
 */
export function getInstallations(): Installation[] {
  const sportsBySpaceId = allActivities.reduce((index, activity) => {
    getSpaceIds(activity.schedules).forEach((spaceId) =>
      index.set(spaceId, [...(index.get(spaceId) ?? []), toSport(activity)]),
    );
    return index;
  }, new Map<string, InstallationSport[]>());

  return allLocations.map((location) => {
    const spaces = (location.spaces ?? []).map((space) => ({
      ...space,
      sports: sortSports(sportsBySpaceId.get(space.id) ?? []),
    }));

    return {
      ...location,
      spaces,
      sports: sortSports([
        ...new Map(
          spaces.flatMap((space) =>
            space.sports.map((sport) => [sport.slug, sport] as const),
          ),
        ).values(),
      ]),
    };
  });
}
