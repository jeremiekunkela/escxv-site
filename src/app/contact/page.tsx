import type { Metadata } from "next";
import { Container } from "@/components/ui/Container/Container";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InfoBlock } from "@/components/shared/InfoBlock/InfoBlock";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { getClubInfo } from "@/features/club/data-access/club";
import { ContactBlocks } from "@/features/contact/components/ContactBlocks/ContactBlocks";
import { ContactForm } from "@/features/contact/components/ContactForm/ContactForm";
import { getClubContactChannels } from "@/features/contact/data-access/contactChannels";
import { getContactRecipients } from "@/features/contact/data-access/contactRecipients";
import { isContactFormEnabled } from "@/features/contact/lib/contactEnvironment";
import { CLUB_RECIPIENT_SLUG } from "@/features/contact/lib/resolveContactRecipient";
import styles from "./page.module.css";

const club = getClubInfo();
const recipients = getContactRecipients();
const channels = getClubContactChannels();

export const metadata: Metadata = {
  title: "Contact",
  description: `Écrire au ${club.shortName} ou directement à l'une de ses sections.`,
};

export default function ContactPage() {
  const contactFormEnabled = isContactFormEnabled();

  return (
    <>
      <HeroSection
        eyebrow="Contact"
        title="Écrire au club"
        description={
          contactFormEnabled
            ? "Une question sur une activité, une envie de nous rejoindre, une démarche administrative : choisissez votre destinataire, le message part directement dans sa boîte."
            : "Une question sur une activité, une envie de nous rejoindre, une démarche administrative : écrivez au club, ou directement à la section concernée."
        }
        imageUrl="https://images.unsplash.com/photo-1542323228-002ac256e7b8?auto=format&fit=crop&w=1800&q=80"
      />

      <main>
        <section className={`${styles.section} ${styles.gridSurface}`}>
          <Container>
            <div className={styles.header}>
              <SectionTitle
                eyebrow="Nous écrire"
                title={
                  contactFormEnabled ? "Un message, un destinataire" : "Écrire au club"
                }
              />
            </div>

            <div className={styles.contactGrid}>
              <div className={styles.contactChannels}>
                <ContactBlocks contacts={channels} />
              </div>
              {contactFormEnabled ? (
                <ContactForm
                  recipients={recipients}
                  defaultRecipientSlug={CLUB_RECIPIENT_SLUG}
                  title="Envoyer un message"
                />
              ) : (
                <InfoBlock title="Formulaire momentanément indisponible">
                  Écrivez au club à l&apos;adresse indiquée. Pour joindre une
                  section, son adresse figure sur sa page, dans la rubrique
                  Contact.
                </InfoBlock>
              )}
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
