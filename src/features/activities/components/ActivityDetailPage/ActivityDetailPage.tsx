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

const SECTION_COPY = {
  heroEyebrow: "Section",
  introEyebrow: "Presentation",
  introTitle: "La section",
  schedulesEyebrow: "Horaires",
  schedulesTitle: "Creneaux",
  schedulesNoticeTitle: "Horaires a confirmer",
  pricesEyebrow: "Tarifs",
  pricesTitle: "Tarifs de la saison",
  locationsEyebrow: "Lieux",
  locationsTitle: "Lieux de pratique",
  contactEyebrow: "Contact",
  contactTitle: "Contacter la section",
} as const;

function getContentOrFallback(content: string | undefined, fallback: string) {
  return content && content.trim().length > 0 ? content : fallback;
}

export function ActivityDetailPage({ activity }: ActivityDetailPageProps) {
  const { content } = activity;
  const hasPrograms = activity.programs.length > 0;
  const hasSchedules = activity.schedules.length > 0;
  const hasPrices = activity.prices.length > 0;
  const hasLocations = activity.locations.length > 0;
  const hasContacts = activity.contacts.length > 0;
  const schedulesSubtitle = getContentOrFallback(
    content.schedulesSubtitle,
    "Retrouvez ici les creneaux actuellement communiques par la section.",
  );
  const schedulesNoticeText = getContentOrFallback(
    content.schedulesNoticeText,
    "Les horaires seront communiques par la section des qu'ils seront confirmes.",
  );
  const locationsSubtitle = getContentOrFallback(
    content.locationsSubtitle,
    "Retrouvez ici les principaux lieux de pratique de la section.",
  );
  const contactText = getContentOrFallback(
    content.contactText,
    "Utilisez ces coordonnees pour toute question sur l'inscription, l'essai ou le bon groupe.",
  );
  const emptyContactText = getContentOrFallback(
    content.contactText,
    "Le contact de section sera ajoute des que la page sera ouverte.",
  );
  const introText = getContentOrFallback(
    content.introText,
    "Le detail des groupes et du fonctionnement sera ajoute quand cette section sera prete.",
  );
  const pricesSubtitle = getContentOrFallback(
    content.pricesSubtitle,
    "Consultez ici les tarifs communiques pour la saison en cours.",
  );
  const heroSubtitle = getContentOrFallback(content.heroSubtitle, activity.shortDescription);
  const primaryCta = activity.registrationUrl
    ? { label: "S'inscrire", href: activity.registrationUrl }
    : { label: "Contacter la section", href: "#contact" };
  const secondaryCta = hasSchedules
    ? { label: "Voir les horaires", href: "#horaires" }
    : { label: "Voir la presentation", href: "#programmes" };

  return (
    <>
      <HeroSection
        eyebrow={SECTION_COPY.heroEyebrow}
        title={activity.title}
        description={heroSubtitle}
        imageUrl={activity.image}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        badges={content.heroBadges}
      />

      <main>
        <section id="programmes" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={SECTION_COPY.introEyebrow}
                title={SECTION_COPY.introTitle}
                subtitle={hasPrograms ? introText : undefined}
              />
            </div>
            {hasPrograms ? (
              <ActivityProgramCards programs={activity.programs} />
            ) : (
              <InfoBlock title="Contenu en preparation">
                Le detail des programmes sera ajoute ici quand la section aura valide sa
                presentation.
              </InfoBlock>
            )}
          </Container>
        </section>

        <section id="horaires" className={`${styles.section} ${styles.gridSurface}`}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={SECTION_COPY.schedulesEyebrow}
                title={SECTION_COPY.schedulesTitle}
                subtitle={hasSchedules ? schedulesSubtitle : undefined}
              />
            </div>
            {hasSchedules ? (
              <ActivityScheduleCards
                schedules={activity.schedules}
                locations={activity.locations}
              />
            ) : (
              <InfoBlock title={SECTION_COPY.schedulesNoticeTitle}>
                {schedulesNoticeText}
              </InfoBlock>
            )}
          </Container>
        </section>

        <section id="pratique" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={SECTION_COPY.pricesEyebrow}
                title={SECTION_COPY.pricesTitle}
                subtitle={hasPrices ? pricesSubtitle : undefined}
              />
            </div>
            {hasPrices ? (
              <ActivityPriceBlocks prices={activity.prices} />
            ) : (
              <InfoBlock title="Tarifs en attente">
                Les tarifs seront ajoutes ici des que la section aura confirme sa grille.
              </InfoBlock>
            )}
          </Container>
        </section>

        <section className={`${styles.section} ${styles.surface}`}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow={SECTION_COPY.locationsEyebrow}
                title={SECTION_COPY.locationsTitle}
                subtitle={hasLocations ? locationsSubtitle : undefined}
              />
            </div>
            {hasLocations ? (
              <ActivityLocationCards locations={activity.locations} />
            ) : (
              <InfoBlock title="Lieux en attente">
                Les lieux de pratique seront centralises ici quand ils auront ete confirmes.
              </InfoBlock>
            )}
          </Container>
        </section>

        <section id="contact" className={styles.section}>
          <Container>
            <div className={styles.contactIntro}>
              <SectionTitle
                eyebrow={SECTION_COPY.contactEyebrow}
                title={SECTION_COPY.contactTitle}
                subtitle={hasContacts ? contactText : undefined}
              />
            </div>
            {hasContacts ? (
              <div className={styles.contactGrid}>
                <ActivityContactBlocks contacts={activity.contacts} />
                <ActivityContactForm content={content} />
              </div>
            ) : (
              <InfoBlock title="Contact en attente">
                {emptyContactText}
              </InfoBlock>
            )}
          </Container>
        </section>
      </main>
    </>
  );
}
