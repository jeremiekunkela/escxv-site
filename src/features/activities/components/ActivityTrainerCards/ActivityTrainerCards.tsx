import Image from "next/image";
import { Clock3 } from "lucide-react";
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
            {trainer.photo ? (
              <div className={styles.media}>
                <Image
                  src={trainer.photo}
                  alt={fullName}
                  fill
                  sizes="104px"
                  className={styles.image}
                />
              </div>
            ) : null}

            <div className={styles.body}>
              <div className={styles.identity}>
                <p className={styles.eyebrow}>Entraineur</p>
                <h3 className={styles.name}>{fullName}</h3>
              </div>

              {trainer.description ? (
                <p className={styles.description}>{trainer.description}</p>
              ) : null}

              {trainer.specialties?.length ? (
                <ul className={styles.tags}>
                  {trainer.specialties.map((specialty) => (
                    <li key={specialty}>
                      <Badge>{specialty}</Badge>
                    </li>
                  ))}
                </ul>
              ) : null}

              {trainerSchedules.length > 0 ? (
                <div className={styles.scheduleRow}>
                  <p className={styles.scheduleTitle}>
                    <Clock3 aria-hidden="true" size={18} />
                    Horaires associes
                  </p>
                  <ul className={styles.scheduleList}>
                    {trainerSchedules.map((schedule) => (
                      <li key={schedule.id} className={styles.scheduleItem}>
                        {capitalize(schedule.day)} {formatHour(schedule.startTime)} -{" "}
                        {formatHour(schedule.endTime)}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </article>
        );
      })}
    </div>
  );
}
