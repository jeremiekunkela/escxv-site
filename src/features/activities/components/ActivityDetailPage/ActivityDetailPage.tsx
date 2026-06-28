import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InfoBlock } from "@/components/shared/InfoBlock/InfoBlock";
import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { ActivityContactBlocks } from "@/features/activities/components/ActivityContactBlocks/ActivityContactBlocks";
import { ActivityContactForm } from "@/features/activities/components/ActivityContactForm/ActivityContactForm";
import { ActivityFloatingRegistrationButton } from "@/features/activities/components/ActivityDetailPage/ActivityFloatingRegistrationButton";
import { ActivityLocationCards } from "@/features/activities/components/ActivityLocationCards/ActivityLocationCards";
import { ActivityPriceBlocks } from "@/features/activities/components/ActivityPriceBlocks/ActivityPriceBlocks";
import { ActivityProgramCards } from "@/features/activities/components/ActivityProgramCards/ActivityProgramCards";
import { ActivityScheduleCards } from "@/features/activities/components/ActivityScheduleCards/ActivityScheduleCards";
import { ActivitySocialLinks } from "@/features/activities/components/ActivitySocialLinks/ActivitySocialLinks";
// `ActivityTrainerCards` removed — trainers section retired
import type { Activity } from "@/features/activities/types/activity";
import { NewsList } from "@/features/news/components/NewsList/NewsList";
import type { NewsItem } from "@/features/news/types/news";
import type { ReactNode } from "react";
import styles from "./ActivityDetailPage.module.css";

type ActivityDetailPageProps = {
  activity: Activity;
  news?: NewsItem[];
};

type ActivityDetailPageSectionProps = {
  id?: string;
  className?: string;
  headerClassName?: string;
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
};

const ACTIVITY_DETAIL_PAGE_COPY = {
  heroEyebrow: "Section",
  introEyebrow: "Presentation",
  introTitle: "La section",
  schedulesEyebrow: "Horaires",
  schedulesTitle: "Creneaux",
  schedulesNoticeTitle: "Horaires a confirmer",
  trainersEyebrow: "Entraineurs",
  trainersTitle: "L'equipe d'encadrement",
  pricesEyebrow: "Tarifs",
  pricesTitle: "Tarifs de la saison",
  locationsEyebrow: "Lieux",
  locationsTitle: "Lieux de pratique",
  newsEyebrow: "Actualités",
  newsTitle: "Actualités de la section",
  contactEyebrow: "Contact",
  contactTitle: "Contacter la section",
} as const;

function getContentOrFallback(content: string | undefined, fallback: string) {
  return content && content.trim().length > 0 ? content : fallback;
}

function ActivityDetailPageSection({
  id,
  className = styles.section,
  headerClassName = styles.header,
  eyebrow,
  title,
  subtitle,
  children,
}: ActivityDetailPageSectionProps) {
  return (
    <section id={id} className={className}>
      <Container>
        <div className={headerClassName}>
          <SectionTitle eyebrow={eyebrow} title={title} subtitle={subtitle} />
        </div>
        {children}
      </Container>
    </section>
  );
}

export function ActivityDetailPage({
  activity,
  news = [],
}: ActivityDetailPageProps) {
  const { content } = activity;
  const hasPrograms = activity.programs.length > 0;
  const hasSchedules = activity.schedules.length > 0;
  const hasPrices = activity.prices.length > 0;
  const hasLocations = activity.locations.length > 0;
  const hasContacts = activity.contacts.length > 0;
  const socialLinks = activity.socialLinks ?? [];
  const hasSocialLinks = socialLinks.length > 0;
  const hasContactChannels = hasContacts || hasSocialLinks;
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
  const heroSubtitle = getContentOrFallback(
    content.heroSubtitle,
    activity.shortDescription,
  );
  const registrationCta = activity.registrationUrl
    ? { label: "S'inscrire", href: activity.registrationUrl }
    : null;
  const primaryCta = registrationCta ?? {
    label: "Contacter la section",
    href: "#contact",
  };
  const secondaryCta = hasSchedules
    ? { label: "Voir les horaires", href: "#horaires" }
    : { label: "Voir la presentation", href: "#programmes" };

  return (
    <>
      <HeroSection
        eyebrow={ACTIVITY_DETAIL_PAGE_COPY.heroEyebrow}
        title={activity.title}
        description={heroSubtitle}
        imageUrl={activity.image}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        badges={content.heroBadges}
        enableRegistrationHandoff={Boolean(registrationCta)}
      />

      {registrationCta ? (
        <ActivityFloatingRegistrationButton
          href={registrationCta.href}
          label={registrationCta.label}
        />
      ) : null}

      <main
        className={
          registrationCta ? styles.mainWithFloatingRegistration : undefined
        }
      >
        <ActivityDetailPageSection
          id="programmes"
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.introEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.introTitle}
          subtitle={hasPrograms ? introText : undefined}
        >
          {hasPrograms ? (
            <ActivityProgramCards programs={activity.programs} />
          ) : (
            <InfoBlock title="Contenu en preparation">
              Le detail des programmes sera ajoute ici quand la section aura
              valide sa presentation.
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        <ActivityDetailPageSection
          id="horaires"
          className={`${styles.section} ${styles.gridSurface}`}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.schedulesEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.schedulesTitle}
          subtitle={hasSchedules ? schedulesSubtitle : undefined}
        >
          {hasSchedules ? (
            <ActivityScheduleCards
              schedules={activity.schedules}
              practiceGroups={activity.practiceGroups}
              locations={activity.locations}
            />
          ) : (
            <InfoBlock title={ACTIVITY_DETAIL_PAGE_COPY.schedulesNoticeTitle}>
              {schedulesNoticeText}
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        {/* Trainers section retired */}

        <NewsList
          news={news}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.newsEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.newsTitle}
          subtitle={`Des apercus rapides pour la section ${activity.title}, avec un acces vers chaque actualite complete.`}
          surface="soft"
          presentation="carousel"
          carouselLayout="single"
        />

        <ActivityDetailPageSection
          id="pratique"
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.pricesEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.pricesTitle}
          subtitle={hasPrices ? pricesSubtitle : undefined}
        >
          {hasPrices ? (
            <ActivityPriceBlocks prices={activity.prices} />
          ) : (
            <InfoBlock title="Tarifs en attente">
              Les tarifs seront ajoutes ici des que la section aura confirme sa
              grille.
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        <ActivityDetailPageSection
          className={`${styles.section} ${styles.surface}`}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.locationsEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.locationsTitle}
          subtitle={hasLocations ? locationsSubtitle : undefined}
        >
          {hasLocations ? (
            <ActivityLocationCards
              locations={activity.locations}
              activitySlug={activity.slug}
            />
          ) : (
            <InfoBlock title="Lieux en attente">
              Les lieux de pratique seront centralises ici quand ils auront ete
              confirmes.
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        <ActivityDetailPageSection
          id="contact"
          headerClassName={styles.contactIntro}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.contactEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.contactTitle}
          subtitle={hasContactChannels ? contactText : undefined}
        >
          {hasContactChannels ? (
            <div className={styles.contactGrid}>
              <div className={styles.contactChannels}>
                {hasContacts ? (
                  <ActivityContactBlocks contacts={activity.contacts} />
                ) : null}
                {hasSocialLinks ? (
                  <ActivitySocialLinks socialLinks={socialLinks} />
                ) : null}
              </div>
              <ActivityContactForm content={content} />
            </div>
          ) : (
            <InfoBlock title="Contact en attente">{emptyContactText}</InfoBlock>
          )}
        </ActivityDetailPageSection>
      </main>
    </>
  );
}
