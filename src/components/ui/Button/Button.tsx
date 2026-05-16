import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
};

export function Button({
  href,
  children,
  variant = "primary",
  type = "button",
  className,
  target,
  rel,
}: ButtonProps) {
  const classNames = cn(
    styles.button,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classNames} target={target} rel={rel}>
        <span className={styles.label}>{children}</span>
        <ArrowRight
          aria-hidden="true"
          size={18}
          strokeWidth={2.5}
          className={styles.icon}
        />
      </Link>
    );
  }

  return (
    <button type={type} className={classNames}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
