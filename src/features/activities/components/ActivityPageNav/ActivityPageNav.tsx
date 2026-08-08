import { Container } from "@/components/ui/Container/Container";
import styles from "./ActivityPageNav.module.css";

export type ActivityPageNavLink = {
  href: string;
  label: string;
};

type ActivityPageNavProps = {
  links: ActivityPageNavLink[];
};

/**
 * Sommaire d'une fiche de section : il annonce surtout ce que la page
 * contient, une information qu'on n'a aujourd'hui qu'en defilant jusqu'au
 * bout.
 *
 * Collant sur desktop seulement : empile sur mobile avec l'en-tete du site,
 * deux barres occuperaient un cinquieme de l'ecran en permanence pour epargner
 * quelques defilements. Sous 760 px il reste donc en place sous la banniere,
 * ou il joue son role d'annonce au moment de la decouverte.
 *
 * Sans etat ni surlignage de la section courante : de simples ancres suffisent
 * a rendre la page navigable, et le composant reste rendu au build.
 */
export function ActivityPageNav({ links }: ActivityPageNavProps) {
  if (links.length < 2) {
    return null;
  }

  return (
    <nav className={styles.nav} aria-label="Sommaire de la page">
      <Container>
        <ul className={styles.list}>
          {links.map((link) => (
            <li key={link.href}>
              <a className={styles.link} href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
