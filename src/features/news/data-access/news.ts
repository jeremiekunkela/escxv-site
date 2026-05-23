import news from "@/data/news.json";
import type { NewsItem } from "@/features/news/types/news";

const allNews = news as NewsItem[];

function sortByPublishedAtDesc(newsItems: NewsItem[]) {
  return [...newsItems].sort(
    (firstItem, secondItem) =>
      Number(secondItem.isPinned) - Number(firstItem.isPinned)
      || new Date(secondItem.publishedAt).getTime()
        - new Date(firstItem.publishedAt).getTime(),
  );
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
  const scoreRelatedness = (newsItem: NewsItem) =>
    Number(newsItem.activitySlug === currentNews?.activitySlug)
    + Number(newsItem.type === currentNews?.type);

  return currentNews
    ? getPublishedNews()
        .filter((newsItem) => newsItem.slug !== currentSlug)
        .sort(
          (firstItem, secondItem) =>
            scoreRelatedness(secondItem) - scoreRelatedness(firstItem),
        )
        .slice(0, limit)
    : [];
}
