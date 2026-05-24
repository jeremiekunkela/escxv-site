import type { Activity } from "@/features/activities/types/activity";
import { getActivityRoute } from "@/lib/constants/routes";

export function getActivityHref(activity: Activity) {
  return getActivityRoute(activity.slug);
}

export function getActivityLocationAnchorId(locationId: string) {
  return `lieu-pratique-${locationId}`;
}

export function getActivityLocationAnchorHref(locationId: string) {
  return `#${getActivityLocationAnchorId(locationId)}`;
}
