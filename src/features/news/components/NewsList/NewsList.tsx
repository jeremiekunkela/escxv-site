import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { NewsCarousel } from "@/features/news/components/NewsList/NewsCarousel";
import {
  getActivityRoute,
  getNewsRoute,
  routes,
} from "@/lib/constants/routes";
import type { NewsItem } from "@/features/news/types/news";
import styles from "./NewsList.module.css";

type NewsListProps = {
  news: NewsItem[];
  eyebrow?: string;
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  surface?: "plain" | "soft";
  presentation?: "grid" | "carousel";
  carouselLayout?: "multi" | "single";
  showActivityLink?: boolean;
  controls?: ReactNode;
  summary?: ReactNode;
  emptyState?: ReactNode;
};

type NewsCardProps = {
  newsItem: NewsItem;
  showActivityLink: boolean;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatNewsDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getNewsScopeLabel(newsItem: NewsItem) {
  return newsItem.activitySlug ? "Section" : "Club";
}

function NewsCard({ newsItem, showActivityLink }: NewsCardProps) {
  return (
    <article className={styles.card} data-news-card>
      {newsItem.coverImage ? (
        <div className={styles.media}>
          <Image
            src={newsItem.coverImage}
            alt=""
            fill
            sizes="(min-width: 1180px) 33vw, (min-width: 768px) 50vw, 100vw"
            className={styles.image}
          />
        </div>
      ) : (
        <div className={styles.placeholder}>
          <span>ESC XV</span>
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.meta}>
          <time dateTime={newsItem.publishedAt}>
            {formatNewsDate(newsItem.publishedAt)}
          </time>
          <Badge variant={newsItem.activitySlug ? "brand" : "neutral"}>
            {getNewsScopeLabel(newsItem)}
          </Badge>
          {newsItem.isPinned ? <Badge variant="brand">À la une</Badge> : null}
          {newsItem.readingTime ? (
            <span className={styles.readingTime}>{newsItem.readingTime}</span>
          ) : null}
        </div>

        <h3 className={styles.cardTitle}>{newsItem.title}</h3>
        {newsItem.subtitle ? (
          <p className={styles.subtitle}>{newsItem.subtitle}</p>
        ) : null}
        <p className={styles.excerpt}>{newsItem.excerpt}</p>

        <div className={styles.actions}>
          <Button
            href={getNewsRoute(newsItem.slug)}
            variant="secondary"
            className={styles.cardButton}
          >
            En savoir plus
          </Button>

          {showActivityLink && newsItem.activitySlug ? (
            <Link
              href={getActivityRoute(newsItem.activitySlug)}
              className={styles.inlineLink}
            >
              Voir la section liee
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export function NewsList({
  news,
  eyebrow = "Actualités",
  title,
  subtitle,
  ctaLabel,
  surface = "plain",
  presentation = "grid",
  carouselLayout = "multi",
  showActivityLink = true,
  controls,
  summary,
  emptyState,
}: NewsListProps) {
  const shouldUseCarousel = presentation === "carousel" && news.length > 3;

  if (news.length === 0 && !emptyState) {
    return null;
  }

  const newsCards = news.map((newsItem) => (
    <NewsCard
      key={newsItem.id}
      newsItem={newsItem}
      showActivityLink={showActivityLink}
    />
  ));

  return (
    <section
      className={
        surface === "soft" ? `${styles.section} ${styles.soft}` : styles.section
      }
    >
      <Container>
        <div className={styles.header}>
          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
          {ctaLabel ? (
            <Button href={routes.news} variant="secondary" className={styles.cta}>
              {ctaLabel}
            </Button>
          ) : null}
        </div>

        {controls ? <div className={styles.controls}>{controls}</div> : null}
        {summary ? <div className={styles.summaryRow}>{summary}</div> : null}

        {news.length > 0 ? (
          shouldUseCarousel ? (
            <NewsCarousel news={news} layout={carouselLayout}>
              {newsCards}
            </NewsCarousel>
          ) : (
            <div className={styles.grid}>{newsCards}</div>
          )
        ) : (
          <div className={styles.empty}>{emptyState}</div>
        )}
      </Container>
    </section>
  );
}
