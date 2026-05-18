import Image from "next/image";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { Button } from "@/components/ui/Button/Button";
import type { ActivityLocation } from "@/features/activities/types/activity";
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
      {locations.map((location) => (
        <article key={location.id} className={styles.card}>
          {location.image ? (
            <div className={styles.media}>
              <Image
                src={location.image}
                alt=""
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
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
