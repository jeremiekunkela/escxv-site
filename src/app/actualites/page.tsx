import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { getActivities } from "@/features/activities/data-access/activities";
import { NewsExplorer } from "@/features/news/components/NewsExplorer/NewsExplorer";
import { getPublishedNews } from "@/features/news/data-access/news";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les dernières actualités publiées par l'ESCXV et ses sections.",
};

export default function NewsPage() {
  const news = getPublishedNews();
  const activityLabelsBySlug = Object.fromEntries(
    getActivities().map((activity) => [activity.slug, activity.title]),
  );

  return (
    <>
      <HeroSection
        eyebrow="Actualités"
        title="Les nouvelles du club et des sections"
        description="Ouverture des inscriptions, dates de reprise, séances d'essai, changements de créneaux et vie des sections : les informations pratiques du club sont publiées ici."
        imageUrl="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1800&q=80"
      />
      <main id="actualites">
        <NewsExplorer
          news={news}
          activityLabelsBySlug={activityLabelsBySlug}
          title="Toutes les actualités"
        />
      </main>
    </>
  );
}
