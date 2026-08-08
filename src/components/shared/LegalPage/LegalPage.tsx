import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container/Container";
import styles from "./LegalPage.module.css";

type LegalPageProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

/**
 * Mise en page des pages a valeur juridique. Volontairement sans banniere
 * photo : on vient y verifier un fait, pas admirer une image, et un hero de
 * 84 vh repousserait l'information sous la ligne de flottaison.
 */
export function LegalPage({
  eyebrow,
  title,
  description,
  children,
}: LegalPageProps) {
  return (
    <main className={styles.page}>
      <Container className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
        </header>
        <div className={styles.content}>{children}</div>
      </Container>
    </main>
  );
}

type LegalSectionProps = {
  title: string;
  children: ReactNode;
};

export function LegalSection({ title, children }: LegalSectionProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {children}
    </section>
  );
}
