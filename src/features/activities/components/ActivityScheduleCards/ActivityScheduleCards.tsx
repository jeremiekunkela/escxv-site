import { Clock, MapPin, Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import { capitalize, formatPublicLabel } from "@/lib/utils";
import type {
  ActivityLocation,
  ActivitySchedule,
  DayOfWeek,
  PracticeGroup,
  ScheduleType,
} from "@/features/activities/types/activity";
import { getActivityLocationAnchorHref } from "@/features/activities/lib/activityRoutes";
import styles from "./ActivityScheduleCards.module.css";

type ActivityScheduleCardsProps = {
  schedules: ActivitySchedule[];
  practiceGroups: PracticeGroup[];
  locations: ActivityLocation[];
};

const DAY_ORDER: DayOfWeek[] = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
];

const TYPE_SECTIONS: { type: ScheduleType; label: string }[] = [
  { type: "training", label: "Entrainements" },
  { type: "match", label: "Matchs & competition" },
];

const GENDER_LABELS: Record<PracticeGroup["gender"], string | null> = {
  mixte: null,
  feminin: "Feminin",
  masculin: "Masculin",
};

const DEFAULT_SCHEDULE_LABEL = "Horaire a confirmer";

function formatHour(value: string) {
  return value.replace(":", "h");
}

function getDayRank(day?: DayOfWeek) {
  const index = day ? DAY_ORDER.indexOf(day) : -1;
  return index === -1 ? DAY_ORDER.length : index;
}

function compareSchedules(left: ActivitySchedule, right: ActivitySchedule) {
  const dayDelta = getDayRank(left.day) - getDayRank(right.day);
  return dayDelta !== 0
    ? dayDelta
    : (left.startTime ?? "").localeCompare(right.startTime ?? "");
}

function formatScheduleLabel(schedule: ActivitySchedule) {
  const dayLabel = schedule.day ? capitalize(schedule.day) : "";
  const { startTime, endTime } = schedule;
  const range =
    startTime && endTime ? `${formatHour(startTime)} - ${formatHour(endTime)}` : null;

  if (range) {
    return dayLabel ? `${dayLabel} : ${range}` : range;
  }

  const fallback = schedule.notes?.trim() || DEFAULT_SCHEDULE_LABEL;
  return dayLabel ? `${dayLabel} : ${fallback}` : fallback;
}

function shouldDisplayScheduleNotes(schedule: ActivitySchedule) {
  return Boolean(schedule.notes?.trim() && schedule.startTime && schedule.endTime);
}

function formatBirthYears(group: PracticeGroup) {
  const { birthYearMin, birthYearMax } = group;
  if (birthYearMin && birthYearMax) return `${birthYearMin} - ${birthYearMax}`;
  if (birthYearMax) return `Avant ${birthYearMax + 1}`;
  if (birthYearMin) return `${birthYearMin} et avant`;
  return null;
}

function getGroupBadges(group: PracticeGroup) {
  return [formatPublicLabel(group.public), GENDER_LABELS[group.gender], formatBirthYears(group)].filter(
    (value): value is string => Boolean(value),
  );
}

function groupSchedulesByLocation(schedules: ActivitySchedule[]) {
  return Array.from(
    [...schedules].sort(compareSchedules).reduce(
      (items, schedule) =>
        items.set(schedule.locationId, [
          ...(items.get(schedule.locationId) ?? []),
          schedule,
        ]),
      new Map<string, ActivitySchedule[]>(),
    ),
  );
}

function buildOrderedGroups(
  schedules: ActivitySchedule[],
  practiceGroups: PracticeGroup[],
) {
  const schedulesByGroup = schedules.reduce(
    (groups, schedule) =>
      groups.set(schedule.practiceGroupId, [
        ...(groups.get(schedule.practiceGroupId) ?? []),
        schedule,
      ]),
    new Map<string, ActivitySchedule[]>(),
  );

  return [...practiceGroups]
    .sort((left, right) => left.sortOrder - right.sortOrder)
    .map((group) => ({ group, groupSchedules: schedulesByGroup.get(group.id) ?? [] }))
    .filter((entry) => entry.groupSchedules.length > 0);
}

export function ActivityScheduleCards({
  schedules,
  practiceGroups,
  locations,
}: ActivityScheduleCardsProps) {
  if (schedules.length === 0) {
    return <p className={styles.empty}>Aucun creneau n&apos;est encore renseigne.</p>;
  }

  const locationsById = new Map(locations.map((location) => [location.id, location]));
  const orderedGroups = buildOrderedGroups(schedules, practiceGroups);

  return (
    <div className={styles.list}>
      {orderedGroups.map(({ group, groupSchedules }, index) => {
        const badges = getGroupBadges(group);

        return (
          <article
            key={group.id}
            className={styles.card}
            data-reveal="zoom"
            style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
          >
            <div className={styles.header}>
              <p className={styles.eyebrow}>Groupe de pratique</p>
              <h3 className={styles.title}>{group.label}</h3>
              {badges.length > 0 ? (
                <div className={styles.badges} aria-label="Public et categorie">
                  {badges.map((badge) => (
                    <span key={badge} className={styles.badge}>
                      {badge}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            {TYPE_SECTIONS.map(({ type, label }) => {
              const typeSchedules = groupSchedules.filter(
                (schedule) => schedule.type === type,
              );

              if (typeSchedules.length === 0) {
                return null;
              }

              const SectionIcon = type === "training" ? Clock : Trophy;
              const schedulesByLocation = groupSchedulesByLocation(typeSchedules);

              return (
                <div key={type} className={styles.schedules}>
                  <h4 className={styles.sectionTitle}>
                    <SectionIcon aria-hidden="true" className={styles.sectionIcon} size={20} />
                    {label}
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
                                <p className={styles.slotLabel}>
                                  {formatScheduleLabel(schedule)}
                                </p>
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
              );
            })}
          </article>
        );
      })}
    </div>
  );
}
