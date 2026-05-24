import Image from "next/image";
import { Award, Clock3, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/Badge/Badge";
import { capitalize } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { ActivitySchedule, ActivityTrainer } from "@/features/activities/types/activity";
import styles from "./ActivityTrainerCards.module.css";

type ActivityTrainerCardsProps = {
  trainers: ActivityTrainer[];
  schedules: ActivitySchedule[];
};

function formatHour(value: string) {
  return value.replace(":", "h");
}

function getInitials(trainer: ActivityTrainer) {
  return `${trainer.firstName.charAt(0)}${trainer.lastName.charAt(0)}`.toUpperCase();
}

export function ActivityTrainerCards({ trainers, schedules }: ActivityTrainerCardsProps) {
  if (trainers.length === 0) {
    return null;
  }

  return (
    <div className={styles.grid}>
      {trainers.map((trainer, index) => {
        const trainerSchedules = (trainer.scheduleIds ?? [])
          .map((scheduleId) => schedules.find((schedule) => schedule.id === scheduleId))
          .filter((schedule): schedule is ActivitySchedule => Boolean(schedule));
        const fullName = `${trainer.firstName} ${trainer.lastName}`;

        return (
          <article
            key={trainer.id}
            className={styles.card}
            data-reveal="zoom"
            style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
          >
            <div className={styles.media}>
              {trainer.photo ? (
                <Image
                  src={trainer.photo}
                  alt={fullName}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 960px) 50vw, 420px"
                  className={styles.image}
                />
              ) : (
                <div className={styles.placeholder} aria-hidden="true">
                  <UserRound size={44} />
                  <span>{getInitials(trainer)}</span>
                </div>
              )}
            </div>

            <div className={styles.body}>
              <header className={styles.identity}>
                <p className={styles.eyebrow}>Entraineur</p>
                <h3 className={styles.name}>{fullName}</h3>
              </header>

              {trainer.description ? (
                <p className={styles.description}>{trainer.description}</p>
              ) : null}

              {trainer.specialties?.length ? (
                <section
                  className={`${styles.detailGroup} ${styles.specialtiesGroup}`}
                  aria-labelledby={`${trainer.id}-specialties`}
                >
                  <p id={`${trainer.id}-specialties`} className={styles.detailTitle}>
                    <Award aria-hidden="true" size={18} />
                    Specialites
                  </p>
                  <ul className={styles.tags}>
                    {trainer.specialties.map((specialty) => (
                      <li key={specialty}>
                        <Badge>{specialty}</Badge>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {trainerSchedules.length > 0 ? (
                <section
                  className={`${styles.detailGroup} ${styles.slotsGroup}`}
                  aria-labelledby={`${trainer.id}-schedules`}
                >
                  <p id={`${trainer.id}-schedules`} className={styles.detailTitle}>
                    <Clock3 aria-hidden="true" size={18} />
                    Creneaux accompagnes
                  </p>
                  <ul className={styles.scheduleList}>
                    {trainerSchedules.map((schedule) => (
                      <li key={schedule.id} className={styles.scheduleItem}>
                        <span className={styles.scheduleDay}>
                          {capitalize(schedule.day)}
                        </span>
                        <span className={styles.scheduleMeta}>
                          {schedule.groupLabel ? (
                            <span className={styles.scheduleGroup}>
                              {schedule.groupLabel}
                            </span>
                          ) : null}
                          <span>
                            {formatHour(schedule.startTime)} - {formatHour(schedule.endTime)}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
