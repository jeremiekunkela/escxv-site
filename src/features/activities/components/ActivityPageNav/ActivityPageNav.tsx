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
 * Collant sous l'en-tete du site a toutes les tailles, en onglets sur bureau
 * et en pastilles defilantes sur telephone. Le bas d'ecran, ou une application
 * logerait sa barre d'onglets, est deja celui du bouton d'inscription : c'est
 * l'action que le club attend, elle ne recule pas d'un cran pour cinq ancres.
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
