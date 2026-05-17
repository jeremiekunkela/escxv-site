import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { ActivityExplorer } from "@/features/activities/components/ActivityExplorer/ActivityExplorer";
import { KeyFigures } from "@/features/club/components/KeyFigures/KeyFigures";
import type { Activity } from "@/features/activities/types/activity";
import type { ClubInfo } from "@/features/club/types/club";
import type { HomepageContent as HomepageContentType } from "@/features/homepage/types/homepage";

type HomePageContentProps = {
  homepage: HomepageContentType;
  club: ClubInfo;
  activities: Activity[];
};

export function HomePageContent({ homepage, club, activities }: HomePageContentProps) {
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
        <KeyFigures figures={club.keyFigures} />

        <ActivityExplorer
          activities={activities}
          eyebrow={homepage.activitiesSection.eyebrow}
          title={homepage.activitiesSection.title}
          subtitle={homepage.activitiesSection.subtitle}
        />
      </main>
    </>
  );
}
