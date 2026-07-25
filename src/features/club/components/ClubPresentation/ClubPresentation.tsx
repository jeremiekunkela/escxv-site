import type { ClubPresentation as ClubPresentationContent } from "@/features/club/types/club";
import styles from "./ClubPresentation.module.css";

type ClubPresentationProps = {
  presentation: ClubPresentationContent;
};

export function ClubPresentation({ presentation }: ClubPresentationProps) {
  return (
    <div className={styles.block} data-reveal>
      <p className={styles.tagline}>{presentation.tagline}</p>
      <div className={styles.paragraphs}>
        {presentation.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)} className={styles.paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
