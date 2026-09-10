/**
 * Maintenance de la messagerie du domaine esc15.fr.
 *
 * Le drapeau vit dans le code et non dans l'environnement : la coupure se
 * relit dans le depot, suit le deploiement et se leve d'un commit, sans
 * dependre d'un reglage d'hebergeur que rien ne rappelle. La variable
 * CONTACT_FORM_ENABLED reste disponible pour couper sans redeploiement ; les
 * deux se cumulent, l'une n'annule pas l'autre.
 *
 * Pour lever la maintenance : repasser ce drapeau a false, rien d'autre.
 */
export const IS_CONTACT_MAINTENANCE: boolean = true;

export const CONTACT_MAINTENANCE_TITLE = "Messagerie en maintenance";

/**
 * Le formulaire ecrit dans les boites @esc15.fr : la maintenance du domaine
 * les rend muettes toutes les deux. Le message le dit, sinon le visiteur
 * ecrit a une adresse qui ne recoit rien en croyant son message parti.
 */
export const CONTACT_MAINTENANCE_TEXT =
  "Le domaine esc15.fr est en cours de maintenance : le formulaire de contact est désactivé et les adresses en @esc15.fr ne reçoivent aucun message pour le moment. Le service sera rétabli prochainement, merci de renouveler votre demande à ce moment-là.";

/** Version courte, pour les chapeaux de page ou l'espace manque. */
export const CONTACT_MAINTENANCE_SHORT_TEXT =
  "Le domaine esc15.fr est en cours de maintenance : le formulaire de contact et les adresses en @esc15.fr sont momentanément indisponibles.";

const MAINTAINED_EMAIL_DOMAIN = "esc15.fr";

/**
 * Seules les boites du domaine sont muettes. Une section hebergee ailleurs
 * continue de recevoir : sa page ne doit pas porter l'avertissement, il ferait
 * renoncer un visiteur qui pouvait ecrire.
 */
export const isMaintainedEmail = (email: string) =>
  email.trim().toLowerCase().endsWith(`@${MAINTAINED_EMAIL_DOMAIN}`);
