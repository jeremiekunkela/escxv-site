import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InfoBlock } from "@/components/shared/InfoBlock/InfoBlock";
import { Container } from "@/components/ui/Container/Container";
import { FloatingRegistrationButton } from "@/components/shared/FloatingRegistrationButton/FloatingRegistrationButton";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { ActivityContactBlocks } from "@/features/activities/components/ActivityContactBlocks/ActivityContactBlocks";
import { ActivityContactForm } from "@/features/activities/components/ActivityContactForm/ActivityContactForm";
import { ActivityLocationCards } from "@/features/activities/components/ActivityLocationCards/ActivityLocationCards";
import { PageNav } from "@/components/shared/PageNav/PageNav";
import type { PageNavLink } from "@/components/shared/PageNav/PageNav";
import { ActivityPriceBlocks } from "@/features/activities/components/ActivityPriceBlocks/ActivityPriceBlocks";
import { ActivityProgramCards } from "@/features/activities/components/ActivityProgramCards/ActivityProgramCards";
import { ActivityScheduleCards } from "@/features/activities/components/ActivityScheduleCards/ActivityScheduleCards";
import { ActivitySocialLinks } from "@/features/activities/components/ActivitySocialLinks/ActivitySocialLinks";
// `ActivityTrainerCards` removed — trainers section retired
import { getActivityFacts } from "@/features/activities/lib/activityFacts";
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
  children: ReactNode;
};

const ACTIVITY_DETAIL_PAGE_COPY = {
  heroEyebrow: "Section",
  introEyebrow: "Présentation",
  introTitle: "La section",
  schedulesEyebrow: "Horaires",
  schedulesTitle: "Créneaux",
  schedulesNoticeTitle: "Horaires à confirmer",
  trainersEyebrow: "Entraîneurs",
  trainersTitle: "L'équipe d'encadrement",
  pricesEyebrow: "Tarifs",
  pricesTitle: "Tarifs de la saison",
  locationsEyebrow: "Lieux",
  locationsTitle: "Lieux de pratique",
  newsEyebrow: "Actualités",
  newsTitle: "Actualités de la section",
  contactEyebrow: "Contact",
  contactTitle: "Contacter la section",
} as const;

const getRegistrationCtaTarget = (href: string): "_blank" | undefined =>
  href.includes("monclub.app") ? "_blank" : undefined;

const getRegistrationCtaRel = (href: string) =>
  href.includes("monclub.app") ? "noopener noreferrer" : undefined;

function getContentOrFallback(content: string | undefined, fallback: string) {
  return content && content.trim().length > 0 ? content : fallback;
}

function ActivityDetailPageSection({
  id,
  className = styles.section,
  headerClassName = styles.header,
  eyebrow,
  title,
  children,
}: ActivityDetailPageSectionProps) {
  return (
    <section id={id} className={className}>
      <Container>
        <div className={headerClassName}>
          <SectionTitle eyebrow={eyebrow} title={title} />
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
  const schedulesNoticeText = getContentOrFallback(
    content.schedulesNoticeText,
    "Les horaires seront communiqués par la section dès qu'ils seront confirmés.",
  );
  const emptyContactText = getContentOrFallback(
    content.contactText,
    "Le contact de section sera ajouté dès que la page sera ouverte.",
  );
  const heroSubtitle = getContentOrFallback(
    content.heroSubtitle,
    activity.shortDescription,
  );
  const registrationCta = activity.registrationUrl
    ? {
        label: "Inscription",
        href: activity.registrationUrl,
        target: getRegistrationCtaTarget(activity.registrationUrl),
        rel: getRegistrationCtaRel(activity.registrationUrl),
      }
    : null;
  const primaryCta = registrationCta ?? {
    label: "Contacter la section",
    href: "#contact",
  };
  const secondaryCta = hasSchedules
    ? { label: "Voir les horaires", href: "#horaires" }
    : { label: "Voir la présentation", href: "#programmes" };
  /**
   * Le sommaire ne liste que les sections reellement rendues : un lien vers
   * des tarifs absents coute plus de confiance qu'il n'en fait gagner.
   */
  const navLinks: PageNavLink[] = [
    { href: "#programmes", label: "Présentation", visible: true },
    { href: "#horaires", label: "Créneaux", visible: hasSchedules },
    { href: "#tarifs", label: "Tarifs", visible: hasPrices },
    { href: "#lieux", label: "Lieux", visible: hasLocations },
    { href: "#contact", label: "Contact", visible: hasContactChannels },
  ]
    .filter((link) => link.visible)
    .map(({ href, label }) => ({ href, label }));

  return (
    <>
      <HeroSection
        eyebrow={ACTIVITY_DETAIL_PAGE_COPY.heroEyebrow}
        title={activity.title}
        description={heroSubtitle}
        imageUrl={activity.image}
        facts={getActivityFacts(activity)}
        primaryCta={primaryCta}
        secondaryCta={secondaryCta}
        enableRegistrationHandoff={Boolean(registrationCta)}
      />

      <PageNav links={navLinks} />

      {registrationCta ? (
        <FloatingRegistrationButton
          href={registrationCta.href}
          label={registrationCta.label}
          target={registrationCta.target}
          rel={registrationCta.rel}
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
        >
          {hasPrograms ? (
            <ActivityProgramCards programs={activity.programs} />
          ) : (
            <InfoBlock title="Contenu en préparation">
              Le détail des programmes sera ajouté ici quand la section aura
              validé sa présentation.
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        <ActivityDetailPageSection
          id="horaires"
          className={`${styles.section} ${styles.gridSurface}`}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.schedulesEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.schedulesTitle}
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
          surface="soft"
          presentation="carousel"
          carouselLayout="single"
        />

        <ActivityDetailPageSection
          id="tarifs"
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.pricesEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.pricesTitle}
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
          id="lieux"
          className={`${styles.section} ${styles.surface}`}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.locationsEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.locationsTitle}
        >
          {hasLocations ? (
            <ActivityLocationCards locations={activity.locations} />
          ) : (
            <InfoBlock title="Lieux en attente">
              Les lieux de pratique seront centralisés ici quand ils auront été
              confirmés.
            </InfoBlock>
          )}
        </ActivityDetailPageSection>

        <ActivityDetailPageSection
          id="contact"
          headerClassName={styles.contactIntro}
          eyebrow={ACTIVITY_DETAIL_PAGE_COPY.contactEyebrow}
          title={ACTIVITY_DETAIL_PAGE_COPY.contactTitle}
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
              <ActivityContactForm
                activitySlug={activity.slug}
                content={content}
              />
            </div>
          ) : (
            <InfoBlock title="Contact en attente">{emptyContactText}</InfoBlock>
          )}
        </ActivityDetailPageSection>
      </main>
    </>
  );
}
