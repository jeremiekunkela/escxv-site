"use client";

import { Search } from "lucide-react";
import { NewsList } from "@/features/news/components/NewsList/NewsList";
import { useNewsFilters } from "@/features/news/hooks/useNewsFilters";
import type { NewsItem } from "@/features/news/types/news";
import styles from "./NewsExplorer.module.css";

type NewsExplorerProps = {
  news: NewsItem[];
  activityLabelsBySlug: Record<string, string>;
  title: string;
};

export function NewsExplorer({
  news,
  activityLabelsBySlug,
  title,
}: NewsExplorerProps) {
  const {
    activityFilter,
    activityOptions,
    availableControls,
    filteredNews,
    hasActiveFilters,
    query,
    setActivityFilter,
    setQuery,
    setSortOrder,
    setYearFilter,
    sortOrder,
    yearOptions,
    yearFilter,
  } = useNewsFilters(news, activityLabelsBySlug);
  const hasAnyControl = Object.values(availableControls).some(Boolean);

  return (
    <NewsList
      news={filteredNews}
      title={title}
      surface="soft"
      controls={
        hasAnyControl ? (
          <div className={styles.controls}>
            {availableControls.search ? (
              <div className={styles.controlsGrid}>
                <label className={styles.searchBar}>
                  <span className="sr-only">Rechercher une actualité</span>
                  <Search aria-hidden="true" className={styles.searchIcon} size={20} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Rechercher une actualité, une section, un sujet..."
                    className={styles.searchInput}
                  />
                </label>
              </div>
            ) : null}

            <div className={styles.selectGrid}>
              {availableControls.section ? (
                <label className={styles.selectField}>
                  <span className={styles.fieldLabel}>Section</span>
                  <select
                    value={activityFilter}
                    onChange={(event) => setActivityFilter(event.target.value)}
                    className={styles.selectInput}
                  >
                    {activityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {availableControls.year ? (
                <label className={styles.selectField}>
                  <span className={styles.fieldLabel}>Année</span>
                  <select
                    value={yearFilter}
                    onChange={(event) => setYearFilter(event.target.value)}
                    className={styles.selectInput}
                  >
                    {yearOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              ) : null}

              {availableControls.sort ? (
                <label className={styles.selectField}>
                  <span className={styles.fieldLabel}>Trier</span>
                  <select
                    value={sortOrder}
                    onChange={(event) => setSortOrder(event.target.value as "recent" | "oldest")}
                    className={styles.selectInput}
                  >
                    <option value="recent">Plus récentes</option>
                    <option value="oldest">Plus anciennes</option>
                  </select>
                </label>
              ) : null}

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    setActivityFilter("all");
                    setYearFilter("all");
                    setSortOrder("recent");
                  }}
                  className={styles.resetButton}
                >
                  Réinitialiser
                </button>
              ) : null}
            </div>
          </div>
        ) : null
      }
      summary={
        hasAnyControl ? (
          <>
            <p className={styles.count}>
              {filteredNews.length} actualité{filteredNews.length > 1 ? "s" : ""} affichée
              {filteredNews.length > 1 ? "s" : ""}
            </p>
            <p className={styles.total}>
              {news.length} actualité{news.length > 1 ? "s" : ""} publiée
              {news.length > 1 ? "s" : ""}
            </p>
          </>
        ) : null
      }
      emptyState={
        <div className={styles.emptyState}>
          Aucune actualité ne correspond à ces critères.
        </div>
      }
    />
  );
}
