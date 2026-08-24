"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Button.module.css";

type ButtonProps = {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
  target?: "_blank" | "_self";
  rel?: string;
  icon?: "arrowLeft" | "arrowRight" | "none";
  dataActivityRegistrationSource?: string;
};

const iconByName = {
  arrowLeft: (
    <ArrowLeft
      aria-hidden="true"
      size={18}
      strokeWidth={2.5}
      className={cn(styles.icon, styles.iconLeft)}
    />
  ),
  arrowRight: (
    <ArrowRight
      aria-hidden="true"
      size={18}
      strokeWidth={2.5}
      className={styles.icon}
    />
  ),
  none: null,
} satisfies Record<NonNullable<ButtonProps["icon"]>, ReactNode>;

function scrollToCurrentPageAnchor(
  event: MouseEvent<HTMLAnchorElement>,
  href: string,
) {
  const isHashLink = href.startsWith("#");
  const target = isHashLink ? document.getElementById(href.slice(1)) : null;

  if (!target) {
    return;
  }

  event.preventDefault();
  window.history.pushState(null, "", href);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Button({
  href,
  children,
  variant = "primary",
  type = "button",
  disabled = false,
  className,
  target,
  rel,
  icon = "arrowRight",
  dataActivityRegistrationSource,
}: ButtonProps) {
  const classNames = cn(
    styles.button,
    variant === "primary" && styles.primary,
    variant === "secondary" && styles.secondary,
    variant === "ghost" && styles.ghost,
    className,
  );
  const iconElement = iconByName[icon];

  if (href) {
    return (
      <Link
        href={href}
        className={classNames}
        target={target}
        rel={rel}
        data-activity-registration-source={dataActivityRegistrationSource}
        onClick={(event) => scrollToCurrentPageAnchor(event, href)}
      >
        {icon === "arrowLeft" ? iconElement : null}
        <span className={styles.label}>{children}</span>
        {icon !== "arrowLeft" ? iconElement : null}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={classNames}
      disabled={disabled}
      data-activity-registration-source={dataActivityRegistrationSource}
    >
      {icon === "arrowLeft" ? iconElement : null}
      <span className={styles.label}>{children}</span>
      {icon !== "arrowLeft" ? iconElement : null}
    </button>
  );
}
