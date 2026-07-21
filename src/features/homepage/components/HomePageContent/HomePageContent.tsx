import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { ActivityDirectorySection } from "@/features/activities/components/ActivityDirectorySection/ActivityDirectorySection";
import type { Activity } from "@/features/activities/types/activity";
import { ClubKeyFigures } from "@/features/club/components/ClubKeyFigures/ClubKeyFigures";
import type { ClubInfo } from "@/features/club/types/club";
import type { HomepageContent as HomepageContentType } from "@/features/homepage/types/homepage";
import { NewsList } from "@/features/news/components/NewsList/NewsList";
import type { NewsItem } from "@/features/news/types/news";

type HomePageContentProps = {
  homepage: HomepageContentType;
  club: ClubInfo;
  activities: Activity[];
  news: NewsItem[];
};

export function HomePageContent({
  homepage,
  club,
  activities,
  news,
}: HomePageContentProps) {
  return (
    <>
      <HeroSection
        eyebrow={homepage.hero.eyebrow}
        title={homepage.hero.title}
        description={homepage.hero.subtitle}
        imageUrl={homepage.hero.imageUrl}
        primaryCta={{
          label: homepage.hero.primaryCtaLabel,
          href: homepage.hero.primaryCtaHref,
        }}
        badges={homepage.hero.badges}
      />

      <main>
        <ClubKeyFigures figures={club.keyFigures} />

        <ActivityDirectorySection
          activities={activities}
          eyebrow={homepage.activitiesSection.eyebrow}
          title={homepage.activitiesSection.title}
          subtitle={homepage.activitiesSection.subtitle}
        />

        <NewsList
          news={news}
          title="Actualités du club"
          subtitle="Des apercus rapides des dernieres annonces du club, avec un acces vers chaque page detaillee."
          ctaLabel="Toutes les actualités"
          surface="soft"
          presentation="carousel"
          carouselLayout="single"
        />
      </main>
    </>
  );
}
