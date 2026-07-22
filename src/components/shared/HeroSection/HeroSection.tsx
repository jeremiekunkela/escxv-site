import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import type { Cta } from "@/types/content";
import styles from "./HeroSection.module.css";

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageUrl: string;
  primaryCta: Cta;
  secondaryCta?: Cta;
  enableRegistrationHandoff?: boolean;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  imageUrl,
  primaryCta,
  secondaryCta,
  enableRegistrationHandoff = false,
}: HeroSectionProps) {
  return (
    <section
      className={styles.hero}
      data-activity-detail-hero={enableRegistrationHandoff ? true : undefined}
      data-registration-handoff-hero={enableRegistrationHandoff ? true : undefined}
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
          >
            {title}
          </h1>
          {description ? (
            <p
              className={styles.description}
              data-reveal
            >
              {description}
            </p>
          ) : null}
          <div
            className={styles.actions}
            data-reveal
          >
            <Button
              href={primaryCta.href}
              target={primaryCta.target}
              rel={primaryCta.rel}
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
                target={secondaryCta.target}
                rel={secondaryCta.rel}
                variant="secondary"
                className={styles.secondaryAction}
              >
                {secondaryCta.label}
              </Button>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
