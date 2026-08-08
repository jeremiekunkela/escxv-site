import Image from "next/image";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import type { Cta } from "@/types/content";
import styles from "./HeroSection.module.css";

export type HeroFact = {
  label: string;
  value: string;
};

type HeroSectionProps = {
  eyebrow: string;
  title: string;
  description?: string;
  imageUrl: string;
  /**
   * Faits saillants affiches entre le texte et les boutons : ce qu'un visiteur
   * doit pouvoir lire sans defiler. Loges dans la banniere plutot que dans un
   * bandeau propre, qui ajouterait une bande a faire defiler pour la meme
   * information.
   */
  facts?: HeroFact[];
  primaryCta?: Cta;
  secondaryCta?: Cta;
  enableRegistrationHandoff?: boolean;
};

export function HeroSection({
  eyebrow,
  title,
  description,
  imageUrl,
  facts = [],
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
          {facts.length > 0 ? (
            <dl className={styles.facts} data-reveal>
              {facts.map((fact) => (
                <div key={fact.label} className={styles.fact}>
                  <dt className={styles.factLabel}>{fact.label}</dt>
                  <dd className={styles.factValue}>{fact.value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          {primaryCta || secondaryCta ? (
            <div
              className={styles.actions}
              data-reveal
            >
              {primaryCta ? (
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
              ) : null}
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
          ) : null}
        </div>
      </Container>
    </section>
  );
}
