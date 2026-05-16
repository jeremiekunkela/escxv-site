"use client";

import { useMemo, useState } from "react";
import { categoryLabels } from "@/features/activities/lib/activityLabels";
import type {
  Activity,
  ActivityCategory,
  ActivityPublic,
} from "@/features/activities/types/activity";

export type ActivityFilter = "all" | ActivityPublic | ActivityCategory;

export const filterLabels: Record<ActivityFilter, string> = {
  all: "Toutes",
  enfants: "Enfants",
  adolescents: "Adolescents",
  adultes: "Adultes",
  collectif: "Collectif",
  forme: "Forme",
  raquette: "Raquette",
  "athle-running": "Athle & running",
  "arts-martiaux": "Arts martiaux",
  danse: "Danse",
  eau: "Eau",
  escalade: "Escalade",
};

export const visibleActivityFilters: ActivityFilter[] = [
  "all",
  "enfants",
  "adultes",
  "collectif",
  "forme",
  "raquette",
  "athle-running",
];

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function useActivityFilters(activities: Activity[]) {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<ActivityFilter>("all");

  const filteredActivities = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return activities.filter((activity) => {
      const matchesFilter =
        activeFilter === "all"
        || activity.publics.includes(activeFilter as ActivityPublic)
        || activity.category.includes(activeFilter as ActivityCategory);
      const searchableText = normalizeSearch(
        [
          activity.title,
          activity.shortName,
          activity.shortDescription,
          activity.description,
          activity.publics.join(" "),
          activity.tags.join(" "),
          activity.category.map((value) => categoryLabels[value]).join(" "),
        ].join(" "),
      );

      return matchesFilter && searchableText.includes(normalizedQuery);
    });
  }, [activeFilter, activities, query]);

  return {
    activeFilter,
    filteredActivities,
    query,
    setActiveFilter,
    setQuery,
  };
}
