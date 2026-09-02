import { ContactForm } from "@/features/contact/components/ContactForm/ContactForm";
import type { ActivityContent } from "@/features/activities/types/activity";

type ActivityContactFormProps = {
  activitySlug: string;
  activityTitle: string;
  content: ActivityContent;
};

const DEFAULT_FORM_TEXT =
  "Votre message arrive directement dans la boîte de la section, qui vous répondra par email.";

/**
 * Sur une page de section, le destinataire est connu : pas de selecteur, le
 * visiteur a deja choisi en arrivant ici. Seul le formulaire general de
 * /contact laisse choisir.
 */
export function ActivityContactForm({
  activitySlug,
  activityTitle,
  content,
}: ActivityContactFormProps) {
  const contactFormText =
    content.contactFormText && content.contactFormText.trim().length > 0
      ? content.contactFormText
      : DEFAULT_FORM_TEXT;

  return (
    <ContactForm
      recipients={[{ slug: activitySlug, label: activityTitle }]}
      title="Envoyer un message"
      description={contactFormText}
    />
  );
}
