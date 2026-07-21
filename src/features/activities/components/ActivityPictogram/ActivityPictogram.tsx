import type { ActivityIconName } from "@/features/activities/lib/activityIcons";
import { cn } from "@/lib/utils";
import styles from "./ActivityPictogram.module.css";

type ActivityPictogramProps = {
  iconName: ActivityIconName;
  size?: "sm" | "md";
  /** Permet au parent d'ajouter ses propres etats (hover, focus...). */
  className?: string;
};

/** Pictogramme Material Symbols d'une activite, dans sa pastille. */
export function ActivityPictogram({
  iconName,
  size = "sm",
  className,
}: ActivityPictogramProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(styles.pictogram, size === "md" && styles.md, className)}
    >
      {iconName}
    </span>
  );
}
