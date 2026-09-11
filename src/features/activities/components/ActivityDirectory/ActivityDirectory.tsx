"use client";

import type { CSSProperties } from "react";
import { useState } from "react";
import { ActivityTile } from "@/features/activities/components/ActivityTile/ActivityTile";
import { ActiveFilters } from "@/components/shared/ActiveFilters/ActiveFilters";
import type { ActiveFilter } from "@/components/shared/ActiveFilters/ActiveFilters";
import { FilterMenu } from "@/components/shared/FilterMenu/FilterMenu";
import type { FilterOption } from "@/components/shared/FilterMenu/FilterMenu";
import { publicLabels } from "@/features/activities/lib/activityLabels";
import {
  collectFilterableDays,
  collectFilterableLocations,
  filterActivities,
  NO_ACTIVITY_FILTER,
  sortActivitiesByTitle,
} from "@/features/activities/lib/activityFilters";
import type {
  ActivityFilterKey,
  ActivityFilters,
} from "@/features/activities/lib/activityFilters";
import { formatDay } from "@/features/activities/lib/days";
import { removeFilterValue, toggleFilterValue } from "@/lib/utils";
import type {
  Activity,
  ActivityPublic,
  DayOfWeek,
} from "@/features/activities/types/activity";
import styles from "./ActivityDirectory.module.css";

type ActivityDirectoryProps = {
  activities: Activity[];
};

const publicOptions: FilterOption<ActivityPublic>[] = [
  { value: "enfants", label: publicLabels.enfants },
  { value: "adolescents", label: publicLabels.adolescents },
  { value: "adultes", label: publicLabels.adultes },
];

/**
 * Au-dela de la douzieme tuile, la cascade se met a durer plus longtemps
 * qu'elle n'impressionne : le decalage se fige, les dernieres arrivent avec
 * l'avant-derniere.
 */
const TILE_STAGGER_STEP_MS = 26;
const MAX_STAGGERED_TILES = 12;

const getTileDelay = (index: number) =>
  `${Math.min(index, MAX_STAGGERED_TILES) * TILE_STAGGER_STEP_MS}ms`;

/**
 * Repertoire a plat : toutes les activites visibles d'un seul coup d'oeil,
 * qu'on affine par age, par jour et par lieu. Les sections demandaient les
 * deux derniers criteres — « toutes les activites du mercredi », « ce qui se
 * pratique a tel stade » —, questions auxquelles ni cette liste ni les pages
 * de section ne savaient repondre.
 */
export function ActivityDirectory({ activities }: ActivityDirectoryProps) {
  const [filters, setFilters] = useState<ActivityFilters>(NO_ACTIVITY_FILTER);

  const dayOptions: FilterOption<DayOfWeek>[] = collectFilterableDays(
    activities,
  ).map((day) => ({ value: day, label: formatDay(day) }));

  const locationOptions: FilterOption<string>[] =
    collectFilterableLocations(activities).map((location) => ({
      value: location.id,
      label: location.name,
    }));

  const results = sortActivitiesByTitle(filterActivities(activities, filters));

  const activeFilters: ActiveFilter<ActivityFilterKey>[] = [
    ...filters.publics.map((value) => ({
      key: "publics" as ActivityFilterKey,
      value,
      label: publicLabels[value],
    })),
    ...filters.days.map((value) => ({
      key: "days" as ActivityFilterKey,
      value,
      label: formatDay(value),
    })),
    ...filters.locationIds.map((value) => ({
      key: "locationIds" as ActivityFilterKey,
      value,
      label:
        locationOptions.find((option) => option.value === value)?.label ?? value,
    })),
  ];

  /**
   * Cle de la liste : elle change des qu'un critere bouge, ce qui remonte les
   * tuiles et rejoue leur cascade. Sans elle, React reutilise les elements en
   * place et le resultat apparaitrait d'un bloc.
   */
  const resultsKey = activeFilters
    .map((filter) => `${filter.key}:${filter.value}`)
    .join("|");

  return (
    <div className={styles.directory}>
      <div className={styles.toolbar}>
        <div
          className={styles.menus}
          role="group"
          aria-label="Filtrer les activités"
        >
          <FilterMenu
            label="Âge"
            options={publicOptions}
            selected={filters.publics}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                publics: toggleFilterValue(current.publics, value),
              }))
            }
            onClear={() => setFilters((current) => ({ ...current, publics: [] }))}
          />
          <FilterMenu
            label="Jour"
            options={dayOptions}
            selected={filters.days}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                days: toggleFilterValue(current.days, value),
              }))
            }
            onClear={() => setFilters((current) => ({ ...current, days: [] }))}
          />
          <FilterMenu
            label="Lieu"
            options={locationOptions}
            selected={filters.locationIds}
            onToggle={(value) =>
              setFilters((current) => ({
                ...current,
                locationIds: toggleFilterValue(current.locationIds, value),
              }))
            }
            onClear={() =>
              setFilters((current) => ({ ...current, locationIds: [] }))
            }
          />
        </div>

        <p className={styles.resultCount} role="status">
          <span key={results.length} className={styles.resultNumber}>
            {results.length}
          </span>
          activité{results.length > 1 ? "s" : ""}
        </p>
      </div>

      <ActiveFilters
        filters={activeFilters}
        onRemove={(key, value) =>
          setFilters((current) => removeFilterValue(current, key, value))
        }
        onClear={() => setFilters(NO_ACTIVITY_FILTER)}
      />

      {results.length > 0 ? (
        <ul key={resultsKey} className={styles.tiles}>
          {results.map((activity, index) => (
            <li
              key={activity.slug}
              style={{ "--tile-delay": getTileDelay(index) } as CSSProperties}
            >
              <ActivityTile activity={activity} />
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.noResult}>
          Aucune activité ne réunit ces critères. Décochez un filtre pour
          élargir la recherche.
        </p>
      )}
    </div>
  );
}
