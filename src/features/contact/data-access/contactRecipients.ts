import { getActivities } from "@/features/activities/data-access/activities";
import { getClubInfo } from "@/features/club/data-access/club";
import { CLUB_RECIPIENT_SLUG } from "@/features/contact/lib/resolveContactRecipient";
import type { ContactFormRecipient } from "@/features/contact/components/ContactForm/ContactForm";

/**
 * Destinataires proposes par le formulaire general. On n'expose que le slug
 * et le libelle : les adresses restent cote serveur, ou la route les resout.
 *
 * Le club vient en premier et sert de choix par defaut : qui arrive sur
 * /contact sans savoir quelle section joindre doit pouvoir ecrire sans
 * choisir. Une section sans contact declare est ecartee, la route ne saurait
 * pas ou livrer le message.
 */
export const getContactRecipients = (): ContactFormRecipient[] => [
  {
    slug: CLUB_RECIPIENT_SLUG,
    label: `${getClubInfo().shortName} — question générale`,
  },
  ...getActivities()
    .filter((activity) => activity.contacts.length > 0)
    .map((activity) => ({ slug: activity.slug, label: activity.title })),
];
