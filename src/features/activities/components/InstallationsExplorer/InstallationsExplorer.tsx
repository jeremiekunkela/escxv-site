"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import type { CSSProperties } from "react";
import { useState } from "react";
import { ActiveFilters } from "@/components/shared/ActiveFilters/ActiveFilters";
import type { ActiveFilter } from "@/components/shared/ActiveFilters/ActiveFilters";
import { FilterMenu } from "@/components/shared/FilterMenu/FilterMenu";
import type { FilterOption } from "@/components/shared/FilterMenu/FilterMenu";
import { Container } from "@/components/ui/Container/Container";
import {
  collectFilterableSports,
  filterInstallations,
  NO_INSTALLATION_FILTER,
} from "@/features/activities/lib/installationFilters";
import type { InstallationFilters } from "@/features/activities/lib/installationFilters";
import { removeFilterValue, toggleFilterValue } from "@/lib/utils";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import type { Installation } from "@/features/activities/data-access/activities";
import { getActivityRoute } from "@/lib/constants/routes";
import styles from "./InstallationsExplorer.module.css";

type InstallationsExplorerProps = {
  installations: Installation[];
};

type InstallationMedia = {
  src: string;
  label: string;
};

/**
 * Les fiches de lieu sont hautes : une poignee suffit a l'ecran, le decalage
 * se fige donc plus tot que pour les tuiles d'activites.
 *
 * La liste ne porte volontairement aucune cle de rendu, la ou le repertoire
 * des activites en a une pour rejouer sa cascade : ici, remonter la liste
 * rechargerait les treize plans Google a chaque lettre tapee. Seules les
 * fiches qui entrent vraiment s'animent, les autres gardent leur carte.
 */
const CARD_STAGGER_STEP_MS = 45;
const MAX_STAGGERED_CARDS = 6;

const getCardDelay = (index: number) =>
  `${Math.min(index, MAX_STAGGERED_CARDS) * CARD_STAGGER_STEP_MS}ms`;

function collectMedia(
  installation: Installation,
  activeSportSlugs: string[],
): InstallationMedia[] {
  const visibleSpaces = installation.spaces.filter(
    (space) =>
      activeSportSlugs.length === 0 ||
      space.sports.some((sport) => activeSportSlugs.includes(sport.slug)),
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
  const [filters, setFilters] = useState<InstallationFilters>(
    NO_INSTALLATION_FILTER,
  );

  const sportOptions: FilterOption<string>[] = collectFilterableSports(
    installations,
  ).map((sport) => ({ value: sport.slug, label: sport.title }));

  const filtered = filterInstallations(installations, filters);

  const activeFilters: ActiveFilter<"sportSlugs">[] = filters.sportSlugs.map(
    (value) => ({
      key: "sportSlugs" as const,
      value,
      label:
        sportOptions.find((option) => option.value === value)?.label ?? value,
    }),
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
              value={filters.query}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  query: event.target.value,
                }))
              }
              placeholder="Rechercher : gymnase, La Plaine, judo, piscine..."
              className={styles.searchInput}
            />
          </label>

          <div className={styles.toolbar}>
            <div
              className={styles.menus}
              role="group"
              aria-label="Filtrer les lieux"
            >
              <FilterMenu
                label="Sport"
                options={sportOptions}
                selected={filters.sportSlugs}
                onToggle={(value) =>
                  setFilters((current) => ({
                    ...current,
                    sportSlugs: toggleFilterValue(current.sportSlugs, value),
                  }))
                }
                onClear={() =>
                  setFilters((current) => ({ ...current, sportSlugs: [] }))
                }
              />
            </div>

            <p className={styles.resultCount} role="status">
              <span key={filtered.length} className={styles.resultNumber}>
                {filtered.length}
              </span>
              installation{filtered.length > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <div className={styles.activeFilters}>
          <ActiveFilters
            filters={activeFilters}
            onRemove={(key, value) =>
              setFilters((current) => removeFilterValue(current, key, value))
            }
            onClear={() => setFilters(NO_INSTALLATION_FILTER)}
          />
        </div>

        {filtered.length > 0 ? (
          <div className={styles.list}>
            {filtered.map((installation, index) => {
              const media = getDisplayMedia(
                collectMedia(installation, filters.sportSlugs),
                installation,
              );

              return (
                <article
                  id={getActivityLocationAnchorId(installation.id)}
                  key={installation.id}
                  style={{ "--card-delay": getCardDelay(index) } as CSSProperties}
                  className={
                    media.length > 0 || installation.mapEmbedUrl
                      ? styles.card
                      : `${styles.card} ${styles.cardNoMedia}`
                  }
                >
                  <InstallationVisual installation={installation} media={media} />

                  <div className={styles.body}>
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

                    {installation.spaces.length > 1 ? (
                      <div className={styles.group}>
                        <p className={styles.groupTitle}>Espaces de pratique</p>
                        <ul className={styles.spaces}>
                          {installation.spaces.map((space) => (
                            <li key={space.id} className={styles.space}>
                              <p className={styles.spaceLabel}>{space.label}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                                  filters.sportSlugs.includes(sport.slug)
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
              onClick={() => setFilters(NO_INSTALLATION_FILTER)}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </Container>
    </section>
  );
}
