import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { HeroSection } from "@/components/shared/HeroSection/HeroSection";
import { InstallationsExplorer } from "@/features/activities/components/InstallationsExplorer/InstallationsExplorer";
import { getInstallations } from "@/features/activities/data-access/activities";
import styles from "./page.module.css";

const vhssGuideUrl =
  "https://s.info.paris.fr/6491/www/Ville%20de%20Paris_Guide%20parents_violences%20sexuelles%20sur%20mineurs_Pr%C3%A9venir%20Rep%C3%A9rer%20Agir.pdf";

export const metadata: Metadata = {
  title: "Association",
  description:
    "Installations et ressources VHSS de l'ESCXV.",
};

export default function AssociationPage() {
  return (
    <>
      <HeroSection
        eyebrow="Association"
        title="L'ESCXV, association sportive depuis 1910"
        description="Retrouvez les lieux de pratique du club et les ressources de prévention."
        imageUrl="https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1800&q=80"
        primaryCta={{ label: "Voir les installations", href: "#installations" }}
        secondaryCta={{ label: "Guide VHSS", href: "#vhss" }}
      />

      <main>
        <section className={styles.section}>
          <Container>
            <article id="vhss" className={styles.panel}>
              <p className={styles.eyebrow}>VHSS</p>
              <h2 className={styles.title}>Prévenir, repérer, agir</h2>
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
              <ExternalLink aria-hidden="true" className={styles.externalIcon} />
            </article>
          </Container>
        </section>

        <section id="installations" className={styles.installationsSection}>
          <Container>
            <div className={styles.installationsHeader}>
              <p className={styles.eyebrow}>Installations</p>
              <h2 className={styles.title}>Les lieux de pratique</h2>
              <p className={styles.text}>
                Gymnases, stades, piscines et salles : les installations du club
                restent consultables depuis la page Association.
              </p>
            </div>
          </Container>
          <InstallationsExplorer installations={getInstallations()} />
        </section>
      </main>
    </>
  );
}
