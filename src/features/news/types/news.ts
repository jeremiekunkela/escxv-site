export type NewsStatus = "draft" | "published";

export type NewsType = "club" | "activity";

export type NewsArticleHeadingBlock = {
  type: "heading";
  title: string;
  subtitle?: string;
};

export type NewsArticleTextBlock = {
  type: "text";
  paragraphs: string[];
};

export type NewsArticleImageBlock = {
  type: "image";
  src: string;
  alt: string;
  caption?: string;
  size?: "inline" | "wide";
};

export type NewsArticleBlock =
  | NewsArticleHeadingBlock
  | NewsArticleTextBlock
  | NewsArticleImageBlock;

export type NewsItem = {
  id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt: string;
  content: string;
  coverImage?: string | null;
  coverImageAlt?: string;
  publishedAt: string;
  status: NewsStatus;
  type: NewsType;
  isPinned: boolean;
  activitySlug: string | null;
  seoDescription?: string;
  readingTime?: string;
  summaryPoints?: string[];
  blocks?: NewsArticleBlock[];
};
