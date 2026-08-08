import { Container } from "@/components/ui/Container/Container";
import styles from "./PageNav.module.css";

export type PageNavLink = {
  href: string;
  label: string;
};

type PageNavProps = {
  links: PageNavLink[];
};

/**
 * Sommaire d'une page longue : il annonce surtout ce qu'elle contient, une
 * information qu'on n'a autrement qu'en defilant jusqu'au bout.
 *
 * Collant sous l'en-tete du site a toutes les tailles. Le bas d'ecran, ou une
 * application logerait sa barre d'onglets, est deja celui du bouton
 * d'inscription : c'est l'action que le club attend, elle ne recule pas d'un
 * cran pour cinq ancres.
 *
 * Sans etat ni surlignage de la section courante : de simples ancres suffisent
 * a rendre la page navigable, et le composant reste rendu au build.
 *
 * Les pages qui l'utilisent doivent decaler leurs ancres de
 * `--header-height + --activity-nav-height`, sans quoi la barre recouvre le
 * titre vise.
 */
export function PageNav({ links }: PageNavProps) {
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
