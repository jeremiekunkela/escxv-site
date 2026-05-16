import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ActivityDetailPage } from "@/features/activities/components/ActivityDetailPage/ActivityDetailPage";
import {
  getActivityBySlug,
  getActivitySlugs,
} from "@/features/activities/data-access/activities";

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

  return {
    title: activity.title,
    description: activity.shortDescription,
  };
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { slug } = await params;
  const activity = getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  return <ActivityDetailPage activity={activity} />;
}
