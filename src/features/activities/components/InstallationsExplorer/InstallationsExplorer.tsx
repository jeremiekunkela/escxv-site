"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container/Container";
import { EquipmentChips } from "@/features/activities/components/EquipmentChips/EquipmentChips";
import { locationTypeLabels } from "@/features/activities/lib/activityLabels";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import type { Installation } from "@/features/activities/data-access/activities";
import type { LocationType } from "@/features/activities/types/activity";
import { getActivityRoute } from "@/lib/constants/routes";
import styles from "./InstallationsExplorer.module.css";

type InstallationsExplorerProps = {
  installations: Installation[];
};

type TypeFilter = LocationType | "all";

const TYPE_ORDER: LocationType[] = [
  "centre-sportif",
  "gymnase",
  "stade",
  "piscine",
  "salle",
  "exterieur",
];

function matchesQuery(installation: Installation, query: string) {
  const haystack = [
    installation.name,
    installation.address,
    installation.city,
    ...installation.sports.map((sport) => sport.title),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

export function InstallationsExplorer({
  installations,
}: InstallationsExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeType, setActiveType] = useState<TypeFilter>("all");

  const availableTypes = useMemo(
    () =>
      TYPE_ORDER.filter((type) =>
        installations.some((installation) => installation.type === type),
      ),
    [installations],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = installations.filter(
    (installation) =>
      (activeType === "all" || installation.type === activeType) &&
      (normalizedQuery.length === 0 ||
        matchesQuery(installation, normalizedQuery)),
  );

  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.controls}>
          <label className={styles.searchBar}>
            <span className="sr-only">Rechercher une installation</span>
            <Search
              aria-hidden="true"
              className={styles.searchIcon}
              size={20}
            />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Rechercher : gymnase, La Plaine, judo, piscine..."
              className={styles.searchInput}
            />
          </label>

          <div
            className={styles.filters}
            aria-label="Filtrer par type d'installation"
          >
            <button
              type="button"
              aria-pressed={activeType === "all"}
              onClick={() => setActiveType("all")}
              className={
                activeType === "all"
                  ? `${styles.filterButton} ${styles.filterButtonActive}`
                  : styles.filterButton
              }
            >
              Tous
            </button>
            {availableTypes.map((type) => {
              const isActive = activeType === type;

              return (
                <button
                  key={type}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setActiveType(type)}
                  className={
                    isActive
                      ? `${styles.filterButton} ${styles.filterButtonActive}`
                      : styles.filterButton
                  }
                >
                  {locationTypeLabels[type]}
                </button>
              );
            })}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((installation) => {
              const equipments = installation.equipments ?? [];

              return (
                <article
                  id={getActivityLocationAnchorId(installation.id)}
                  key={installation.id}
                  className={
                    installation.image || installation.mapEmbedUrl
                      ? styles.card
                      : `${styles.card} ${styles.cardNoMedia}`
                  }
                >
                  {installation.image ? (
                    <div className={styles.visual}>
                      <Image
                        src={installation.image}
                        alt=""
                        fill
                        sizes="(max-width: 820px) 100vw, 380px"
                        className={styles.image}
                      />
                    </div>
                  ) : installation.mapEmbedUrl ? (
                    <div className={styles.visual}>
                      <iframe
                        src={installation.mapEmbedUrl}
                        title={`Carte - ${installation.name}`}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  ) : null}

                  <div className={styles.body}>
                    <p className={styles.city}>
                      <MapPin aria-hidden="true" size={16} />
                      {installation.city} {installation.postalCode}
                      <span className={styles.typeTag}>
                        {locationTypeLabels[installation.type]}
                      </span>
                    </p>
                    <h2 className={styles.title}>{installation.name}</h2>
                    <p className={styles.address}>
                      {installation.address}, {installation.postalCode}{" "}
                      {installation.city}
                    </p>
                    {installation.description ? (
                      <p className={styles.description}>
                        {installation.description}
                      </p>
                    ) : null}

                    <div className={styles.group}>
                      <p className={styles.groupTitle}>Sports pratiqués ici</p>
                      {installation.sports.length > 0 ? (
                        <ul className={styles.sports}>
                          {installation.sports.map((sport) => (
                            <li key={sport.slug}>
                              <Link
                                href={getActivityRoute(sport.slug)}
                                className={styles.sport}
                              >
                                {sport.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className={styles.empty}>
                          Aucune section ne référence encore ce lieu.
                        </p>
                      )}
                    </div>

                    {equipments.length > 0 ? (
                      <div className={styles.group}>
                        <p className={styles.groupTitle}>Équipement</p>
                        <EquipmentChips equipments={equipments} emphasized />
                      </div>
                    ) : null}

                    {installation.image && installation.mapEmbedUrl ? (
                      <div className={styles.bodyMap}>
                        <iframe
                          src={installation.mapEmbedUrl}
                          title={`Carte - ${installation.name}`}
                          loading="lazy"
                          allowFullScreen
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className={styles.noResult}>
            Aucune installation ne correspond à cette recherche.
          </div>
        )}
      </Container>
    </section>
  );
}
