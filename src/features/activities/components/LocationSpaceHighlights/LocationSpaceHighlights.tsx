import type { LocationSpace } from "@/features/activities/types/activity";
import styles from "./LocationSpaceHighlights.module.css";

type LocationSpaceHighlightsProps = {
  spaces: LocationSpace[];
};

/**
 * Espaces ou la section pratique, au sein d'un meme lieu. Chaque espace est
 * autonome : son nom, ce qu'il est, et ce qu'il offre. Les commodites listees
 * sont celles de l'espace, jamais celles du site entier (pas de gradins pour
 * une salle de tennis de table).
 */
export function LocationSpaceHighlights({
  spaces,
}: LocationSpaceHighlightsProps) {
  return (
    <ul className={styles.list}>
      {spaces.map((space) => (
        <li key={space.id} className={styles.item}>
          <p className={styles.label}>{space.label}</p>
          {space.description ? (
            <p className={styles.description}>{space.description}</p>
          ) : null}
          {space.amenities && space.amenities.length > 0 ? (
            <ul className={styles.amenities}>
              {space.amenities.map((amenity) => (
                <li key={amenity} className={styles.amenity}>
                  {amenity}
                </li>
              ))}
            </ul>
          ) : null}
          {space.note ? <p className={styles.note}>{space.note}</p> : null}
        </li>
      ))}
    </ul>
  );
}
