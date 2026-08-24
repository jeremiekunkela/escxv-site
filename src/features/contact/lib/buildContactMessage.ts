import type {
  ContactMessage,
  ContactRecipient,
  ContactRequest,
  ContactSubject,
} from "@/features/contact/types/contact";

const SUBJECT_LABELS: Record<ContactSubject, string> = {
  inscription: "Inscription",
  "cours-essai": "Cours d'essai",
  horaires: "Horaires",
  tarifs: "Tarifs",
  autre: "Autre demande",
};

/**
 * Le message part de l'adresse du site et non de celle du visiteur, qui
 * echouerait a l'authentification du domaine. C'est `Reply-To` qui porte son
 * adresse : le responsable de section repond directement depuis sa boite.
 *
 * L'objet reprend la section et le sujet pour que la boite reste triable, et
 * depasse toujours les dix caracteres exiges par Scaleway Transactional Email.
 */
export const buildContactMessage = (
  request: ContactRequest,
  recipient: ContactRecipient,
): ContactMessage => ({
  to: recipient.email,
  replyTo: request.email,
  subject: `[${recipient.activityTitle}] ${SUBJECT_LABELS[request.subject]} — ${request.name}`,
  text: [
    `Nom : ${request.name}`,
    `Email : ${request.email}`,
    `Téléphone : ${request.phone ?? "non communiqué"}`,
    `Sujet : ${SUBJECT_LABELS[request.subject]}`,
    `Section : ${recipient.activityTitle}`,
    "",
    "Message :",
    request.message,
    "",
    "—",
    "Envoyé depuis le formulaire de contact du site. Répondre à ce message",
    "écrit directement à la personne qui l'a envoyé.",
  ].join("\n"),
});
