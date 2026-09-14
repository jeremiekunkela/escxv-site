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

/**
 * Boites du domaine qui ne sont pas encore ouvertes. Elles existent sur le
 * papier — le comite les publie, les pages les affichent — mais rien n'y
 * arrive : un message envoye la se perd sans rebond.
 *
 * La liste vit dans le code, comme le drapeau de maintenance, pour la meme
 * raison : une adresse s'ouvre, on retire sa ligne, le commit raconte quand.
 * Elle contient aussi des adresses qu'aucune page n'affiche encore ; elles y
 * sont d'avance, pour qu'une publication ne les fasse pas passer pour vives.
 */
const INACTIVE_CONTACT_EMAILS = [
  "capoeira@esc15.fr",
  "michel.blino@esc15.fr",
  "tennis-competition@esc15.fr",
  "tennis@esc15.fr",
  "vincent.kieffer@esc15.fr",
] as const;

const inactiveContactEmails = new Set<string>(INACTIVE_CONTACT_EMAILS);

/** La casse et les espaces d'une saisie ne changent pas l'adresse. */
export const isInactiveContactEmail = (email: string) =>
  inactiveContactEmails.has(email.trim().toLowerCase());

export const INACTIVE_CONTACT_TITLE = "Adresse en cours d'activation";

/**
 * Le texte nomme l'adresse fermee : sans cela, une section qui en a deux
 * laisse croire que les deux sont coupees, ou que la bonne l'est aussi.
 *
 * Il dit aussi ou va le message. Le formulaire reste ouvert — le serveur
 * deroute vers le club ce qui visait une boite fermee — mais ecrire soi-meme
 * a l'adresse fermee ne mene toujours nulle part : c'est cette difference que
 * le visiteur doit lire.
 */
export const buildInactiveContactText = ({
  inactiveEmails,
  isFormAvailable,
  clubEmail,
}: {
  inactiveEmails: readonly string[];
  isFormAvailable: boolean;
  clubEmail: string | null;
}) => {
  const isPlural = inactiveEmails.length > 1;
  const subject = isPlural
    ? `Les adresses ${inactiveEmails.join(", ")} ne sont pas encore ouvertes`
    : `L'adresse ${inactiveEmails[0]} n'est pas encore ouverte`;
  const undelivered = isPlural
    ? " : les messages qui leur sont adressés n'arrivent pas"
    : " : les messages qui lui sont adressés n'arrivent pas";
  const guidance = isFormAvailable
    ? ". Utilisez le formulaire : votre message sera reçu par le secrétariat du club, qui le transmettra à la section."
    : clubEmail
      ? `. Écrivez au club à ${clubEmail}, qui transmettra à la section.`
      : ".";

  return `${subject}${undelivered}${guidance}`;
};
