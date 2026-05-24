import { Clock, MapPin } from "lucide-react";
import type { CSSProperties } from "react";
import { capitalize, formatPublicLabel } from "@/lib/utils";
import type {
  ActivityLocation,
  ActivityPublic,
  ActivitySchedule,
} from "@/features/activities/types/activity";
import { getActivityLocationAnchorHref } from "@/features/activities/lib/activityRoutes";
import styles from "./ActivityScheduleCards.module.css";

type ActivityScheduleCardsProps = {
  schedules: ActivitySchedule[];
  locations: ActivityLocation[];
};

const PUBLIC_ORDER: ActivityPublic[] = ["enfants", "adolescents", "adultes"];

type ScheduleGroup = {
  key: string;
  label: string;
  schedules: ActivitySchedule[];
};

const DEFAULT_GROUP_LABEL = "Groupe de pratique a confirmer";
const DEFAULT_SCHEDULE_LABEL = "Horaire a confirmer";

function sortPublics(publics: ActivityPublic[]) {
  return [...publics].sort(
    (left, right) => PUBLIC_ORDER.indexOf(left) - PUBLIC_ORDER.indexOf(right),
  );
}

function getUniquePublics(schedules: ActivitySchedule[]) {
  return sortPublics(Array.from(new Set(schedules.flatMap((schedule) => schedule.publics))));
}

function formatHour(value: string) {
  return value.replace(":", "h");
}

function getScheduleGroupLabel(schedule: ActivitySchedule) {
  return schedule.groupLabel?.trim() || DEFAULT_GROUP_LABEL;
}

function formatScheduleLabel(schedule: ActivitySchedule) {
  const day = typeof schedule.day === "string" ? schedule.day.trim() : "";
  const startTime = typeof schedule.startTime === "string" ? schedule.startTime.trim() : "";
  const endTime = typeof schedule.endTime === "string" ? schedule.endTime.trim() : "";
  const dayLabel = day ? capitalize(day) : DEFAULT_SCHEDULE_LABEL;

  if (startTime && endTime) {
    return `${dayLabel} : ${formatHour(startTime)} - ${formatHour(endTime)}`;
  }

  const fallback = schedule.notes?.trim() || DEFAULT_SCHEDULE_LABEL;
  return day ? `${dayLabel} : ${fallback}` : fallback;
}

function shouldDisplayScheduleNotes(schedule: ActivitySchedule) {
  const startTime = typeof schedule.startTime === "string" ? schedule.startTime.trim() : "";
  const endTime = typeof schedule.endTime === "string" ? schedule.endTime.trim() : "";

  return Boolean(schedule.notes?.trim() && startTime && endTime);
}

function groupSchedulesByPracticeGroup(schedules: ActivitySchedule[]) {
  return Array.from(
    schedules
      .reduce((groups, schedule) => {
        const label = getScheduleGroupLabel(schedule);
        const key = label;
        const group = groups.get(key) ?? {
          key,
          label,
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
  const groupedSchedules = groupSchedulesByPracticeGroup(schedules);

  return (
    <div className={styles.list}>
      {groupedSchedules.map((group, index) => {
        const publics = getUniquePublics(group.schedules);
        const schedulesByLocation = groupSchedulesByLocation(group.schedules);

        return (
          <article
            key={group.key}
            className={styles.card}
            data-reveal="zoom"
            style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
          >
            <div className={styles.header}>
              <p className={styles.eyebrow}>Groupe de pratique</p>
              <h3 className={styles.title}>{group.label}</h3>
              {publics.length > 0 ? (
                <div className={styles.badges} aria-label="Publics">
                  {publics.map((item) => (
                    <span key={item} className={styles.badge}>
                      {formatPublicLabel(item)}
                    </span>
                  ))}
                </div>
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
                        <div className={styles.locationSummary}>
                          <h5 className={styles.venueTitle}>
                            {location?.name ?? "Lieu a confirmer"}
                          </h5>
                          <p className={styles.address}>
                            {location
                              ? `${location.address}, ${location.postalCode} ${location.city}`
                            : ""}
                          </p>
                        </div>
                        {location ? (
                          <a
                            className={styles.locationButton}
                            href={getActivityLocationAnchorHref(location.id)}
                            aria-label={`Voir le lieu de pratique ${location.name}`}
                          >
                            <MapPin aria-hidden="true" size={15} />
                            <span>Voir le lieu</span>
                          </a>
                        ) : null}
                      </div>

                      <ul className={styles.slotList}>
                        {locationSchedules.map((schedule) => (
                          <li key={schedule.id} className={styles.slot}>
                            <p className={styles.slotLabel}>{formatScheduleLabel(schedule)}</p>
                            {shouldDisplayScheduleNotes(schedule) ? (
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
