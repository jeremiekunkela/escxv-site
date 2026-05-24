"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ActivityDetailPage.module.css";

type ActivityFloatingRegistrationButtonProps = {
  href: string;
  label: string;
};

const HERO_SELECTOR = "[data-activity-detail-hero]";
const HERO_CTA_SELECTOR = "[data-activity-registration-source='primary']";

export function ActivityFloatingRegistrationButton({
  href,
  label,
}: ActivityFloatingRegistrationButtonProps) {
  const shellRef = useRef<HTMLDivElement>(null);
  const sourceRectRef = useRef<DOMRect | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hero = document.querySelector<HTMLElement>(HERO_SELECTOR);
    const source = document.querySelector<HTMLElement>(HERO_CTA_SELECTOR);

    if (!hero || !source) {
      const frame = window.requestAnimationFrame(() => setIsVisible(true));

      return () => {
        window.cancelAnimationFrame(frame);
      };
    }

    const updateState = () => {
      const heroRect = hero.getBoundingClientRect();
      const sourceRect = source.getBoundingClientRect();
      const shouldShowFloating = heroRect.bottom <= 0;

      if (!shouldShowFloating && sourceRect.width > 0 && sourceRect.height > 0) {
        sourceRectRef.current = sourceRect;
      }

      setIsVisible(shouldShowFloating);
    };

    const frame = window.requestAnimationFrame(updateState);

    window.addEventListener("scroll", updateState, { passive: true });
    window.addEventListener("resize", updateState);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateState);
      window.removeEventListener("resize", updateState);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const shell = shellRef.current;
    const sourceRect = sourceRectRef.current;

    if (!shell || !sourceRect) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      return undefined;
    }

    const targetRect = shell.getBoundingClientRect();
    const sourceCenterX = sourceRect.left + sourceRect.width / 2;
    const sourceCenterY = sourceRect.top + sourceRect.height / 2;
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const targetCenterY = targetRect.top + targetRect.height / 2;
    const scale = Math.min(1.12, Math.max(0.88, sourceRect.width / targetRect.width));

    const animation = shell.animate(
      [
        {
          opacity: 0,
          transform: `translate3d(${sourceCenterX - targetCenterX}px, ${
            sourceCenterY - targetCenterY
          }px, 0) scale(${scale})`,
        },
        {
          opacity: 1,
          transform: "translate3d(0, 0, 0) scale(1)",
        },
      ],
      {
        duration: 420,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    );

    return () => {
      animation.cancel();
    };
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div ref={shellRef} className={styles.floatingRegistration}>
      <Button href={href} className={styles.floatingRegistrationButton}>
        {label}
      </Button>
    </div>
  );
}
