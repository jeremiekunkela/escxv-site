import { getActivityBySlug } from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import { resolveRecipientOverrideEmail } from "@/features/contact/lib/contactEnvironment";
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
    return club.email ? { email: club.email, label: club.shortName } : null;
  }

  const activity = getActivityBySlug(slug);
  const contact = activity?.contacts[0];

  return activity && contact
    ? { email: contact.email, label: activity.title }
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

  return recipient && email ? { ...recipient, email } : null;
};
