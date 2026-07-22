"use client";

import { useState } from "react";
import { ActivityTile } from "@/features/activities/components/ActivityTile/ActivityTile";
import type {
  Activity,
  ActivityPublic,
} from "@/features/activities/types/activity";
import styles from "./ActivityDirectory.module.css";

type ActivityDirectoryProps = {
  activities: Activity[];
};

type ActivityPublicFilter = ActivityPublic | "all";

const publicFilterOptions = [
  { value: "all", label: "Tous" },
  { value: "enfants", label: "Enfants" },
  { value: "adolescents", label: "Jeunes" },
  { value: "adultes", label: "Adultes" },
] satisfies { value: ActivityPublicFilter; label: string }[];

const byTitle = (left: Activity, right: Activity) =>
  left.title.localeCompare(right.title, "fr");

/** Répertoire à plat : toutes les activités visibles d'un seul coup d'oeil. */
export function ActivityDirectory({ activities }: ActivityDirectoryProps) {
  const [activePublic, setActivePublic] = useState<ActivityPublicFilter>("all");
  const sortedActivities = activities.toSorted(byTitle);
  const filteredActivities =
    activePublic === "all"
      ? sortedActivities
      : sortedActivities.filter((activity) =>
          activity.publics.includes(activePublic),
        );

  return (
    <div className={styles.directory}>
      <div className={styles.filters} aria-label="Filtrer par âge">
        {publicFilterOptions.map((filterOption) => {
          const isActive = activePublic === filterOption.value;

          return (
            <button
              key={filterOption.value}
              type="button"
              aria-pressed={isActive}
              className={
                isActive
                  ? `${styles.filterButton} ${styles.filterButtonActive}`
                  : styles.filterButton
              }
              onClick={() => setActivePublic(filterOption.value)}
            >
              {filterOption.label}
            </button>
          );
        })}
      </div>

      <ul className={styles.tiles}>
        {filteredActivities.map((activity) => (
          <li key={activity.slug}>
            <ActivityTile activity={activity} />
          </li>
        ))}
      </ul>
    </div>
  );
}
