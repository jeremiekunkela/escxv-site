import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityDetailPage } from "@/features/activities/components/ActivityDetailPage/ActivityDetailPage";
import {
  getActivityBySlug,
  getActivitySlugs,
} from "@/features/activities/data-access/activities";
import { getNewsByActivitySlug } from "@/features/news/data-access/news";
import { getClubInfo } from "@/features/club/data-access/club";
import { JsonLd } from "@/components/shared/JsonLd/JsonLd";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import {
  buildBreadcrumbSchema,
  buildSectionSchema,
} from "@/lib/seo/structuredData";

type ActivityPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getActivitySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: ActivityPageProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    return {
      title: "Section introuvable",
    };
  }

  /**
   * Le gabarit du site ajoute « – ESCXV | Paris 15e » : le titre d'une section
   * n'a donc que son sport a porter, et la description reste celle que la
   * section a ecrite d'elle-meme.
   */
  return {
    title: activity.title,
    description: activity.shortDescription,
    alternates: { canonical: getActivityRoute(activity.slug) },
    openGraph: {
      type: "website",
      url: getActivityRoute(activity.slug),
      title: `${activity.title} – ${getClubInfo().shortName}`,
      description: activity.shortDescription,
      images: [{ url: activity.image, alt: `Section ${activity.title}` }],
    },
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const club = getClubInfo();
  const path = getActivityRoute(activity.slug);

  return (
    <>
      <JsonLd
        data={buildSectionSchema({
          club,
          title: activity.title,
          description: activity.shortDescription,
          path,
          image: activity.image,
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: club.shortName, path: routes.home },
          { name: activity.title, path },
        ])}
      />
      <ActivityDetailPage
        activity={activity}
        news={getNewsByActivitySlug(activity.slug)}
      />
    </>
  );
}
