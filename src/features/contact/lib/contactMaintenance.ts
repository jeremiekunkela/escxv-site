/**
 * Maintenance du formulaire de contact.
 *
 * Le drapeau vit dans le code et non dans l'environnement : la coupure se
 * relit dans le depot, suit le deploiement et se leve d'un commit, sans
 * dependre d'un reglage d'hebergeur que rien ne rappelle. La variable
 * CONTACT_FORM_ENABLED reste disponible pour couper sans redeploiement ; les
 * deux se cumulent, l'une n'annule pas l'autre.
 *
 * Pour lever la maintenance : repasser ce drapeau a false, rien d'autre.
 */
export const IS_CONTACT_MAINTENANCE: boolean = false;

export const CONTACT_MAINTENANCE_TITLE = "Formulaire en maintenance";

/**
 * Seul l'envoi depuis le site est coupe : les boites de section et du club
 * recoivent normalement. Le message le dit, sinon le visiteur croit le club
 * injoignable et renonce alors qu'une adresse suffit.
 */
export const CONTACT_MAINTENANCE_TEXT =
  "Le formulaire de contact est momentanément désactivé, le temps d'une maintenance. Les adresses e-mail, elles, fonctionnent normalement : écrivez directement à l'adresse indiquée, votre message arrivera bien.";

/** Version courte, pour les chapeaux de page ou l'espace manque. */
export const CONTACT_MAINTENANCE_SHORT_TEXT =
  "Le formulaire de contact est momentanément désactivé, le temps d'une maintenance : écrivez directement au club ou à la section concernée, les adresses e-mail fonctionnent normalement.";
