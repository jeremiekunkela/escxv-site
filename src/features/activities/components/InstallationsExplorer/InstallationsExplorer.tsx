"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Container } from "@/components/ui/Container/Container";
import { locationTypeLabels } from "@/features/activities/lib/activityLabels";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import type {
  Installation,
  InstallationSport,
} from "@/features/activities/data-access/activities";
import { getActivityRoute } from "@/lib/constants/routes";
import styles from "./InstallationsExplorer.module.css";

type InstallationsExplorerProps = {
  installations: Installation[];
};

type SportFilter = InstallationSport["slug"] | "all";

type InstallationMedia = {
  src: string;
  label: string;
};

/**
 * La recherche couvre la description et le type : un lieu
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
    ...installation.sports.map((sport) => sport.title),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

/**
 * Registre des sports proposés au filtre : uniquement ceux rattachés à au moins
 * une installation, dédoublonnés et triés par titre.
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

function collectMedia(
  installation: Installation,
  activeSport: SportFilter,
): InstallationMedia[] {
  const visibleSpaces = installation.spaces.filter(
    (space) =>
      activeSport === "all" ||
      space.sports.some((sport) => sport.slug === activeSport),
  );

  const spaceMedia = visibleSpaces.flatMap((space) =>
    space.image ? [{ src: space.image, label: space.label }] : [],
  );

  const locationMedia = installation.image
    ? [{ src: installation.image, label: installation.name }]
    : [];

  return [
    ...new Map(
      [...spaceMedia, ...locationMedia].map((media) => [media.src, media]),
    ).values(),
  ];
}

function getDisplayMedia(media: InstallationMedia[], installation: Installation) {
  const isMultiSportInstallation = installation.sports.length > 1;

  return isMultiSportInstallation && media.length === 1 ? [] : media;
}

function InstallationVisual({
  installation,
  media,
}: {
  installation: Installation;
  media: InstallationMedia[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMedia = media[activeIndex % media.length];
  const hasCarousel = media.length > 1;

  return media.length > 0 ? (
    <div className={styles.visual}>
      <Image
        src={activeMedia.src}
        alt=""
        fill
        sizes="(max-width: 820px) 100vw, 380px"
        className={styles.image}
      />
      <p className={styles.visualCaption}>{activeMedia.label}</p>
      {hasCarousel ? (
        <div className={styles.carouselControls}>
          <button
            type="button"
            className={styles.carouselButton}
            aria-label={`Voir l'image précédente - ${installation.name}`}
            onClick={() =>
              setActiveIndex((index) => (index + media.length - 1) % media.length)
            }
          >
            <ChevronLeft aria-hidden="true" size={18} />
          </button>
          <div
            className={styles.carouselDots}
            aria-label={`Images de ${installation.name}`}
          >
            {media.map((item, index) => (
              <button
                key={item.src}
                type="button"
                className={
                  item.src === activeMedia.src
                    ? `${styles.carouselDot} ${styles.carouselDotActive}`
                    : styles.carouselDot
                }
                aria-label={`Afficher ${item.label}`}
                aria-current={item.src === activeMedia.src ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              />
            ))}
          </div>
          <button
            type="button"
            className={styles.carouselButton}
            aria-label={`Voir l'image suivante - ${installation.name}`}
            onClick={() =>
              setActiveIndex((index) => (index + 1) % media.length)
            }
          >
            <ChevronRight aria-hidden="true" size={18} />
          </button>
        </div>
      ) : null}
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
  ) : null;
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
              const media = getDisplayMedia(
                collectMedia(installation, activeSport),
                installation,
              );

              return (
                <article
                  id={getActivityLocationAnchorId(installation.id)}
                  key={installation.id}
                  className={
                    media.length > 0 || installation.mapEmbedUrl
                      ? styles.card
                      : `${styles.card} ${styles.cardNoMedia}`
                  }
                >
                  <InstallationVisual installation={installation} media={media} />

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

                    {media.length > 0 && installation.mapEmbedUrl ? (
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
