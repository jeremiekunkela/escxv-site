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

/**
 * Envoi normal, ou renvoi vers le club apres un echec de livraison. La
 * distinction voyage avec le message et revient dans l'evenement de rebond :
 * c'est elle qui empeche un renvoi de rebondir a son tour indefiniment.
 */
export type ContactDeliveryType = "primary" | "fallback";

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
  /**
   * Adresse que le message visait, quand sa boite n'est pas encore ouverte et
   * qu'il part au club a la place. Le nom de la section reste dans le libelle
   * — c'est elle que le visiteur voulait joindre, et c'est a elle que le
   * secretariat transmettra.
   */
  reroutedFrom: string | null;
};

/** Message tel qu'il part, une fois le destinataire resolu. */
export type ContactMessage = {
  to: string;
  replyTo: string;
  subject: string;
  /**
   * Ce que l'emetteur doit pouvoir relire quand le message rebondit, des
   * heures plus tard et dans une autre invocation : la section visee, le
   * choix du visiteur, la nature de l'envoi.
   */
  metadata: ContactMessageMetadata;
  /** Repli des clients en texte seul, et seul corps affiche par la console. */
  text: string;
  html: string;
};

/**
 * Etiquettes portees par le message chez l'emetteur. Resend les rend telles
 * quelles dans l'evenement de rebond : elles evitent d'avoir a retenir quoi
 * que ce soit de notre cote entre l'envoi et son echec.
 */
export type ContactMessageMetadata = {
  recipientSlug: string;
  deliveryType: ContactDeliveryType;
};

export type ContactDeliveryMode = "console" | "email";

export type ContactDeliveryResult = {
  mode: ContactDeliveryMode;
  /**
   * Identifiant rendu par l'emetteur. Seul lien entre un rebond et le message
   * qui l'a provoque — sans lui, un echec asynchrone reste anonyme.
   */
  messageId: string | null;
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
