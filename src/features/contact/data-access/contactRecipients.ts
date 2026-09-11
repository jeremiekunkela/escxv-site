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
 * choisir.
 *
 * Le choix porte sur le contact et non sur la section : l'escalade adultes et
 * l'atelier parent-enfant ne lisent pas la meme boite, et un message range
 * dans la mauvaise ne trouve pas son chemin tout seul. Le role departage —
 * « Contact adultes », « Contact competition » — la ou le nom du contact
 * repeterait celui de la section. Une section a contact unique garde son
 * titre seul.
 *
 * Un contact dont la boite n'est pas encore ouverte reste propose : le
 * serveur deroute son message vers le club. Le retirer priverait la section
 * de tout formulaire, donc d'inscriptions, pour une boite qui s'ouvrira.
 */
export const getContactRecipients = (): ContactFormRecipient[] => [
  {
    slug: CLUB_RECIPIENT_SLUG,
    label: `${getClubInfo().shortName} — question générale`,
  },
  ...getActivities().flatMap((activity) =>
    activity.contacts.map((contact) => ({
      slug: contact.id,
      label:
        activity.contacts.length > 1
          ? `${activity.title} — ${contact.role}`
          : activity.title,
    })),
  ),
];
