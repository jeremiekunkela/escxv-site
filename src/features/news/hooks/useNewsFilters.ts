"use client";

import { useMemo, useState } from "react";
import type { NewsItem } from "@/features/news/types/news";

export type NewsSortOrder = "recent" | "oldest";

export type NewsOption<T extends string> = {
  value: T;
  label: string;
};

function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function getSectionOptions(
  news: NewsItem[],
  activityLabelsBySlug: Record<string, string>,
) {
  const sectionOptions = Array.from(
    new Set(
      news
        .map((newsItem) => newsItem.activitySlug)
        .filter((activitySlug): activitySlug is string => Boolean(activitySlug)),
    ),
  ).map((activitySlug) => ({
    value: activitySlug,
    label: activityLabelsBySlug[activitySlug] ?? activitySlug,
  }));

  return [
    { value: "all", label: "Toutes les sections" },
    ...sectionOptions,
  ];
}

function getYearOptions(news: NewsItem[]) {
  const years = Array.from(
    new Set(news.map((newsItem) => new Date(newsItem.publishedAt).getFullYear())),
  ).sort((firstYear, secondYear) => secondYear - firstYear);

  return [
    { value: "all", label: "Toutes les années" },
    ...years.map((year) => ({ value: String(year), label: String(year) })),
  ];
}

/**
 * En deca de ce nombre d'articles, parcourir la liste va plus vite que taper
 * une recherche : le champ n'est alors qu'un meuble.
 */
const SEARCH_MIN_NEWS_COUNT = 6;

/**
 * Un filtre par section ne sert que s'il peut reduire la liste : il faut deux
 * sections distinctes, ou une section et des articles qui n'en relevent pas.
 * Avec un seul article rattache a rien, il n'a aucune option a proposer.
 */
function canFilterBySection(news: NewsItem[]) {
  const slugs = new Set(
    news
      .map((newsItem) => newsItem.activitySlug)
      .filter((activitySlug): activitySlug is string => Boolean(activitySlug)),
  );
  const taggedCount = news.filter((newsItem) => newsItem.activitySlug).length;

  return slugs.size > 1 || (slugs.size === 1 && taggedCount < news.length);
}

function canFilterByYear(news: NewsItem[]) {
  return (
    new Set(news.map((newsItem) => new Date(newsItem.publishedAt).getFullYear()))
      .size > 1
  );
}

function getBlockSearchText(newsItem: NewsItem) {
  const blockSearchTextByType = {
    heading: (block) => [block.title, block.subtitle].filter(Boolean).join(" "),
    image: (block) => [block.alt, block.caption].filter(Boolean).join(" "),
    text: (block) => block.paragraphs.join(" "),
  } satisfies {
    [Type in NonNullable<NewsItem["blocks"]>[number]["type"]]: (
      block: Extract<NonNullable<NewsItem["blocks"]>[number], { type: Type }>,
    ) => string;
  };

  return (newsItem.blocks ?? [])
    .map((block) => blockSearchTextByType[block.type](block as never))
    .join(" ");
}

export function useNewsFilters(
  news: NewsItem[],
  activityLabelsBySlug: Record<string, string>,
) {
  const [query, setQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<NewsSortOrder>("recent");

  const activityOptions = useMemo(
    () => getSectionOptions(news, activityLabelsBySlug),
    [activityLabelsBySlug, news],
  );
  const yearOptions = useMemo(() => getYearOptions(news), [news]);
  /**
   * Un controle qui ne peut pas changer le resultat est du decor : il donne a
   * la page l'air d'un outil sous-employe et souligne le vide qu'il pretend
   * trier. Chacun n'apparait donc que lorsqu'il discrimine reellement, et
   * revient de lui-meme des que les publications le justifient.
   */
  const availableControls = useMemo(
    () => ({
      search: news.length >= SEARCH_MIN_NEWS_COUNT,
      section: canFilterBySection(news),
      year: canFilterByYear(news),
      sort: news.length > 1,
    }),
    [news],
  );

  const filteredNews = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);

    return news
      .filter((newsItem) => {
        const matchesActivity =
          activityFilter === "all" || newsItem.activitySlug === activityFilter;
        const matchesYear =
          yearFilter === "all"
          || String(new Date(newsItem.publishedAt).getFullYear()) === yearFilter;

        const activityLabel = newsItem.activitySlug
          ? activityLabelsBySlug[newsItem.activitySlug] ?? newsItem.activitySlug
          : "club";

        const searchableText = normalizeSearch(
          [
            newsItem.title,
            newsItem.subtitle,
            newsItem.excerpt,
            newsItem.content,
            newsItem.summaryPoints?.join(" "),
            getBlockSearchText(newsItem),
            activityLabel,
            newsItem.isPinned ? "a la une" : "",
            String(new Date(newsItem.publishedAt).getFullYear()),
          ].join(" "),
        );

        return (
          matchesActivity
          && matchesYear
          && searchableText.includes(normalizedQuery)
        );
      })
      .sort((firstNewsItem, secondNewsItem) => {
        const firstDate = new Date(firstNewsItem.publishedAt).getTime();
        const secondDate = new Date(secondNewsItem.publishedAt).getTime();

        return sortOrder === "recent" ? secondDate - firstDate : firstDate - secondDate;
      });
  }, [
    activityFilter,
    activityLabelsBySlug,
    news,
    query,
    sortOrder,
    yearFilter,
  ]);

  return {
    activityFilter,
    activityOptions,
    availableControls,
    filteredNews,
    query,
    setActivityFilter,
    setQuery,
    setSortOrder,
    setYearFilter,
    sortOrder,
    yearOptions,
    yearFilter,
    hasActiveFilters:
      query.length > 0
      || activityFilter !== "all"
      || yearFilter !== "all"
      || sortOrder !== "recent",
  };
}
