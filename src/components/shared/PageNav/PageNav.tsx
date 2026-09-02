"use client";

import { Container } from "@/components/ui/Container/Container";
import { useEffect, useRef, useState } from "react";
import styles from "./PageNav.module.css";

export type PageNavLink = {
  href: string;
  label: string;
};

type PageNavProps = {
  links: PageNavLink[];
};

/** Marge de securite : la section touche la ligne juste avant de la depasser. */
const ACTIVE_THRESHOLD = 1;

/**
 * Derniere section dont le haut est deja passe sous la barre : c'est celle
 * qu'on lit. En bas de page, la derniere section peut etre trop courte pour
 * jamais atteindre la ligne — on la designe alors d'office, sans quoi le
 * dernier onglet resterait inatteignable.
 */
function findActiveHref(links: PageNavLink[], boundary: number) {
  const isAtBottom =
    window.scrollY + window.innerHeight >=
    document.documentElement.scrollHeight - 2;

  const passed = links.filter((link) => {
    const section = document.querySelector(link.href);

    return section
      ? section.getBoundingClientRect().top <= boundary + ACTIVE_THRESHOLD
      : false;
  });

  return isAtBottom
    ? (links.at(-1)?.href ?? null)
    : (passed.at(-1)?.href ?? links[0]?.href ?? null);
}

/**
 * Sommaire d'une page longue : il annonce ce qu'elle contient, une information
 * qu'on n'a autrement qu'en defilant jusqu'au bout.
 *
 * Sans surlignage de la section courante : de simples ancres suffisent a
 * rendre la page navigable.
 *
 * Collant sous l'en-tete du site a toutes les tailles. Le bas d'ecran, ou une
 * application logerait sa barre d'onglets, est deja celui du bouton
 * d'inscription : c'est l'action que le club attend, elle ne recule pas d'un
 * cran pour cinq ancres.
 *
 * La rangee suit en revanche la lecture : elle se recentre sur l'entree de la
 * section en cours, donc ses voisines entrent dans le champ. C'est ce qui rend
 * les entrees hors ecran atteignables au doigt — les ombres de defilement
 * disent qu'il reste quelque chose, ce recentrage le montre.
 *
 * Les pages qui l'utilisent doivent decaler leurs ancres de
 * `--header-height + --activity-nav-height`, sans quoi la barre recouvre le
 * titre vise.
 */
export function PageNav({ links }: PageNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeHref, setActiveHref] = useState<string | null>(null);
  const hasLinks = links.length >= 2;

  useEffect(() => {
    const updateActiveHref = () => {
      const boundary = navRef.current?.getBoundingClientRect().bottom ?? 0;

      setActiveHref(findActiveHref(links, boundary));
    };

    updateActiveHref();
    window.addEventListener("scroll", updateActiveHref, { passive: true });
    window.addEventListener("resize", updateActiveHref);

    return () => {
      window.removeEventListener("scroll", updateActiveHref);
      window.removeEventListener("resize", updateActiveHref);
    };
  }, [links, hasLinks]);

  /**
   * Recentrage horizontal a la main plutot que `scrollIntoView` : celui-ci
   * peut aussi deplacer la page verticalement, ce qui ferait sauter la lecture
   * a chaque changement de section.
   */
  useEffect(() => {
    const list = listRef.current;
    const activeLink = list?.querySelector<HTMLElement>(
      `[data-href="${activeHref}"]`,
    );

    if (!list || !activeLink) {
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    list.scrollTo({
      left:
        activeLink.offsetLeft - (list.clientWidth - activeLink.clientWidth) / 2,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [activeHref]);

  return hasLinks ? (
    <nav ref={navRef} className={styles.nav} aria-label="Sommaire de la page">
      <Container>
        <ul ref={listRef} className={styles.list}>
          {links.map((link) => (
            <li key={link.href}>
              <a className={styles.link} href={link.href} data-href={link.href}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  ) : null;
}
