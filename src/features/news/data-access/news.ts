import news from "@/data/news.json";
import type { NewsItem } from "@/features/news/types/news";

const allNews = news as NewsItem[];

function sortByPublishedAtDesc(newsItems: NewsItem[]) {
  return [...newsItems].sort((firstItem, secondItem) => {
    if (firstItem.isPinned !== secondItem.isPinned) {
      return Number(secondItem.isPinned) - Number(firstItem.isPinned);
    }

    return (
      new Date(secondItem.publishedAt).getTime() -
      new Date(firstItem.publishedAt).getTime()
    );
  });
}

export function getPublishedNews() {
  return sortByPublishedAtDesc(
    allNews.filter((newsItem) => newsItem.status === "published"),
  );
}

export function getNewsSlugs() {
  return getPublishedNews().map((newsItem) => newsItem.slug);
}

export function getNewsBySlug(slug: string) {
  return getPublishedNews().find((newsItem) => newsItem.slug === slug) ?? null;
}

export function getGlobalNews() {
  return getPublishedNews().filter((newsItem) => newsItem.activitySlug === null);
}

export function getNewsByActivitySlug(activitySlug: string) {
  return getPublishedNews().filter(
    (newsItem) => newsItem.activitySlug === activitySlug,
  );
}

export function getRelatedNews(currentSlug: string, limit = 3) {
  const currentNews = getNewsBySlug(currentSlug);

  if (!currentNews) {
    return [];
  }

  const otherNews = getPublishedNews().filter(
    (newsItem) => newsItem.slug !== currentSlug,
  );
  const prioritizedNews = otherNews.sort((firstItem, secondItem) => {
    const firstScore =
      Number(firstItem.activitySlug === currentNews.activitySlug) +
      Number(firstItem.type === currentNews.type);
    const secondScore =
      Number(secondItem.activitySlug === currentNews.activitySlug) +
      Number(secondItem.type === currentNews.type);

    return secondScore - firstScore;
  });

  return prioritizedNews.slice(0, limit);
}
