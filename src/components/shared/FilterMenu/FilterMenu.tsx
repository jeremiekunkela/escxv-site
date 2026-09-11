"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import styles from "./FilterMenu.module.css";

export type FilterOption<Value extends string> = {
  value: Value;
  label: string;
};

type FilterMenuProps<Value extends string> = {
  label: string;
  options: FilterOption<Value>[];
  selected: Value[];
  onToggle: (value: Value) => void;
  onClear: () => void;
};

/**
 * Critere de filtre repliable : un bouton qui porte son nombre de choix, et
 * un panneau de cases a cocher. Des criteres etales en pastilles tenaient
 * des dizaines de boutons a l'ecran avant le premier resultat — le panneau
 * rend cette place a la liste, et le compteur dit ce qui est actif sans
 * l'ouvrir.
 */
export function FilterMenu<Value extends string>({
  label,
  options,
  selected,
  onToggle,
  onClear,
}: FilterMenuProps<Value>) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  /**
   * Fermeture au clic exterieur et a Echap, comme le menu de l'en-tete : un
   * panneau ouvert masque les activites qu'il sert a trouver.
   */
  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const hasSelection = selected.length > 0;

  return (
    <div className={styles.menu} ref={menuRef}>
      <button
        type="button"
        className={
          hasSelection
            ? `${styles.trigger} ${styles.triggerActive}`
            : styles.trigger
        }
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((current) => !current)}
      >
        {label}
        {hasSelection ? (
          <span key={selected.length} className={styles.badge}>
            {selected.length}
          </span>
        ) : null}
        <ChevronDown
          aria-hidden="true"
          className={isOpen ? styles.chevronOpen : styles.chevron}
          size={16}
        />
      </button>

      {isOpen ? (
        <div id={panelId} className={styles.panel}>
          <div className={styles.options}>
            {options.map((option) => (
              <label key={option.value} className={styles.option}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={selected.includes(option.value)}
                  onChange={() => onToggle(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>

          {hasSelection ? (
            <button type="button" className={styles.clear} onClick={onClear}>
              Tout décocher
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
