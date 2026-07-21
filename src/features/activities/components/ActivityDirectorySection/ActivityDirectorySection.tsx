import { Container } from "@/components/ui/Container/Container";
import { SectionTitle } from "@/components/ui/SectionTitle/SectionTitle";
import { ActivityDirectory } from "@/features/activities/components/ActivityDirectory/ActivityDirectory";
import type { Activity } from "@/features/activities/types/activity";
import styles from "./ActivityDirectorySection.module.css";

type ActivityDirectorySectionProps = {
  activities: Activity[];
  eyebrow?: string;
  title: string;
  subtitle: string;
};

/**
 * Section d'accueil : toutes les activites d'un seul coup d'oeil.
 * Pas de recherche ni de filtres, la liste tient entierement a l'ecran ;
 * chaque tuile mene directement a la page de l'activite.
 */
export function ActivityDirectorySection({
  activities,
  eyebrow,
  title,
  subtitle,
}: ActivityDirectorySectionProps) {
  return (
    <section id="activities" className={styles.section}>
      <Container>
        <SectionTitle
          eyebrow={eyebrow ?? "Activites"}
          title={title}
          subtitle={subtitle}
        />

        <div className={styles.directory}>
          <ActivityDirectory activities={activities} />
        </div>
      </Container>
    </section>
  );
}
