import { Badge } from "@/components/ui/Badge/Badge";
import type { CSSProperties } from "react";
import type { Program } from "@/features/activities/types/activity";
import styles from "./ActivityProgramCards.module.css";

type ActivityProgramCardsProps = {
  programs: Program[];
};

export function ActivityProgramCards({ programs }: ActivityProgramCardsProps) {
  return (
    <div className={styles.grid}>
      {programs.map((program, index) => (
        <article
          key={program.title}
          className={styles.card}
          data-reveal="zoom"
          style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
        >
          <p className={styles.audience}>{program.audience}</p>
          <h3 className={styles.title}>{program.title}</h3>
          <p className={styles.description}>{program.description}</p>
          <ul className={styles.tags}>
            {program.tags.map((tag) => (
              <li key={tag}>
                <Badge>{tag}</Badge>
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
