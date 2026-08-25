import { getActivityBySlug } from "@/features/activities/data-access/activities";
import { resolveRecipientOverrideEmail } from "@/features/contact/lib/contactEnvironment";
import type { ContactRecipient } from "@/features/contact/types/contact";

const maskEmail = (email: string) => {
  const [localPart = "", domain = ""] = email.split("@");
  const localPreview = localPart.slice(0, 2);

  return domain.length > 0 ? `${localPreview}***@${domain}` : "***";
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
  const activity = getActivityBySlug(slug);
  const contact = activity?.contacts[0];
  const recipientOverrideEmail = resolveRecipientOverrideEmail();
  const email = contact ? (recipientOverrideEmail ?? contact.email) : null;

  console.info("[contact] destinataire resolu", {
    activitySlug: slug,
    vercelEnv: process.env.VERCEL_ENV ?? "hors-vercel",
    hasRecipientOverride: Boolean(recipientOverrideEmail),
    recipientSource: recipientOverrideEmail ? "override" : "section",
    recipient: email ? maskEmail(email) : null,
  });

  return activity && contact
    ? {
        email: recipientOverrideEmail ?? contact.email,
        activityTitle: activity.title,
      }
    : null;
};
