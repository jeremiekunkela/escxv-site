import Image from "next/image";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import type { CSSProperties } from "react";
import { EquipmentChips } from "@/features/activities/components/EquipmentChips/EquipmentChips";
import type {
  ActivityLocation,
  LocationEquipment,
} from "@/features/activities/types/activity";
import { getActivityLocationAnchorId } from "@/features/activities/lib/activityRoutes";
import styles from "./ActivityLocationCards.module.css";

type ActivityLocationCardsProps = {
  locations: ActivityLocation[];
  activitySlug: string;
};

function isRelevantEquipment(
  equipment: LocationEquipment,
  activitySlug: string,
) {
  return Boolean(equipment.relatedActivitySlugs?.includes(activitySlug));
}

export function ActivityLocationCards({
  locations,
  activitySlug,
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
        const equipments = location.equipments ?? [];
        const relevantEquipments = equipments.filter((equipment) =>
          isRelevantEquipment(equipment, activitySlug),
        );
        const otherEquipments = equipments.filter(
          (equipment) => !isRelevantEquipment(equipment, activitySlug),
        );

        return (
          <article
            id={getActivityLocationAnchorId(location.id)}
            key={location.id}
            className={
              location.image
                ? styles.card
                : `${styles.card} ${styles.withoutMedia}`
            }
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
              {equipments.length > 0 ? (
                <div className={styles.equipmentGroups}>
                  {relevantEquipments.length > 0 ? (
                    <div className={styles.equipmentSection}>
                      <p className={styles.equipmentEyebrow}>
                        Équipement pour cette section
                      </p>
                      <EquipmentChips
                        equipments={relevantEquipments}
                        emphasized
                      />
                    </div>
                  ) : null}
                  {otherEquipments.length > 0 ? (
                    <div className={styles.equipmentSection}>
                      <p className={styles.equipmentEyebrow}>
                        {relevantEquipments.length > 0
                          ? "Autres équipements du lieu"
                          : "Équipement du lieu"}
                      </p>
                      <EquipmentChips equipments={otherEquipments} />
                    </div>
                  ) : null}
                </div>
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
