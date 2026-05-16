import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { ActivityExplorer } from "@/features/activities/components/ActivityExplorer/ActivityExplorer";
import { KeyFigures } from "@/features/club/components/KeyFigures/KeyFigures";
import type { Activity } from "@/features/activities/types/activity";
import type { ClubInfo } from "@/features/club/types/club";
import type { HomepageContent as HomepageContentType } from "@/features/homepage/types/homepage";
import styles from "./HomePageContent.module.css";

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
        secondaryCta={{
          label: homepage.hero.secondaryCtaLabel,
          href: homepage.hero.secondaryCtaHref,
        }}
        badges={homepage.hero.badges}
      />

      <main>
        <KeyFigures figures={club.keyFigures} />

        <section id="practical-info" className={styles.practicalInfo}>
          <Container>
            <div className={styles.practicalHeader}>
              <SectionTitle
                eyebrow={homepage.practicalInfo.eyebrow ?? homepage.practicalInfo.title}
                title={homepage.practicalInfo.title}
              />
            </div>
            <div className={styles.infoGrid}>
              {homepage.practicalInfo.items.map((item) => (
                <article key={item.title} className={styles.infoCard}>
                  <h3 className={styles.infoTitle}>{item.title}</h3>
                  <p className={styles.infoText}>{item.description}</p>
                </article>
              ))}
            </div>
          </Container>
        </section>

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
