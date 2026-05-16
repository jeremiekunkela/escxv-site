import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { InfoBlock } from "@/components/shared/InfoBlock/InfoBlock";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { ActivityContactBlocks } from "@/features/activities/components/ActivityContactBlocks/ActivityContactBlocks";
import { ActivityContactForm } from "@/features/activities/components/ActivityContactForm/ActivityContactForm";
import { ActivityLocationCards } from "@/features/activities/components/ActivityLocationCards/ActivityLocationCards";
import { ActivityPriceBlocks } from "@/features/activities/components/ActivityPriceBlocks/ActivityPriceBlocks";
import { ActivityProgramCards } from "@/features/activities/components/ActivityProgramCards/ActivityProgramCards";
import { ActivityScheduleCards } from "@/features/activities/components/ActivityScheduleCards/ActivityScheduleCards";
import type { Activity } from "@/features/activities/types/activity";
import styles from "./ActivityDetailPage.module.css";

type ActivityDetailPageProps = {
  activity: Activity;
};

export function ActivityDetailPage({ activity }: ActivityDetailPageProps) {
  const { content } = activity;

  return (
    <>
      <HeroSection
        eyebrow={content.heroEyebrow}
        title={content.heroTitle}
        description={content.heroSubtitle}
        imageUrl={activity.image}
        primaryCta={{
          label: content.heroPrimaryCtaLabel,
          href: content.heroPrimaryCtaHref,
        }}
        secondaryCta={{
          label: content.heroSecondaryCtaLabel,
          href: content.heroSecondaryCtaHref,
        }}
        badges={content.heroBadges}
      />

      <main>
        <section id="programmes" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={content.introEyebrow ?? content.introTitle}
                title={content.introTitle}
                subtitle={content.introText}
              />
            </div>
            <ActivityProgramCards programs={activity.programs} />
          </Container>
        </section>

        <section id="horaires" className={`${styles.section} ${styles.gridSurface}`}>
          <Container>
            <div className={styles.splitHeader}>
              <SectionTitle
                eyebrow={content.schedulesEyebrow ?? content.schedulesTitle}
                title={content.schedulesTitle}
                subtitle={content.schedulesSubtitle}
              />
              <InfoBlock title={content.schedulesNoticeTitle}>
                {content.schedulesNoticeText}
              </InfoBlock>
            </div>
            <ActivityScheduleCards
              schedules={activity.schedules}
              locations={activity.locations}
            />
          </Container>
        </section>

        <section id="pratique" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={content.pricesEyebrow ?? content.pricesTitle}
                title={content.pricesTitle}
                subtitle={content.pricesSubtitle}
              />
            </div>
            <ActivityPriceBlocks prices={activity.prices} />
          </Container>
        </section>

        <section className={`${styles.section} ${styles.surface}`}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={content.locationsEyebrow ?? content.locationsTitle}
                title={content.locationsTitle}
                subtitle={content.locationsSubtitle}
              />
            </div>
            <ActivityLocationCards locations={activity.locations} />
          </Container>
        </section>

        <section id="contact" className={styles.section}>
          <Container>
            <div className={styles.contactIntro}>
              <SectionTitle
                eyebrow={content.contactEyebrow ?? content.contactTitle}
                title={content.contactTitle}
                subtitle={content.contactText}
              />
              <ul className={styles.notes}>
                {content.contactNotes.map((note) => (
                  <li key={note} className={styles.note}>
                    {note}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.contactGrid}>
              <ActivityContactBlocks contacts={activity.contacts} />
              <ActivityContactForm content={content} />
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
