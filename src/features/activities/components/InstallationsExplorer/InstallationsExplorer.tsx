"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container/Container";
import { EquipmentChips } from "@/features/activities/components/EquipmentChips/EquipmentChips";
import { locationTypeLabels } from "@/features/activities/lib/activityLabels";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import type {
  Installation,
  InstallationSport,
} from "@/features/activities/data-access/activities";
import type { LocationEquipment } from "@/features/activities/types/activity";
import { getActivityRoute } from "@/lib/constants/routes";
import styles from "./InstallationsExplorer.module.css";

type InstallationsExplorerProps = {
  installations: Installation[];
};

type SportFilter = InstallationSport["slug"] | "all";

/**
 * La recherche couvre aussi l'equipement, la description et le type : un lieu
 * polyvalent (une piscine dans un centre sportif) doit remonter sur "piscine".
 */
function matchesQuery(installation: Installation, query: string) {
  const haystack = [
    installation.name,
    installation.address,
    installation.city,
    installation.postalCode,
    locationTypeLabels[installation.type],
    installation.description ?? "",
    ...(installation.equipments ?? []).map((equipment) => equipment.label),
    ...installation.sports.map((sport) => sport.title),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

/**
 * Registre des sports proposes au filtre : uniquement ceux rattaches a au moins
 * une installation, dedoublonnes et tries par titre.
 */
function collectSports(installations: Installation[]): InstallationSport[] {
  const bySlug = new Map(
    installations.flatMap((installation) =>
      installation.sports.map((sport) => [sport.slug, sport] as const),
    ),
  );

  return [...bySlug.values()].toSorted((left, right) =>
    left.title.localeCompare(right.title),
  );
}

/**
 * Quand un sport est filtre, son equipement dedie passe en tete de la carte.
 */
function orderEquipments(
  equipments: LocationEquipment[],
  activeSport: SportFilter,
) {
  return activeSport === "all"
    ? equipments
    : equipments.toSorted(
        (left, right) =>
          Number(right.relatedActivitySlugs?.includes(activeSport) ?? false) -
          Number(left.relatedActivitySlugs?.includes(activeSport) ?? false),
      );
}

export function InstallationsExplorer({
  installations,
}: InstallationsExplorerProps) {
  const [query, setQuery] = useState("");
  const [activeSport, setActiveSport] = useState<SportFilter>("all");

  const availableSports = useMemo(
    () => collectSports(installations),
    [installations],
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filtered = installations.filter(
    (installation) =>
      (activeSport === "all" ||
        installation.sports.some((sport) => sport.slug === activeSport)) &&
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

          <div className={styles.filterGroup}>
            <p className={styles.filterLabel} id="sport-filter-label">
              Filtrer par sport
            </p>
            <div className={styles.filters} aria-labelledby="sport-filter-label">
              <button
                type="button"
                aria-pressed={activeSport === "all"}
                onClick={() => setActiveSport("all")}
                className={
                  activeSport === "all"
                    ? `${styles.filterButton} ${styles.filterButtonActive}`
                    : styles.filterButton
                }
              >
                Tous les sports
              </button>
              {availableSports.map((sport) => {
                const isActive = activeSport === sport.slug;

                return (
                  <button
                    key={sport.slug}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveSport(sport.slug)}
                    className={
                      isActive
                        ? `${styles.filterButton} ${styles.filterButtonActive}`
                        : styles.filterButton
                    }
                  >
                    {sport.title}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className={styles.resultCount} role="status">
          {filtered.length} installation{filtered.length > 1 ? "s" : ""}
        </p>

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((installation) => {
              const equipments = orderEquipments(
                installation.equipments ?? [],
                activeSport,
              );

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
                                className={
                                  sport.slug === activeSport
                                    ? `${styles.sport} ${styles.sportActive}`
                                    : styles.sport
                                }
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
            <p className={styles.noResultText}>
              Aucune installation ne correspond à cette recherche.
            </p>
            <button
              type="button"
              className={styles.resetButton}
              onClick={() => {
                setQuery("");
                setActiveSport("all");
              }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
