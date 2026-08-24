import { ChevronDown, Clock, MapPin, Trophy } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { capitalize, formatPublicLabel } from "@/lib/utils";
import type {
  ActivityPracticeLocation,
  ActivitySchedule,
  LocationSpace,
  PracticeGroup,
  ScheduleType,
} from "@/features/activities/types/activity";
import { getActivityLocationAnchorHref } from "@/features/activities/lib/activityRoutes";
import {
  formatDayShort,
  getDayRank,
  getDistinctDays,
} from "@/features/activities/lib/days";
import styles from "./ActivityScheduleCards.module.css";

type Venue = {
  location: ActivityPracticeLocation;
  space: LocationSpace;
};

type ActivityScheduleCardsProps = {
  schedules: ActivitySchedule[];
  practiceGroups: PracticeGroup[];
  locations: ActivityPracticeLocation[];
};

const TYPE_SECTIONS: { type: ScheduleType; label: string }[] = [
  { type: "training", label: "Entraînements" },
  { type: "match", label: "Matchs & compétition" },
];

const GENDER_LABELS: Record<PracticeGroup["gender"], string | null> = {
  mixte: null,
  feminin: "Féminin",
  masculin: "Masculin",
};

const DEFAULT_SCHEDULE_LABEL = "Horaire à confirmer";

/** Cle de repli pour un creneau dont l'espace n'est pas encore connu. */
const UNKNOWN_SPACE = "espace-a-confirmer";

/**
 * Au-dela de ce nombre de groupes, la liste deroulee s'etale sur plusieurs
 * ecrans : impossible de voir les groupes ensemble, donc de reperer le sien.
 * Replier les transforme en index lisible d'un coup d'oeil. En deca, les
 * groupes tiennent deja dans un ecran ou deux et replier ne gagnerait rien.
 */
const COLLAPSIBLE_GROUPS_THRESHOLD = 4;

function formatHour(value: string) {
  return value.replace(":", "h");
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
  // Un groupe d'une seule annee (U10, U14) : « 2016 » et non « 2016 - 2016 ».
  if (birthYearMin && birthYearMin === birthYearMax) return `${birthYearMin}`;
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

/**
 * Ce qu'un groupe replie doit dire sans etre ouvert : quels jours, combien de
 * creneaux. Avec les badges d'age qui l'accompagnent, la barre repliee porte
 * de quoi reconnaitre son groupe — c'est le service qu'un filtre par annee de
 * naissance rendrait, sans exclure les groupes adultes qui n'en ont pas.
 */
function formatGroupRecap(schedules: ActivitySchedule[]) {
  const days = getDistinctDays(schedules).map(formatDayShort).join(" · ");
  const count = `${schedules.length} créneau${schedules.length > 1 ? "x" : ""}`;

  return days ? `${days} — ${count}` : count;
}

/**
 * Regroupement par espace et non par lieu : deux creneaux d'un meme centre
 * sportif qui se tiennent dans deux salles differentes restent distincts.
 */
function groupSchedulesBySpace(schedules: ActivitySchedule[]) {
  return Array.from(
    [...schedules].sort(compareSchedules).reduce(
      (items, schedule) =>
        items.set(schedule.spaceId ?? UNKNOWN_SPACE, [
          ...(items.get(schedule.spaceId ?? UNKNOWN_SPACE) ?? []),
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

type ScheduleVenueProps = {
  venue?: Venue;
};

function ScheduleVenue({ venue }: ScheduleVenueProps) {
  const location = venue?.location;

  return (
    <div className={styles.scheduleHeader}>
      <MapPin aria-hidden="true" className={styles.icon} size={18} />
      <div className={styles.locationSummary}>
        <h5 className={styles.venueTitle}>
          {location?.name ?? "Lieu à confirmer"}
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
  );
}

/**
 * Espace unique a toute la section : le football tenait seize fois la meme
 * adresse, une par couple groupe/type, soit deux ecrans mobiles de repetition
 * pure. On l'annonce alors une seule fois, au-dessus des groupes.
 *
 * Des que la section pratique dans deux espaces, l'adresse redevient une
 * information qui distingue les creneaux : elle retourne dans chaque carte.
 */
function getSharedVenue(
  schedules: ActivitySchedule[],
  venueBySpaceId: Map<string, Venue>,
) {
  const spaceIds = new Set(schedules.map((schedule) => schedule.spaceId));

  return spaceIds.size === 1
    ? venueBySpaceId.get([...spaceIds][0] ?? "")
    : undefined;
}

type ScheduleGroupHeaderProps = {
  group: PracticeGroup;
  recap: string | null;
};

function ScheduleGroupHeader({ group, recap }: ScheduleGroupHeaderProps) {
  const badges = getGroupBadges(group);

  return (
    <div className={styles.header}>
      <h3 className={styles.title}>{group.label}</h3>
      {badges.length > 0 ? (
        <div className={styles.badges} aria-label="Public et catégorie">
          {badges.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
      ) : null}
      {recap ? <p className={styles.recap}>{recap}</p> : null}
    </div>
  );
}

type ScheduleGroupBodyProps = {
  groupSchedules: ActivitySchedule[];
  venueBySpaceId: Map<string, Venue>;
  sharedVenue?: Venue;
};

function ScheduleGroupBody({
  groupSchedules,
  venueBySpaceId,
  sharedVenue,
}: ScheduleGroupBodyProps) {
  return (
    <>
      {TYPE_SECTIONS.map(({ type, label }) => {
        const typeSchedules = groupSchedules.filter(
          (schedule) => schedule.type === type,
        );

        if (typeSchedules.length === 0) {
          return null;
        }

        const SectionIcon = type === "training" ? Clock : Trophy;
        const schedulesBySpace = groupSchedulesBySpace(typeSchedules);

        return (
          <div key={type} className={styles.schedules}>
            <h4 className={styles.sectionTitle}>
              <SectionIcon aria-hidden="true" className={styles.sectionIcon} size={20} />
              {label}
            </h4>

            <div className={styles.scheduleGroups}>
              {schedulesBySpace.map(([spaceId, locationSchedules]) => (
                <section key={spaceId} className={styles.schedule}>
                  {sharedVenue ? null : (
                    <ScheduleVenue venue={venueBySpaceId.get(spaceId)} />
                  )}

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
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

type ScheduleGroupCardProps = ScheduleGroupBodyProps & {
  group: PracticeGroup;
  collapsible: boolean;
  index: number;
};

/**
 * `details` natif plutot qu'un etat React : le contenu reste dans le document,
 * donc indexable et trouvable par la recherche du navigateur, et le repli
 * fonctionne sans hydratation sur un site entierement pre-rendu.
 */
function ScheduleGroupCard({
  group,
  collapsible,
  index,
  ...bodyProps
}: ScheduleGroupCardProps): ReactNode {
  const style = { "--reveal-delay": `${index * 70}ms` } as CSSProperties;
  const body = <ScheduleGroupBody {...bodyProps} />;

  return collapsible ? (
    <details
      className={`${styles.card} ${styles.collapsible}`}
      data-reveal="zoom"
      style={style}
    >
      <summary className={styles.summary}>
        <ScheduleGroupHeader
          group={group}
          recap={formatGroupRecap(bodyProps.groupSchedules)}
        />
        <ChevronDown aria-hidden="true" className={styles.chevron} size={22} />
      </summary>
      <div className={styles.body}>{body}</div>
    </details>
  ) : (
    <article className={styles.card} data-reveal="zoom" style={style}>
      <ScheduleGroupHeader group={group} recap={null} />
      {body}
    </article>
  );
}

export function ActivityScheduleCards({
  schedules,
  practiceGroups,
  locations,
}: ActivityScheduleCardsProps) {
  if (schedules.length === 0) {
    return <p className={styles.empty}>Aucun créneau n&apos;est encore renseigné.</p>;
  }

  const venueBySpaceId = new Map(
    locations.flatMap((location) =>
      location.spaces.map((space) => [space.id, { location, space }] as const),
    ),
  );
  const orderedGroups = buildOrderedGroups(schedules, practiceGroups);
  const sharedVenue = getSharedVenue(schedules, venueBySpaceId);
  const collapsible = orderedGroups.length > COLLAPSIBLE_GROUPS_THRESHOLD;

  return (
    <div className={styles.list}>
      {sharedVenue ? (
        <div className={styles.sharedVenue} data-reveal="zoom">
          <p className={styles.sharedVenueEyebrow}>
            Tous les créneaux ont lieu ici
          </p>
          <ScheduleVenue venue={sharedVenue} />
        </div>
      ) : null}
      {orderedGroups.map(({ group, groupSchedules }, index) => (
        <ScheduleGroupCard
          key={group.id}
          group={group}
          groupSchedules={groupSchedules}
          venueBySpaceId={venueBySpaceId}
          sharedVenue={sharedVenue}
          collapsible={collapsible}
          index={index}
        />
      ))}
    </div>
  );
}
