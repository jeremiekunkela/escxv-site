import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { NewsList } from "@/features/news/components/NewsList/NewsList";
import { NewsReadingProgress } from "@/features/news/components/NewsReadingProgress/NewsReadingProgress";
import type { NewsArticleBlock, NewsItem } from "@/features/news/types/news";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import Image from "next/image";
import type { CSSProperties, ReactNode } from "react";
import styles from "./NewsArticlePage.module.css";

type NewsArticlePageProps = {
  newsItem: NewsItem;
  relatedNews: NewsItem[];
};

type NewsArticleBlockRenderProps<Block extends NewsArticleBlock> = {
  block: Block;
  newsItem: NewsItem;
  index: number;
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatNewsDate(value: string) {
  return dateFormatter.format(new Date(value));
}

function getNewsArticleBlocks(newsItem: NewsItem): NewsArticleBlock[] {
  return newsItem.blocks && newsItem.blocks.length > 0
    ? newsItem.blocks
    : [
        {
          type: "heading",
          title: "actualité",
        },
        {
          type: "text",
          paragraphs: [newsItem.content],
        },
      ];
}

function NewsArticleHeadingBlock({
  block,
  newsItem,
  index,
}: NewsArticleBlockRenderProps<Extract<NewsArticleBlock, { type: "heading" }>>) {
  return (
    <header
      key={`${newsItem.slug}-heading-${index}`}
      className={styles.articleHeading}
      data-reveal
    >
      <h2 className={styles.sectionTitle}>{block.title}</h2>
      {block.subtitle ? (
        <p className={styles.sectionSubtitle}>{block.subtitle}</p>
      ) : null}
    </header>
  );
}

function NewsArticleImageBlock({
  block,
  newsItem,
  index,
}: NewsArticleBlockRenderProps<Extract<NewsArticleBlock, { type: "image" }>>) {
  const isWide = block.size === "wide";

  return (
    <figure
      key={`${newsItem.slug}-image-${index}`}
      className={isWide ? `${styles.figure} ${styles.figureWide}` : styles.figure}
      data-reveal="zoom"
    >
      <div className={styles.figureMedia}>
        <Image
          src={block.src}
          alt={block.alt}
          fill
          sizes={isWide ? "(min-width: 1180px) 65vw, 100vw" : "(min-width: 1180px) 44vw, 100vw"}
          className={styles.figureImage}
        />
      </div>
      {block.caption ? (
        <figcaption className={styles.caption}>{block.caption}</figcaption>
      ) : null}
    </figure>
  );
}

function NewsArticleTextBlock({
  block,
  newsItem,
  index,
}: NewsArticleBlockRenderProps<Extract<NewsArticleBlock, { type: "text" }>>) {
  return (
    <div key={`${newsItem.slug}-text-${index}`} className={styles.sectionBody} data-reveal>
      {block.paragraphs.map((paragraph, paragraphIndex) => (
        <p key={`${newsItem.slug}-${index}-${paragraphIndex}`}>{paragraph}</p>
      ))}
    </div>
  );
}

const newsArticleBlockRenderers = {
  heading: NewsArticleHeadingBlock,
  image: NewsArticleImageBlock,
  text: NewsArticleTextBlock,
} satisfies {
  [Type in NewsArticleBlock["type"]]: (
    props: NewsArticleBlockRenderProps<Extract<NewsArticleBlock, { type: Type }>>,
  ) => ReactNode;
};

function NewsArticleContentBlock({
  block,
  newsItem,
  index,
}: NewsArticleBlockRenderProps<NewsArticleBlock>) {
  const NewsArticleBlockRenderer = newsArticleBlockRenderers[block.type];

  return (
    <NewsArticleBlockRenderer
      block={block as never}
      newsItem={newsItem}
      index={index}
    />
  );
}

export function NewsArticlePage({
  newsItem,
  relatedNews,
}: NewsArticlePageProps) {
  const newsArticleBlocks = getNewsArticleBlocks(newsItem);

  return (
    <>
      <NewsReadingProgress />
      <section className={styles.hero}>
        {newsItem.coverImage ? (
          <Image
            src={newsItem.coverImage}
            alt={newsItem.coverImageAlt ?? ""}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        ) : null}
        <div className={styles.heroScrim} />
        <Container className={styles.heroInner}>
          <div className={styles.heroContent}>
            <Button
              href={routes.news}
              variant="ghost"
              icon="arrowLeft"
              className={styles.backButton}
            >
              Retour aux actualités
            </Button>

            <div
              className={styles.heroMeta}
              data-reveal
              style={{ "--reveal-delay": "80ms" } as CSSProperties}
            >
              <time dateTime={newsItem.publishedAt}>
                {formatNewsDate(newsItem.publishedAt)}
              </time>
              {newsItem.readingTime ? (
                <span className={styles.readingTime}>{newsItem.readingTime}</span>
              ) : null}
            </div>

            <h1
              className={styles.title}
              data-reveal
              style={{ "--reveal-delay": "150ms" } as CSSProperties}
            >
              {newsItem.title}
            </h1>
            {newsItem.subtitle ? (
              <p
                className={styles.subtitle}
                data-reveal
                style={{ "--reveal-delay": "220ms" } as CSSProperties}
              >
                {newsItem.subtitle}
              </p>
            ) : null}
            <p
              className={styles.excerpt}
              data-reveal
              style={{ "--reveal-delay": "290ms" } as CSSProperties}
            >
              {newsItem.excerpt}
            </p>
          </div>
        </Container>
      </section>

      <main>
        <section className={styles.section}>
          <Container>
            <div className={styles.layout}>
              <article className={styles.article}>
                {newsArticleBlocks.map((block, index) => (
                  <NewsArticleContentBlock
                    key={`${newsItem.slug}-${block.type}-${index}`}
                    block={block}
                    newsItem={newsItem}
                    index={index}
                  />
                ))}
              </article>

              <aside className={styles.sidebar}>
                <div className={styles.sidebarCard} data-reveal="zoom">
                  <p className={styles.sidebarEyebrow}>A retenir</p>
                  {newsItem.summaryPoints && newsItem.summaryPoints.length > 0 ? (
                    <ul className={styles.summaryList}>
                      {newsItem.summaryPoints.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className={styles.sidebarText}>{newsItem.excerpt}</p>
                  )}
                </div>

                <div
                  className={styles.sidebarCard}
                  data-reveal="zoom"
                  style={{ "--reveal-delay": "90ms" } as CSSProperties}
                >
                  <p className={styles.sidebarEyebrow}>Navigation</p>
                  <div className={styles.sidebarActions}>
                    <Button href={routes.news} variant="secondary">
                      Toutes les actualités
                    </Button>
                    {newsItem.activitySlug ? (
                      <Button href={getActivityRoute(newsItem.activitySlug)}>
                        Voir la section liee
                      </Button>
                    ) : null}
                  </div>
                </div>
              </aside>
            </div>
          </Container>
        </section>

        {relatedNews.length > 0 ? (
          <NewsList
            news={relatedNews}
            eyebrow="A lire aussi"
            title="Autres actualités"
            surface="soft"
            presentation="carousel"
            carouselLayout="single"
          />
        ) : null}
      </main>
    </>
  );
}
