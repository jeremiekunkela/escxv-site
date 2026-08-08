import type { Metadata } from "next";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { getLocations } from "@/features/activities/data-access/activities";
import { ClubGovernance } from "@/features/club/components/ClubGovernance/ClubGovernance";
import { ClubPresentation } from "@/features/club/components/ClubPresentation/ClubPresentation";
import { getClubInfo } from "@/features/club/data-access/club";
import { getGovernance } from "@/features/club/data-access/governance";
import { routes } from "@/lib/constants/routes";
import styles from "./page.module.css";

const installationCount = getLocations().length;

const vhssGuideUrl =
  "https://s.info.paris.fr/6491/www/Ville%20de%20Paris_Guide%20parents_violences%20sexuelles%20sur%20mineurs_Pr%C3%A9venir%20Rep%C3%A9rer%20Agir.pdf";

export const metadata: Metadata = {
  title: "Association",
  description:
    "Présentation de l'ESCXV, comité directeur et ressources de prévention VHSS.",
};

export default function AssociationPage() {
  const club = getClubInfo();
  const governance = getGovernance();

  return (
    <>
      <HeroSection
        eyebrow="Association"
        title="L'ESCXV, association sportive depuis 1910"
        description="Découvrez le projet du club, son comité directeur, ses lieux de pratique et les ressources de prévention."
        imageUrl="https://images.unsplash.com/photo-1517130038641-a774d04afb3c?auto=format&fit=crop&w=1800&q=80"
      />

      <main>
        <section id="presentation" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle eyebrow="Le club" title="Notre association" />
            </div>
            <ClubPresentation presentation={club.presentation} />
          </Container>
        </section>

        <section id="comite" className={`${styles.section} ${styles.softGrid}`}>
          <Container>
            <div className={styles.header}>
              <SectionTitle eyebrow="Gouvernance" title="Le comité directeur" />
            </div>
            <ClubGovernance governance={governance} />
          </Container>
        </section>

        <section id="vhss" className={styles.section}>
          <Container>
            <div className={styles.header}>
              <SectionTitle eyebrow="VHSS" title="Prévenir, repérer, agir" />
            </div>
            <div className={styles.vhssBody}>
              <p className={styles.text}>
                Le guide de la Ville de Paris accompagne les familles et les
                encadrants dans la prévention des violences sexuelles sur mineurs.
              </p>
              <Button
                href={vhssGuideUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.vhssButton}
              >
                Ouvrir le guide
              </Button>
            </div>
          </Container>
        </section>

        <section
          id="installations"
          className={`${styles.section} ${styles.softGrid}`}
        >
          <Container>
            <div className={styles.header}>
              <SectionTitle eyebrow="Installations" title="Les lieux de pratique" />
            </div>
            <div className={styles.vhssBody}>
              <p className={styles.text}>
                Les {installationCount} gymnases, stades et piscines du club
                sont présentés sur leur propre page, avec les sports pratiqués
                dans chacun de leurs espaces.
              </p>
              <Button href={routes.locations} className={styles.vhssButton}>
                Voir les lieux de pratique
              </Button>
            </div>
          </Container>
        </section>
      </main>
    </>
  );
}
