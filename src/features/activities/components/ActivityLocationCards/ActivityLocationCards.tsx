import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import type { CSSProperties } from "react";
import { LocationSpaceHighlights } from "@/features/activities/components/LocationSpaceHighlights/LocationSpaceHighlights";
import type { ActivityPracticeLocation } from "@/features/activities/types/activity";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import styles from "./ActivityLocationCards.module.css";

type ActivityLocationCardsProps = {
  locations: ActivityPracticeLocation[];
};

/**
 * La photo suit la section : on montre l'espace ou elle pratique plutot que
 * la vue generale du site (le yoga voit la salle, pas la piste). A defaut de
 * photo d'espace, la photo du lieu.
 */
function getMedia(location: ActivityPracticeLocation) {
  const illustratedSpace = location.spaces.find((space) => space.image);

  return illustratedSpace?.image
    ? { src: illustratedSpace.image, alt: illustratedSpace.label }
    : location.image
      ? { src: location.image, alt: "" }
      : null;
}

export function ActivityLocationCards({
  locations,
}: ActivityLocationCardsProps) {
  if (locations.length === 0) {
    return (
      <div className={styles.empty}>
        Les lieux de pratique ne sont pas encore renseignés.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {locations.map((location, index) => {
        const media = getMedia(location);

        return (
          <article
            id={getActivityLocationAnchorId(location.id)}
            key={location.id}
            className={
              media ? styles.card : `${styles.card} ${styles.withoutMedia}`
            }
            data-reveal="zoom"
            style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
          >
            {media ? (
              <div className={styles.media}>
                <Image
                  src={media.src}
                  alt={media.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 360px"
                  className={styles.image}
                />
              </div>
            ) : null}
            <div className={styles.body}>
              <p className={styles.city}>
                <MapPin aria-hidden="true" size={16} />
                {location.city}
              </p>
              <h3 className={styles.title}>{location.name}</h3>
              <p className={styles.address}>
                {location.address}, {location.postalCode} {location.city}
              </p>
              <LocationSpaceHighlights spaces={location.spaces} />
              {location.mapEmbedUrl ? (
                <div className={styles.mapEmbed}>
                  <iframe
                    src={location.mapEmbedUrl}
                    title={`Carte - ${location.name}`}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className={styles.mapLink}>
                  <Button
                    href={location.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Voir la carte
                  </Button>
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
