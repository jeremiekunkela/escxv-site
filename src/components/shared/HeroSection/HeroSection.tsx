import Image from "next/image";
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
};

export function HeroSection({
  eyebrow,
  title,
  description,
  imageUrl,
  primaryCta,
  secondaryCta,
  badges = [],
}: HeroSectionProps) {
  return (
    <section className={styles.hero}>
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
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1 className={styles.title}>{title}</h1>
          <p className={styles.description}>{description}</p>
          <div className={styles.actions}>
            <Button href={primaryCta.href} className={styles.primaryAction}>
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
            <ul className={styles.badges}>
              {badges.map((badge) => (
                <li key={badge} className={styles.badge}>
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
