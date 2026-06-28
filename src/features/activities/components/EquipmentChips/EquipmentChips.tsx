import type { LocationEquipment } from "@/features/activities/types/activity";
import styles from "./EquipmentChips.module.css";

type EquipmentChipsProps = {
  equipments: LocationEquipment[];
  emphasized?: boolean;
};

export function EquipmentChips({
  equipments,
  emphasized = false,
}: EquipmentChipsProps) {
  return (
    <ul className={styles.list}>
      {equipments.map((equipment) => (
        <li
          key={equipment.label}
          className={
            emphasized ? `${styles.chip} ${styles.chipStrong}` : styles.chip
          }
          title={equipment.note ?? undefined}
        >
          {equipment.label}
          {equipment.note ? (
            <span className={styles.info} aria-hidden="true">
              {" "}
              ⓘ
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
