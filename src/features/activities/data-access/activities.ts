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
