import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ActivityPictogram } from "@/features/activities/components/ActivityPictogram/ActivityPictogram";
import { getActivityIconName } from "@/features/activities/lib/activityIcons";
import { getActivityHref } from "@/features/activities/lib/activityRoutes";
import type { Activity } from "@/features/activities/types/activity";
import styles from "./ActivityTile.module.css";

type ActivityTileProps = {
  activity: Activity;
};

/**
 * Entrée du repertoire d'activités : une ligne scannable, sans photo ni
 * description. Le detail vit sur la page de l'activité.
 */
export function ActivityTile({ activity }: ActivityTileProps) {
  return (
    <Link
      href={getActivityHref(activity)}
      className={styles.tile}
      title={activity.shortDescription}
    >
      <ActivityPictogram
        iconName={getActivityIconName(activity.slug)}
        size="md"
        className={styles.icon}
      />

      <span className={styles.name}>{activity.title}</span>

      <ChevronRight aria-hidden="true" className={styles.chevron} size={18} />
    </Link>
  );
}
