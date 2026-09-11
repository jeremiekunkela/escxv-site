import { ContactForm } from "@/features/contact/components/ContactForm/ContactForm";
import type { ActivityContact } from "@/features/activities/types/activity";
import type { ActivityContent } from "@/features/activities/types/activity";

type ActivityContactFormProps = {
  /** Contacts joignables de la section, dans l'ordre ou elle les declare. */
  contacts: ActivityContact[];
  content: ActivityContent;
};

/**
 * « Part vers », et non « arrive » : le site n'apprend le refus d'une boite
 * que plus tard, par l'evenement de rebond. Promettre l'arrivee ferait de
 * chaque echec un mensonge.
 */
const DEFAULT_FORM_TEXT =
  "Votre message part directement vers la boîte de la section, qui vous répondra par email.";

/**
 * Sur une page de section, la section est connue : le selecteur ne sert qu'a
 * departager ses contacts, quand elle en declare plusieurs — l'escalade
 * adultes et l'atelier parent-enfant, par exemple. Un seul contact, il
 * disparait : le visiteur a deja choisi en arrivant ici.
 *
 * Le libelle reprend le role du contact, celui-la meme qui coiffe sa carte a
 * cote du formulaire : le visiteur retrouve dans la liste ce qu'il vient de
 * lire. Le nom de la section n'y figure pas, la page entiere le porte.
 */
export function ActivityContactForm({
  contacts,
  content,
}: ActivityContactFormProps) {
  const contactFormText =
    content.contactFormText && content.contactFormText.trim().length > 0
      ? content.contactFormText
      : DEFAULT_FORM_TEXT;

  return (
    <ContactForm
      recipients={contacts.map((contact) => ({
        slug: contact.id,
        label: contact.role,
      }))}
      defaultRecipientSlug={contacts[0]?.id}
      title="Envoyer un message"
      description={contactFormText}
    />
  );
}
