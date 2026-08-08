import styles from "./EquipmentChips.module.css";

type EquipmentChipsProps = {
  items: string[];
  emphasized?: boolean;
};

/** Badges plats decrivant ce qu'offre un espace (gradins, eclairage, tables). */
export function EquipmentChips({
  items,
  emphasized = false,
}: EquipmentChipsProps) {
  return (
    <ul className={styles.list}>
      {items.map((item) => (
        <li
          key={item}
          className={
            emphasized ? `${styles.chip} ${styles.chipStrong}` : styles.chip
          }
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
