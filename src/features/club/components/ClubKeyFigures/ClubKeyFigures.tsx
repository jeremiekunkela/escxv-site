import { Container } from "@/components/ui/Container/Container";
import type { CSSProperties } from "react";
import type { KeyFigure } from "@/types/content";
import styles from "./ClubKeyFigures.module.css";

type ClubKeyFiguresProps = {
  figures: KeyFigure[];
};

export function ClubKeyFigures({ figures }: ClubKeyFiguresProps) {
  return (
    <section aria-labelledby="figures-title" className={styles.section}>
      <Container>
        <h2 id="figures-title" className="sr-only">
          Chiffres cles
        </h2>
        <dl className={styles.grid}>
          {figures.map((figure, index) => (
            <div
              key={figure.label}
              className={styles.card}
              data-reveal="zoom"
              style={{ "--reveal-delay": `${index * 80}ms` } as CSSProperties}
            >
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
