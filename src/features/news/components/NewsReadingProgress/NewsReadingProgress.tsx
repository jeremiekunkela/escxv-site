"use client";

import { useEffect, useState } from "react";
import styles from "./NewsReadingProgress.module.css";

type NewsReadingProgressProps = {
  /** Element dont la lecture est mesuree : le corps de l'article, lui seul. */
  targetId: string;
};

const clamp = (value: number) => Math.min(Math.max(value, 0), 1);

/**
 * Part lue de l'article, et non du document : le hero, la colonne laterale,
 * le carrousel « A lire aussi » et le pied de page ne se lisent pas. Mesurer
 * le document entier faisait finir l'article vers la moitie de la barre, et
 * d'autant plus sur telephone, ou ces blocs s'empilent au lieu de se ranger
 * en colonnes.
 *
 * La barre atteint 100 % quand la derniere ligne de l'article touche le bas
 * de l'ecran — le moment ou l'on a fini de lire, pas celui ou l'on a fini de
 * defiler.
 */
export function NewsReadingProgress({ targetId }: NewsReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const article = document.getElementById(targetId);

      if (!article) {
        return;
      }

      const { top, height } = article.getBoundingClientRect();
      const readHeight = window.innerHeight - top;

      setProgress(height > 0 ? clamp(readHeight / height) : 1);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, [targetId]);

  return (
    <div className={styles.track} aria-hidden="true">
      <div
        className={styles.bar}
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}
