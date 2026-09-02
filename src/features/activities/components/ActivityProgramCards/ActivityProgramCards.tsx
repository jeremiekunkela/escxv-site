import type { CSSProperties } from "react";
import type { Program } from "@/features/activities/types/activity";
import styles from "./ActivityProgramCards.module.css";

type ActivityProgramCardsProps = {
  programs: Program[];
};

export function ActivityProgramCards({ programs }: ActivityProgramCardsProps) {
  return (
    <ul className={styles.list}>
      {programs.map((program, index) => (
        <li
          key={program.title}
          className={styles.item}
          data-reveal="fade-up"
          style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
        >
          <h3 className={styles.title}>{program.title}</h3>
          <p className={styles.description}>{program.description}</p>
        </li>
      ))}
    </ul>
  );
}
