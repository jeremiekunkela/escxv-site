/**
 * Coordonnees affichees d'un interlocuteur : une section, ou le club. Meme
 * forme que `ActivityContact`, dont elle prend le relais des que le contact
 * n'est plus rattache a une activite.
 */
export type ContactChannel = {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string | null;
};

export type ContactSubject =
  | "inscription"
  | "cours-essai"
  | "horaires"
  | "tarifs"
  | "autre";

/** Demande validee, prete a etre transformee en message. */
export type ContactRequest = {
  recipientSlug: string;
  name: string;
  email: string;
  phone: string | null;
  subject: ContactSubject;
  message: string;
};

/**
 * Destinataire resolu cote serveur a partir du slug : une section, ou le club
 * lui-meme pour les demandes qui ne relevent d'aucune section. Le navigateur
 * ne fournit jamais d'adresse, sinon la route servirait de relais pour ecrire
 * a n'importe qui depuis le domaine du club.
 */
export type ContactRecipient = {
  email: string;
  label: string;
};

/** Message tel qu'il part, une fois le destinataire resolu. */
export type ContactMessage = {
  to: string;
  replyTo: string;
  subject: string;
  /** Repli des clients en texte seul, et seul corps affiche par la console. */
  text: string;
  html: string;
};

export type ContactDeliveryMode = "console" | "email";

export type ContactDeliveryResult = {
  mode: ContactDeliveryMode;
};

/**
 * L'envoi est injecte et non importe : la route ne connait que cette
 * signature. C'est ce qui permet de tout tester avec un emetteur factice et
 * de changer de prestataire sans toucher a la logique.
 */
export type SendContactMessage = (
  message: ContactMessage,
) => Promise<ContactDeliveryResult>;

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; violations: string[] };
