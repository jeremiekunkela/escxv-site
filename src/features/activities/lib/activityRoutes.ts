import type { Activity } from "@/features/activities/types/activity";
import { getActivityRoute } from "@/lib/constants/routes";

export function getActivityHref(activity: Activity) {
  return getActivityRoute(activity.slug);
}
