import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import type { CSSProperties } from "react";
import type { ActivityLocation } from "@/features/activities/types/activity";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import styles from "./ActivityLocationCards.module.css";

type ActivityLocationCardsProps = {
  locations: ActivityLocation[];
};

export function ActivityLocationCards({ locations }: ActivityLocationCardsProps) {
  if (locations.length === 0) {
    return (
      <div className={styles.empty}>Les lieux de pratique ne sont pas encore renseignes.</div>
    );
  }

  return (
    <div className={styles.grid}>
      {locations.map((location, index) => (
        <article
          id={getActivityLocationAnchorId(location.id)}
          key={location.id}
          className={location.image ? styles.card : `${styles.card} ${styles.withoutMedia}`}
          data-reveal="zoom"
          style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
        >
          {location.image ? (
            <div className={styles.media}>
              <Image
                src={location.image}
                alt=""
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
            {location.description ? (
              <p className={styles.description}>{location.description}</p>
            ) : null}
            {location.tags?.length ? (
              <ul className={styles.tags}>
                {location.tags.map((tag) => (
                  <li key={tag}>
                    <Badge>{tag}</Badge>
                  </li>
                ))}
              </ul>
            ) : null}
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
                <Button href={location.mapUrl} target="_blank" rel="noreferrer">
                  Voir la carte
                </Button>
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
