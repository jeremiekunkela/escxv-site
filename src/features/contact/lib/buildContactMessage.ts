import { getClubInfo } from "@/features/club/data-access/club";
import { renderContactEmailHtml } from "@/features/contact/lib/contactEmailTemplate";
import { siteUrl } from "@/lib/constants/routes";
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
  copyEmails: recipient.copyEmails,
  replyTo: request.email,
  subject: `[${recipient.label}] ${SUBJECT_LABELS[request.subject]} — ${request.name}`,
  html: renderContactEmailHtml({
    recipientLabel: recipient.label,
    name: request.name,
    email: request.email,
    phone: request.phone,
    subjectLabel: SUBJECT_LABELS[request.subject],
    message: request.message,
    siteUrl,
    siteName: new URL(siteUrl).host,
    logoUrl: `${siteUrl}/escxv-logo.png`,
    clubName: getClubInfo().shortName,
  }),
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
    `Répondez à ce message pour écrire à ${request.name}, à l'adresse ci-dessus.`,
    "Envoyé depuis le formulaire de contact du site.",
  ].join("\n"),
});
