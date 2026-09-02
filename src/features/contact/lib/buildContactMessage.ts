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
 * L'objet reprend le destinataire et le sujet pour que la boite reste
 * triable, qu'il s'agisse d'une section ou du club.
 */
export const buildContactMessage = (
  request: ContactRequest,
  recipient: ContactRecipient,
): ContactMessage => ({
  to: recipient.email,
  replyTo: request.email,
  subject: `[${recipient.label}] ${SUBJECT_LABELS[request.subject]} — ${request.name}`,
  text: [
    `Nom : ${request.name}`,
    `Email : ${request.email}`,
    `Téléphone : ${request.phone ?? "non communiqué"}`,
    `Sujet : ${SUBJECT_LABELS[request.subject]}`,
    `Destinataire : ${recipient.label}`,
    "",
    "Message :",
    request.message,
    "",
    "—",
    "Envoyé depuis le formulaire de contact du site. Répondre à ce message",
    "écrit directement à la personne qui l'a envoyé.",
  ].join("\n"),
});
