import activities from "@/data/activities.json";
import type { Activity } from "@/features/activities/types/activity";

const allActivities = activities as Activity[];

export function getActivities() {
  return allActivities;
}

export function getActivityBySlug(slug: string) {
  return allActivities.find((activity) => activity.slug === slug);
}

export function getActivitySlugs() {
  return allActivities.map((activity) => activity.slug);
}
