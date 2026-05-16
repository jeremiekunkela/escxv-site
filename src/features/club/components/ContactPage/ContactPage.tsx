import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import type { ClubInfo } from "@/features/club/types/club";
import styles from "./ContactPage.module.css";

type ContactPageProps = {
  club: ClubInfo;
};

export function ContactPage({ club }: ContactPageProps) {
  return (
    <main className={styles.section}>
      <Container>
        <div className={styles.grid}>
          <SectionTitle
            eyebrow="Contact"
            title={`Contacter ${club.shortName}`}
            subtitle={club.description}
          />
          <section className={styles.card} aria-label="Coordonnees du club">
            <ul className={styles.list}>
              <li className={styles.item}>
                <span className={styles.strong}>Adresse: </span>
                {club.address}, {club.postalCode} {club.city}
              </li>
              <li className={styles.item}>
                <span className={styles.strong}>Telephone: </span>
                {club.phone}
              </li>
              {club.email ? (
                <li className={styles.item}>
                  <span className={styles.strong}>Email: </span>
                  <a href={`mailto:${club.email}`}>{club.email}</a>
                </li>
              ) : null}
            </ul>
          </section>
        </div>
      </Container>
    </main>
  );
}
