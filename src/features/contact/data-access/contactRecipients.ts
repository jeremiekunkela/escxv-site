import { getActivities } from "@/features/activities/data-access/activities";
import type { Activity } from "@/features/activities/types/activity";
import { getClubInfo } from "@/features/club/data-access/club";
import { isInactiveContactEmail } from "@/features/contact/lib/contactMaintenance";
import { CLUB_RECIPIENT_SLUG } from "@/features/contact/lib/resolveContactRecipient";
import type { ContactFormRecipient } from "@/features/contact/components/ContactForm/ContactForm";

/**
 * Contacts d'une section a qui un message arrive vraiment. Une boite pas
 * encore ouverte est ecartee ici plutot qu'en aval : ce qui n'est pas
 * proposable n'a pas a etre propose.
 */
export const getReachableContacts = (activity: Activity) =>
  activity.contacts.filter((contact) => !isInactiveContactEmail(contact.email));

/**
 * Destinataires proposes par le formulaire general. On n'expose que le slug
 * et le libelle : les adresses restent cote serveur, ou la route les resout.
 *
 * Le club vient en premier et sert de choix par defaut : qui arrive sur
 * /contact sans savoir quelle section joindre doit pouvoir ecrire sans
 * choisir.
 *
 * Le choix porte sur le contact et non sur la section : l'escalade adultes et
 * l'atelier parent-enfant ne lisent pas la meme boite, et un message range
 * dans la mauvaise ne trouve pas son chemin tout seul. Le role departage —
 * « Contact adultes », « Contact competition » — la ou le nom du contact
 * repeterait celui de la section. Une section a contact unique garde son
 * titre seul.
 */
export const getContactRecipients = (): ContactFormRecipient[] => [
  {
    slug: CLUB_RECIPIENT_SLUG,
    label: `${getClubInfo().shortName} — question générale`,
  },
  ...getActivities().flatMap((activity) => {
    const reachable = getReachableContacts(activity);

    return reachable.map((contact) => ({
      slug: contact.id,
      label:
        reachable.length > 1
          ? `${activity.title} — ${contact.role}`
          : activity.title,
    }));
  }),
];
