import { ActivityTile } from "@/features/activities/components/ActivityTile/ActivityTile";
import type { Activity } from "@/features/activities/types/activity";
import styles from "./ActivityDirectory.module.css";

type ActivityDirectoryProps = {
  activities: Activity[];
};

const byTitle = (left: Activity, right: Activity) =>
  left.title.localeCompare(right.title, "fr");

/** Repertoire a plat : toutes les activites visibles d'un seul coup d'oeil. */
export function ActivityDirectory({ activities }: ActivityDirectoryProps) {
  return (
    <ul className={styles.tiles}>
      {activities.toSorted(byTitle).map((activity) => (
        <li key={activity.slug}>
          <ActivityTile activity={activity} />
        </li>
      ))}
    </ul>
  );
}
