import {
  getActivities,
  getActivityBySlug,
} from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import { resolveRecipientOverrideEmail } from "@/features/contact/lib/contactEnvironment";
import { isInactiveContactEmail } from "@/features/contact/lib/contactMaintenance";
import { isSendableEmail } from "@/features/contact/lib/emailAddress";
import type { ContactRecipient } from "@/features/contact/types/contact";

/**
 * Pseudo-slug du club. Il ne correspond a aucune activite : c'est la voie des
 * demandes qui ne relevent d'aucune section (benevolat, comite, presse) et de
 * celles qu'on ne peut pas adresser a une section, comme un signalement.
 */
export const CLUB_RECIPIENT_SLUG = "club";

const maskEmail = (email: string) => {
  const [localPart = "", domain = ""] = email.split("@");
  const localPreview = localPart.slice(0, 2);

  return domain.length > 0 ? `${localPreview}***@${domain}` : "***";
};

/**
 * Contact designe par son identifiant, ou il est declare. Les identifiants
 * sont uniques d'une section a l'autre, la recherche n'a donc pas besoin de
 * savoir de quelle section il s'agit.
 */
const findActivityContact = (contactId: string) =>
  getActivities()
    .flatMap((activity) =>
      activity.contacts.map((contact) => ({ activity, contact })),
    )
    .find(({ contact }) => contact.id === contactId) ?? null;

/**
 * Destinataire nomme par le slug, avant application d'un eventuel override.
 *
 * Trois formes, de la plus precise a la plus ancienne : le club, un contact
 * nomme — une section en declare parfois deux, et le visiteur a choisi — puis
 * un slug de section, qui retombe sur son premier contact. Cette derniere
 * forme sert les pages ouvertes avant que le choix ne porte sur le contact :
 * leur envoi arrive encore quelque part plutot que d'echouer.
 */
const findRecipient = (slug: string): ContactRecipient | null => {
  const club = getClubInfo();

  if (slug === CLUB_RECIPIENT_SLUG) {
    return club.email ? { email: club.email, label: club.shortName } : null;
  }

  const named = findActivityContact(slug);

  if (named) {
    return { email: named.contact.email, label: named.activity.title };
  }

  const activity = getActivityBySlug(slug);
  const contact = activity?.contacts[0];

  return activity && contact
    ? { email: contact.email, label: activity.title }
    : null;
};

/**
 * La boite de la section est-elle encore fermee ? Le test porte sur l'adresse
 * declaree, pas sur celle qui recevra : un destinataire force sert a eprouver
 * le parcours, et le bloquer ici vaut mieux que laisser croire qu'une section
 * injoignable repond.
 */
export const isInactiveRecipientSlug = (slug: string) => {
  const recipient = findRecipient(slug);

  return recipient !== null && isInactiveContactEmail(recipient.email);
};

/**
 * Le slug designe-t-il une section ou le club ? La route s'en sert pour
 * distinguer une adresse fantaisiste, qui ne merite aucune alerte, d'une
 * section reelle dont l'adresse est inexploitable.
 */
export const isKnownRecipientSlug = (slug: string) => findRecipient(slug) !== null;

/**
 * Le destinataire se deduit du slug, jamais d'une adresse envoyee par le
 * navigateur : sans cela, la route permettrait d'ecrire a n'importe qui
 * depuis le domaine du club.
 *
 * Une section peut declarer plusieurs contacts (escalade : adultes et APE).
 * Le premier fait foi, c'est l'adresse generale de la section.
 */
export const resolveContactRecipient = (
  slug: string,
): ContactRecipient | null => {
  const recipient = findRecipient(slug);
  const recipientOverrideEmail = resolveRecipientOverrideEmail();
  const email = recipient
    ? (recipientOverrideEmail ?? recipient.email)
    : null;
  /**
   * Une adresse de section mal saisie est une erreur de donnees, pas une
   * erreur du visiteur : on refuse avant d'appeler l'emetteur, et le journal
   * la nomme pour qu'elle soit corrigee.
   */
  const isDeliverable = email !== null && isSendableEmail(email);

  if (email !== null && !isDeliverable) {
    console.error("[contact] adresse de destinataire invalide", {
      recipientSlug: slug,
      recipient: maskEmail(email),
    });
  }

  console.info("[contact] destinataire resolu", {
    recipientSlug: slug,
    vercelEnv: process.env.VERCEL_ENV ?? "hors-vercel",
    hasRecipientOverride: Boolean(recipientOverrideEmail),
    recipientSource: recipientOverrideEmail
      ? "override"
      : slug === CLUB_RECIPIENT_SLUG
        ? "club"
        : "section",
    recipient: email ? maskEmail(email) : null,
  });

  return recipient && email && isDeliverable ? { ...recipient, email } : null;
};
