import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
  icon?: "arrowLeft" | "arrowRight" | "none";
};

export function Button({
  href,
  children,
  variant = "primary",
  type = "button",
  className,
  target,
  rel,
  icon = "arrowRight",
}: ButtonProps) {
  const classNames = cn(
    styles.button,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    className,
  );
  const iconElement =
    icon === "none" ? null : icon === "arrowLeft" ? (
      <ArrowLeft
        aria-hidden="true"
        size={18}
        strokeWidth={2.5}
        className={cn(styles.icon, styles.iconLeft)}
      />
    ) : (
      <ArrowRight
        aria-hidden="true"
        size={18}
        strokeWidth={2.5}
        className={styles.icon}
      />
    );

  if (href) {
    return (
      <Link href={href} className={classNames} target={target} rel={rel}>
        {icon === "arrowLeft" ? iconElement : null}
        <span className={styles.label}>{children}</span>
        {icon !== "arrowLeft" ? iconElement : null}
      </Link>
    );
  }

  return (
    <button type={type} className={classNames}>
      {icon === "arrowLeft" ? iconElement : null}
      <span className={styles.label}>{children}</span>
      {icon !== "arrowLeft" ? iconElement : null}
    </button>
  );
}
