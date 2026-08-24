import { getActivityBySlug } from "@/features/activities/data-access/activities";
import { resolveDevelopmentRecipientEmail } from "@/features/contact/lib/contactEnvironment";
import type { ContactRecipient } from "@/features/contact/types/contact";

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
  const developmentRecipientEmail = resolveDevelopmentRecipientEmail();

  return activity && contact
    ? {
        email: developmentRecipientEmail ?? contact.email,
        activityTitle: activity.title,
      }
    : null;
};
