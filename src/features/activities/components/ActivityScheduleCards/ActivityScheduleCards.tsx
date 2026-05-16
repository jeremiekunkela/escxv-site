import { Clock, MapPin } from "lucide-react";
import { capitalize, formatPublicLabel } from "@/lib/utils";
import type {
  ActivityLocation,
  ActivitySchedule,
} from "@/features/activities/types/activity";
import styles from "./ActivityScheduleCards.module.css";

type ActivityScheduleCardsProps = {
  schedules: ActivitySchedule[];
  locations: ActivityLocation[];
};

export function ActivityScheduleCards({ schedules, locations }: ActivityScheduleCardsProps) {
  if (schedules.length === 0) {
    return <p className={styles.empty}>Aucun creneau n&apos;est encore renseigne.</p>;
  }

  return (
    <div className={styles.list}>
      {schedules.map((schedule) => {
        const location = locations.find((item) => item.id === schedule.locationId);

        return (
          <article key={schedule.id} className={styles.card}>
            <div>
              <p className={styles.publics}>
                {schedule.publics.map((item) => formatPublicLabel(item)).join(", ")}
              </p>
              <h3 className={styles.title}>{schedule.tags.join(" - ")}</h3>
              {schedule.notes ? <p className={styles.notes}>{schedule.notes}</p> : null}
            </div>
            <div className={styles.meta}>
              <Clock aria-hidden="true" className={styles.icon} size={18} />
              <div>
                <p>{capitalize(schedule.day)}</p>
                <p className={styles.muted}>
                  {schedule.startTime} - {schedule.endTime}
                </p>
              </div>
            </div>
            <div className={styles.meta}>
              <MapPin aria-hidden="true" className={styles.icon} size={18} />
              <div>
                <p>{location?.name ?? "Lieu a confirmer"}</p>
                <p className={styles.muted}>
                  {location ? `${location.address}, ${location.postalCode} ${location.city}` : ""}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
