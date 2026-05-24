import Image from "next/image";
import type { CSSProperties } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import type { Cta } from "@/types/content";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  badges?: string[];
  enableRegistrationHandoff?: boolean;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  imageUrl,
  primaryCta,
  secondaryCta,
  badges = [],
  enableRegistrationHandoff = false,
}: HeroSectionProps) {
  return (
    <section
      className={styles.hero}
      data-activity-detail-hero={enableRegistrationHandoff ? true : undefined}
    >
      <Image
        src={imageUrl}
        alt=""
        fill
        priority
        sizes="100vw"
        className={styles.image}
      />
      <div className={styles.scrim} />
      <Container className={styles.inner}>
        <div className={styles.content}>
          <p className={styles.eyebrow} data-reveal="zoom">
            {eyebrow}
          </p>
          <h1
            className={styles.title}
            data-reveal
            style={{ "--reveal-delay": "90ms" } as CSSProperties}
          >
            {title}
          </h1>
          <p
            className={styles.description}
            data-reveal
            style={{ "--reveal-delay": "160ms" } as CSSProperties}
          >
            {description}
          </p>
          <div
            className={styles.actions}
            data-reveal
            style={{ "--reveal-delay": "230ms" } as CSSProperties}
          >
            <Button
              href={primaryCta.href}
              className={styles.primaryAction}
              dataActivityRegistrationSource={
                enableRegistrationHandoff ? "primary" : undefined
              }
            >
              {primaryCta.label}
            </Button>
            {secondaryCta ? (
              <Button
                href={secondaryCta.href}
                variant="secondary"
                className={styles.secondaryAction}
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
          {badges.length > 0 ? (
            <ul className={styles.badges} data-reveal="fade">
              {badges.map((badge, index) => (
                <li
                  key={badge}
                  className={styles.badge}
                  style={
                    { "--badge-delay": `${320 + index * 60}ms` } as CSSProperties
                  }
                >
                  {badge}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
