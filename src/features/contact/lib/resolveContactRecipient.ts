import { getActivityBySlug } from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import {
  resolveRecipientCopyEmails,
  resolveRecipientOverrideEmail,
} from "@/features/contact/lib/contactEnvironment";
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

/** Destinataire nomme par le slug, avant application d'un eventuel override. */
const findRecipient = (slug: string): ContactRecipient | null => {
  const club = getClubInfo();

  if (slug === CLUB_RECIPIENT_SLUG) {
    return club.email
      ? { email: club.email, label: club.shortName, copyEmails: [] }
      : null;
  }

  const activity = getActivityBySlug(slug);
  const contact = activity?.contacts[0];

  return activity && contact
    ? { email: contact.email, label: activity.title, copyEmails: [] }
    : null;
};

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
   * Un destinataire force sert a ne pas ecrire aux vraies boites : les copies
   * tombent avec lui, sinon le test arriverait quand meme chez les personnes
   * qu'il s'agissait d'epargner.
   */
  const copyEmails = recipientOverrideEmail
    ? []
    : resolveRecipientCopyEmails(slug);

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
    copyCount: copyEmails.length,
  });

  return recipient && email && isDeliverable
    ? { ...recipient, email, copyEmails }
    : null;
};
