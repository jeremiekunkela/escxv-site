import activities from "@/data/activities.json";
import locations from "@/data/locations.json";
import type {
  Activity,
  ActivityLocation,
  ActivityRecord,
} from "@/features/activities/types/activity";

const locationsById = new Map(
  (locations as ActivityLocation[]).map((location) => [location.id, location]),
);

function hydrateActivity(record: ActivityRecord): Activity {
  const { locationIds, ...activity } = record;
  return {
    ...activity,
    locations: locationIds
      .map((id) => locationsById.get(id))
      .filter((location): location is ActivityLocation => Boolean(location)),
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
  return locations as ActivityLocation[];
}

export type InstallationSport = Pick<
  Activity,
  "slug" | "title" | "shortName" | "icon"
>;

export type Installation = ActivityLocation & {
  sports: InstallationSport[];
};

/**
 * Index inverse lieu -> sports : pour chaque installation du registre,
 * la liste des activités qui s'y pratiquent (calculée depuis les locationIds).
 */
export function getInstallations(): Installation[] {
  return (locations as ActivityLocation[]).map((location) => ({
    ...location,
    sports: allActivities
      .filter((activity) =>
        activity.locations.some(
          (activityLocation) => activityLocation.id === location.id,
        ),
      )
      .map((activity) => ({
        slug: activity.slug,
        title: activity.title,
        shortName: activity.shortName,
        icon: activity.icon,
      }))
      .sort((left, right) => left.title.localeCompare(right.title)),
  }));
}
