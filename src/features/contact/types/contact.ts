export type ContactSubject =
  | "inscription"
  | "cours-essai"
  | "horaires"
  | "tarifs"
  | "autre";

/** Demande validee, prete a etre transformee en message. */
export type ContactRequest = {
  activitySlug: string;
  name: string;
  email: string;
  phone: string | null;
  subject: ContactSubject;
  message: string;
};

/**
 * Destinataire resolu cote serveur a partir du slug. Le navigateur ne fournit
 * jamais d'adresse : sinon la route servirait de relais pour ecrire a
 * n'importe qui depuis le domaine du club.
 */
export type ContactRecipient = {
  email: string;
  activityTitle: string;
};

/** Message tel qu'il part, une fois le destinataire resolu. */
export type ContactMessage = {
  to: string;
  replyTo: string;
  subject: string;
  text: string;
};

/**
 * L'envoi est injecte et non importe : la route ne connait que cette
 * signature. C'est ce qui permet de tout tester avec un emetteur factice et
 * de changer de prestataire sans toucher a la logique.
 */
export type SendContactMessage = (message: ContactMessage) => Promise<void>;

export type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; violations: string[] };
