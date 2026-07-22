import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { FloatingRegistrationButton } from "@/components/shared/FloatingRegistrationButton/FloatingRegistrationButton";
import { ActivityDirectorySection } from "@/features/activities/components/ActivityDirectorySection/ActivityDirectorySection";
import type { Activity } from "@/features/activities/types/activity";
import { ClubKeyFigures } from "@/features/club/components/ClubKeyFigures/ClubKeyFigures";
import type { ClubInfo } from "@/features/club/types/club";
import type { HomepageContent as HomepageContentType } from "@/features/homepage/types/homepage";
import { NewsList } from "@/features/news/components/NewsList/NewsList";
import type { NewsItem } from "@/features/news/types/news";
import styles from "./HomePageContent.module.css";

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
  const registrationCta = {
    label: homepage.hero.primaryCtaLabel,
    href: homepage.hero.primaryCtaHref,
    target: homepage.hero.primaryCtaTarget,
    rel: homepage.hero.primaryCtaRel,
  };

  return (
    <>
      <HeroSection
        eyebrow={homepage.hero.eyebrow}
        title={homepage.hero.title}
        description={homepage.hero.subtitle}
        imageUrl={homepage.hero.imageUrl}
        primaryCta={registrationCta}
        secondaryCta={
          homepage.hero.secondaryCtaLabel && homepage.hero.secondaryCtaHref
            ? {
                label: homepage.hero.secondaryCtaLabel,
                href: homepage.hero.secondaryCtaHref,
              }
            : undefined
        }
        enableRegistrationHandoff
      />

      <FloatingRegistrationButton
        href={registrationCta.href}
        label={registrationCta.label}
        target={registrationCta.target}
        rel={registrationCta.rel}
      />

      <main className={styles.mainWithFloatingRegistration}>
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
          subtitle="Des aperçus rapides des dernières annonces du club, avec un accès vers chaque page détaillée."
          ctaLabel="Toutes les actualités"
          surface="soft"
          presentation="carousel"
          carouselLayout="single"
        />
      </main>
    </>
  );
}
