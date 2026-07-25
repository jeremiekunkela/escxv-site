import { NewsArticlePage } from "@/features/news/components/NewsArticlePage/NewsArticlePage";
import {
    getNewsBySlug,
    getNewsSlugs,
    getRelatedNews,
} from "@/features/news/data-access/news";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type NewsArticleRouteProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getNewsSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsArticleRouteProps): Promise<Metadata> {
  const { slug } = await params;
  const newsItem = getNewsBySlug(slug);

  if (!newsItem) {
    return {
      title: "actualité introuvable",
    };
  }

  return {
    title: newsItem.title,
    description: newsItem.seoDescription ?? newsItem.excerpt,
  };
}

export default async function NewsArticleRoute({
  params,
}: NewsArticleRouteProps) {
  const { slug } = await params;
  const newsItem = getNewsBySlug(slug);

  if (!newsItem) {
    notFound();
  }

  return (
    <NewsArticlePage
      newsItem={newsItem}
      relatedNews={getRelatedNews(newsItem.slug)}
    />
  );
}
