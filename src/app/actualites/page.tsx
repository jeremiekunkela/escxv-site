import type { Metadata } from "next";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { getActivities } from "@/features/activities/data-access/activities";
import { NewsExplorer } from "@/features/news/components/NewsExplorer/NewsExplorer";
import { getPublishedNews } from "@/features/news/data-access/news";

export const metadata: Metadata = {
  title: "Actualités",
  description: "Les dernieres actualites publiees par l'ESCXV et ses sections.",
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
        description="Retrouvez des apercus rapides sur les informations publiees par l'ESCXV, puis ouvrez chaque actualite dans une page detaillee avec contenu complet, images et informations complementaires."
        imageUrl="https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=1800&q=80"
        primaryCta={{ label: "Voir les actualités", href: "#actualites" }}
        badges={["Club", "Sections", "Informations pratiques"]}
      />
      <main id="actualites">
        <NewsExplorer
          news={news}
          activityLabelsBySlug={activityLabelsBySlug}
          title="Toutes les actualités"
          subtitle="Chaque carte presente un apercu. Ouvrez ensuite l'actualite pour lire la version complete."
        />
      </main>
    </>
  );
}
