import { cn } from "@/lib/utils";
import styles from "./Badge.module.css";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "neutral" | "brand";
};

export function Badge({ children, variant = "neutral" }: BadgeProps) {
  return (
    <span className={cn(styles.badge, variant === "brand" && styles.brand)}>
      {children}
    </span>
  );
}
