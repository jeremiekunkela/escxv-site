import Link from "next/link";
import { Button } from "@/components/ui/Button/Button";
import { Container } from "@/components/ui/Container/Container";
import { getActivities } from "@/features/activities/data-access/activities";
import { getActivityRoute, routes } from "@/lib/constants/routes";
import styles from "./not-found.module.css";

/**
 * Beaucoup de visiteurs arrivent ici depuis l'ancien site : un lien indexe,
 * un favori, un QR code imprime. Les pages qui avaient un equivalent sont
 * redirigees (cf. next.config.ts) ; celles qui n'en ont pas atterrissent la.
 *
 * On ne les laisse donc pas sur un cul-de-sac : la page dit pourquoi l'adresse
 * ne repond plus, et propose les destinations reelles du site plutot qu'un
 * seul retour a l'accueil.
 */
const destinations = [
  {
    href: routes.home,
    label: "Accueil",
    description: "Les activités du club et les infos de la saison.",
  },
  {
    href: routes.locations,
    label: "Lieux de pratique",
    description: "Les gymnases, stades et piscines, filtrables par sport.",
  },
  {
    href: routes.news,
    label: "Actualités",
    description: "Les annonces du club et des sections.",
  },
  {
    href: routes.contact,
    label: "Contact",
    description: "Écrire au club ou directement à une section.",
  },
];

export default function NotFound() {
  const activities = getActivities();

  return (
    <main className={styles.page}>
      <Container className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.eyebrow}>Erreur 404</p>
          <h1 className={styles.title}>Cette page n&apos;existe pas</h1>
          <p className={styles.description}>
            L&apos;adresse est peut-être mal orthographiée, ou elle vient de
            l&apos;ancien site et n&apos;a pas d&apos;équivalent ici. Le reste du
            site, lui, est bien là.
          </p>
          <div className={styles.actions}>
            <Button href={routes.home} icon="arrowRight">
              Retour à l&apos;accueil
            </Button>
          </div>
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Où aller</h2>
          <ul className={styles.destinations}>
            {destinations.map((destination) => (
              <li key={destination.href}>
                <Link href={destination.href} className={styles.destination}>
                  <span className={styles.destinationLabel}>
                    {destination.label}
                  </span>
                  <span className={styles.destinationDescription}>
                    {destination.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Vous cherchiez une section ?
          </h2>
          <ul className={styles.activities}>
            {activities.map((activity) => (
              <li key={activity.slug}>
                <Link
                  href={getActivityRoute(activity.slug)}
                  className={styles.activity}
                >
                  {activity.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
