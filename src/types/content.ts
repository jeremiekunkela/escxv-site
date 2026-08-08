export type Cta = {
  label: string;
  href: string;
  target?: "_blank" | "_self";
  rel?: string;
};

export type KeyFigure = {
  label: string;
  value: string;
  description: string;
  /**
   * Chiffre comptable depuis les donnees du site : sa valeur saisie n'est
   * qu'un repli, la data-access la recalcule. Sans quoi la page d'accueil
   * annonce douze lieux le jour ou le registre en compte treize.
   */
  source?: "activities" | "locations";
};
