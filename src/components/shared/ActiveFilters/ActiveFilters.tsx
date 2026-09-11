"use client";

import { X } from "lucide-react";
import type { CSSProperties } from "react";
import styles from "./ActiveFilters.module.css";

export type ActiveFilter<Key extends string = string> = {
  key: Key;
  value: string;
  label: string;
};

type ActiveFiltersProps<Key extends string> = {
  filters: ActiveFilter<Key>[];
  onRemove: (key: Key, value: string) => void;
  onClear: () => void;
};

/**
 * Rappel de ce qui est coche, critere par critere. Les compteurs des boutons
 * disent combien, ces etiquettes disent quoi — et se retirent une a une, sans
 * rouvrir le panneau ou la case a ete cochee.
 */
export function ActiveFilters<Key extends string>({
  filters,
  onRemove,
  onClear,
}: ActiveFiltersProps<Key>) {
  return filters.length > 0 ? (
    <div className={styles.chips}>
      {filters.map((filter, index) => (
        <button
          key={`${filter.key}-${filter.value}`}
          type="button"
          className={styles.chip}
          style={{ "--chip-delay": `${index * 40}ms` } as CSSProperties}
          onClick={() => onRemove(filter.key, filter.value)}
        >
          {filter.label}
          <X aria-hidden="true" size={14} />
          <span className="sr-only">Retirer ce filtre</span>
        </button>
      ))}

      <button type="button" className={styles.clearAll} onClick={onClear}>
        Tout effacer
      </button>
    </div>
  ) : null;
}
