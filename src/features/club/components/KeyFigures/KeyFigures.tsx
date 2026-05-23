import { Container } from "@/components/ui/Container/Container";
import type { KeyFigure } from "@/types/content";
import styles from "./KeyFigures.module.css";

type KeyFiguresProps = {
  figures: KeyFigure[];
};

export function KeyFigures({ figures }: KeyFiguresProps) {
  return (
    <section aria-labelledby="figures-title" className={styles.section}>
      <Container>
        <h2 id="figures-title" className="sr-only">
          Chiffres cles
        </h2>
        <dl className={styles.grid}>
          {figures.map((figure) => (
            <div key={figure.label} className={styles.card}>
              <dt className={styles.label}>{figure.label}</dt>
              <dd className={styles.value}>{figure.value}</dd>
              <p className={styles.description}>{figure.description}</p>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
