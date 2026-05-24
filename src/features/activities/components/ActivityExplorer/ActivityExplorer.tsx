"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Container } from "@/components/ui/Container/Container";
import { categoryLabels } from "@/features/activities/lib/activityLabels";
import { getActivityHref } from "@/features/activities/lib/activityRoutes";
import {
  filterLabels,
  useActivityFilters,
  visibleActivityFilters,
} from "@/features/activities/hooks/useActivityFilters";
import { formatPublicLabel } from "@/lib/utils";
import type { Activity } from "@/features/activities/types/activity";
import styles from "./ActivityExplorer.module.css";

type ActivityExplorerProps = {
  activities: Activity[];
  eyebrow?: string;
  title: string;
  subtitle: string;
};

type ActivityExplorerCardProps = {
  activity: Activity;
};

function ActivityExplorerCard({ activity }: ActivityExplorerCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.media}>
        <Image
          src={activity.image}
          alt=""
          fill
          sizes="(min-width: 1180px) 33vw, (min-width: 768px) 50vw, 100vw"
          className={styles.cardImage}
        />
        <div className={styles.mediaOverlay} />
        <div className={styles.mediaText}>
          <p className={styles.category}>
            {activity.category.map((value) => categoryLabels[value]).join(" - ")}
          </p>
          <h3 className={styles.cardTitle}>{activity.title}</h3>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.ageGroups}>
          {activity.publics.map((publicItem) => (
            <Badge key={publicItem}>{formatPublicLabel(publicItem)}</Badge>
          ))}
        </div>
        <p className={styles.summary}>{activity.shortDescription}</p>
        <p className={styles.audience}>{activity.description}</p>
        <div className={styles.cardFooter}>
          <Link href={getActivityHref(activity)} className={styles.cardLink}>
            Voir la page
            <ArrowUpRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ActivityExplorer({
  activities,
  eyebrow,
  title,
  subtitle,
}: ActivityExplorerProps) {
  const {
    activeFilter,
    filteredActivities,
    query,
    setActiveFilter,
    setQuery,
  } = useActivityFilters(activities);

  return (
    <section id="activities" className={styles.section}>
      <Container>
        <div className={styles.header}>
          <div>
            <p className={styles.eyebrow}>{eyebrow ?? "Activites"}</p>
            <h2 className={styles.title}>{title}</h2>
          </div>
          <p className={styles.intro}>{subtitle}</p>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlsGrid}>
            <label className={styles.searchBar}>
              <span className="sr-only">Rechercher une activite</span>
              <Search aria-hidden="true" className={styles.searchIcon} size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher: foot, yoga, enfants, raquette..."
                className={styles.searchInput}
              />
            </label>

            <div className={styles.filters} aria-label="Filtres d'activites">
              {visibleActivityFilters.map((filter) => {
                const isActive = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveFilter(filter)}
                    className={
                      isActive
                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                        : styles.filterButton
                    }
                  >
                    {filterLabels[filter]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className={styles.countRow}>
          <p className={styles.count}>
            {filteredActivities.length} activite
            {filteredActivities.length > 1 ? "s" : ""} affichee
            {filteredActivities.length > 1 ? "s" : ""}
          </p>
          <p className={styles.total}>{activities.length} activites ESC XV</p>
        </div>

        {filteredActivities.length > 0 ? (
          <div className={styles.grid}>
            {filteredActivities.map((activity) => (
              <ActivityExplorerCard key={activity.slug} activity={activity} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            Aucune activite ne correspond a cette recherche.
          </div>
        )}
      </Container>
    </section>
  );
}
