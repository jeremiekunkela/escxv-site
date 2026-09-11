import type { ContactDeliveryType } from "@/features/contact/types/contact";

/**
 * Ce qu'un message rebondi peut encore devenir.
 *
 * Le renvoi n'est jamais un acquis : il tient a la certitude qu'on parle bien
 * du premier envoi. Le doute ne se tranche pas en faveur du renvoi — un
 * message qui part ou personne ne l'attend vaut moins qu'une alerte a qui
 * sait quoi en faire.
 */
export type BounceOutcome =
  { action: "fallback" } | { action: "alert-only"; reason: string };

/**
 * Etiquettes telles que l'emetteur les rend : des chaines, toutes optionnelles.
 * Rien ne garantit leur presence — un message parti avant cette version n'en
 * porte aucune — ni leur valeur, l'evenement venant du reseau.
 */
export type BounceTags = Record<string, string> | undefined;

const readDeliveryType = (tags: BounceTags): ContactDeliveryType | null =>
  tags?.delivery_type === "primary" || tags?.delivery_type === "fallback"
    ? tags.delivery_type
    : null;

/**
 * Decide du sort d'un rebond, sans rien emettre ni lire au-dehors.
 *
 * L'ordre des refus compte : la boucle se coupe avant tout le reste, puisque
 * c'est le seul cas ou se tromper coute un envoi sans fin.
 */
export const decideBounceOutcome = ({
  tags,
  hasOriginalMessage,
}: {
  tags: BounceTags;
  /** Le message d'origine a-t-il ete retrouve chez l'emetteur ? */
  hasOriginalMessage: boolean;
}): BounceOutcome => {
  const deliveryType = readDeliveryType(tags);

  if (deliveryType === "fallback") {
    return {
      action: "alert-only",
      reason: "le renvoi lui-meme a rebondi, aucun second renvoi",
    };
  }

  if (deliveryType === null) {
    return {
      action: "alert-only",
      reason: "message non identifie : pas d'etiquette d'envoi",
    };
  }

  return hasOriginalMessage
    ? { action: "fallback" }
    : {
        action: "alert-only",
        reason: "message d'origine introuvable chez l'emetteur",
      };
};

/**
 * Sujet du renvoi. La section figure deja dans le sujet d'origine, sous la
 * forme `[Tennis] ...` : la repeter n'apprendrait rien. Seule la nature du
 * message s'ajoute, en tete, la ou l'oeil la trouve dans une liste.
 */
export const buildFallbackSubject = (originalSubject: string) =>
  `[Renvoi] ${originalSubject}`;

/**
 * Bandeau pose en tete du renvoi, a l'intention de qui releve la boite
 * generale : sans lui, le message parait adresse au club alors qu'il visait
 * une section, et la reponse partirait de travers.
 */
const buildFallbackNoticeLines = ({
  originalRecipient,
  fallbackRecipient,
  bounceMessage,
}: {
  originalRecipient: string;
  fallbackRecipient: string;
  bounceMessage: string | null;
}) => [
  `Ce message était initialement destiné à ${originalRecipient}.`,
  `Il a été transmis à ${fallbackRecipient} à la suite d'un échec de délivrance.`,
  ...(bounceMessage ? [`Motif du refus : ${bounceMessage}`] : []),
  "Le visiteur avait accepté ce renvoi. Répondez-lui directement : son adresse est en réponse à ce message.",
];

export const buildFallbackText = ({
  originalText,
  ...notice
}: {
  originalText: string;
  originalRecipient: string;
  fallbackRecipient: string;
  bounceMessage: string | null;
}) =>
  [...buildFallbackNoticeLines(notice), "", "—", "", originalText].join("\n");

/**
 * Le bandeau s'ajoute au HTML d'origine sans y toucher : ce corps a ete
 * compose et echappe a l'envoi, le reprendre tel quel evite d'echapper deux
 * fois ce qui l'etait deja.
 */
export const buildFallbackHtml = ({
  originalHtml,
  ...notice
}: {
  originalHtml: string;
  originalRecipient: string;
  fallbackRecipient: string;
  bounceMessage: string | null;
}) =>
  [
    '<div style="margin:0 0 24px;padding:16px 20px;border-left:3px solid #1c392e;background:#f8fafc;font-family:Arial,sans-serif;font-size:13px;line-height:20px;color:#1a202c;">',
    buildFallbackNoticeLines(notice).map(escapeHtml).join("<br />"),
    "</div>",
    originalHtml,
  ].join("");

/**
 * Le bandeau reprend une adresse et un motif rendus par l'emetteur : ils
 * n'ont pas ete composes ici, donc ils s'echappent avant d'entrer dans du
 * HTML.
 */
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Clef d'idempotence du renvoi. Elle derive de l'identifiant du message
 * rebondi : deux livraisons du meme evenement demandent le meme envoi, et
 * l'emetteur rend la premiere reponse au lieu d'ecrire deux fois.
 */
export const buildFallbackIdempotencyKey = (bouncedEmailId: string) =>
  `contact-fallback-${bouncedEmailId}`;
