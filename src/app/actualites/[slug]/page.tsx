import { NewsArticlePage } from "@/features/news/components/NewsArticlePage/NewsArticlePage";
import {
    getNewsBySlug,
    getNewsSlugs,
    getRelatedNews,
} from "@/features/news/data-access/news";
import type { Metadata } from "next";
import { getNewsRoute, routes } from "@/lib/constants/routes";
import { JsonLd } from "@/components/shared/JsonLd/JsonLd";
import { getClubInfo } from "@/features/club/data-access/club";
import {
  buildBreadcrumbSchema,
  buildNewsArticleSchema,
} from "@/lib/seo/structuredData";
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

  const description = newsItem.seoDescription ?? newsItem.excerpt;

  return {
    title: newsItem.title,
    description,
    alternates: { canonical: getNewsRoute(newsItem.slug) },
    openGraph: {
      type: "article",
      url: getNewsRoute(newsItem.slug),
      title: newsItem.title,
      description,
      publishedTime: newsItem.publishedAt,
      images: newsItem.coverImage
        ? [{ url: newsItem.coverImage, alt: newsItem.coverImageAlt ?? "" }]
        : undefined,
    },
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

  const club = getClubInfo();
  const path = getNewsRoute(newsItem.slug);

  return (
    <>
      <JsonLd
        data={buildNewsArticleSchema({
          club,
          title: newsItem.title,
          description: newsItem.seoDescription ?? newsItem.excerpt,
          path,
          publishedAt: newsItem.publishedAt,
          image: newsItem.coverImage,
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: club.shortName, path: routes.home },
          { name: "Actualités", path: routes.news },
          { name: newsItem.title, path },
        ])}
      />
      <NewsArticlePage
        newsItem={newsItem}
        relatedNews={getRelatedNews(newsItem.slug)}
      />
    </>
  );
}
