import { Clock, MapPin } from "lucide-react";
import { capitalize, formatPublicLabel } from "@/lib/utils";
import type {
  ActivityLocation,
  ActivityPublic,
  ActivitySchedule,
} from "@/features/activities/types/activity";
import styles from "./ActivityScheduleCards.module.css";

type ActivityScheduleCardsProps = {
  schedules: ActivitySchedule[];
  locations: ActivityLocation[];
};

const PUBLIC_ORDER: ActivityPublic[] = ["enfants", "adolescents", "adultes"];

type ScheduleGroup = {
  key: string;
  publics: ActivityPublic[];
  schedules: ActivitySchedule[];
};

function sortPublics(publics: ActivityPublic[]) {
  return [...publics].sort(
    (left, right) => PUBLIC_ORDER.indexOf(left) - PUBLIC_ORDER.indexOf(right),
  );
}

function getPublicGroupKey(publics: ActivityPublic[]) {
  return sortPublics(publics).join("|");
}

function formatHour(value: string) {
  return value.replace(":", "h");
}

function groupSchedulesByPublic(schedules: ActivitySchedule[]) {
  return Array.from(
    schedules
      .reduce((groups, schedule) => {
        const key = getPublicGroupKey(schedule.publics);
        const group = groups.get(key) ?? {
          key,
          publics: sortPublics(schedule.publics),
          schedules: [],
        };

        group.schedules.push(schedule);
        return groups.set(key, group);
      }, new Map<string, ScheduleGroup>())
      .values(),
  );
}

function groupSchedulesByLocation(schedules: ActivitySchedule[]) {
  return Array.from(
    schedules.reduce(
      (items, schedule) =>
        items.set(schedule.locationId, [
          ...(items.get(schedule.locationId) ?? []),
          schedule,
        ]),
      new Map<string, ActivitySchedule[]>(),
    ),
  );
}

export function ActivityScheduleCards({ schedules, locations }: ActivityScheduleCardsProps) {
  if (schedules.length === 0) {
    return <p className={styles.empty}>Aucun creneau n&apos;est encore renseigne.</p>;
  }

  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const groupedSchedules = groupSchedulesByPublic(schedules);

  return (
    <div className={styles.list}>
      {groupedSchedules.map((group) => {
        const groupLabels = Array.from(
          new Set(
            group.schedules.flatMap((schedule) =>
              schedule.groupLabel?.trim() ? [schedule.groupLabel.trim()] : [],
            ),
          ),
        );

        const schedulesByLocation = groupSchedulesByLocation(group.schedules);

        return (
          <article key={group.key} className={styles.card}>
            <div className={styles.header}>
              <p className={styles.publics}>Groupe</p>
              <h3 className={styles.title}>
                {group.publics.map((item) => formatPublicLabel(item)).join(", ")}
              </h3>
              {groupLabels.length > 0 ? (
                <p className={styles.notes}>{groupLabels.join(" • ")}</p>
              ) : null}
            </div>

            <div className={styles.schedules}>
              <h4 className={styles.sectionTitle}>
                <Clock aria-hidden="true" className={styles.sectionIcon} size={20} />
                Horaires
              </h4>

              <div className={styles.scheduleGroups}>
                {schedulesByLocation.map(([locationId, locationSchedules]) => {
                  const location = locationsById.get(locationId);

                  return (
                    <section key={locationId} className={styles.schedule}>
                      <div className={styles.scheduleHeader}>
                        <MapPin aria-hidden="true" className={styles.icon} size={18} />
                        <div>
                          <h5 className={styles.venueTitle}>
                            {location?.name ?? "Lieu a confirmer"}
                          </h5>
                          <p className={styles.address}>
                            {location
                              ? `${location.address}, ${location.postalCode} ${location.city}`
                              : ""}
                          </p>
                        </div>
                      </div>

                      <ul className={styles.slotList}>
                        {locationSchedules.map((schedule) => (
                          <li key={schedule.id} className={styles.slot}>
                            <p className={styles.slotLabel}>
                              {capitalize(schedule.day)} : {formatHour(schedule.startTime)} -{" "}
                              {formatHour(schedule.endTime)}
                            </p>
                            {schedule.notes ? (
                              <p className={styles.slotNotes}>{schedule.notes}</p>
                            ) : null}
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
