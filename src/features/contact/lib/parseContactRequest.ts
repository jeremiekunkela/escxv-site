import { isAsciiEmail, isSendableEmail } from "@/features/contact/lib/emailAddress";
import type {
  ContactRequest,
  ContactSubject,
  ParseResult,
} from "@/features/contact/types/contact";

const SUBJECTS: ContactSubject[] = [
  "inscription",
  "cours-essai",
  "horaires",
  "tarifs",
  "autre",
];

const LIMITS = {
  name: { min: 2, max: 80 },
  email: { max: 120 },
  phone: { max: 30 },
  message: { min: 10, max: 2000 },
} as const;

/**
 * Un retour a la ligne dans un champ recopie en en-tete permettrait d'en
 * injecter d'autres (Bcc, Reply-To) : ces champs restent sur une ligne.
 */
const HEADER_BREAK_PATTERN = /[\r\n]/;

export const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

export const readRecord = (payload: unknown): Record<string, unknown> =>
  typeof payload === "object" && payload !== null
    ? (payload as Record<string, unknown>)
    : {};

export const parseContactRequest = (
  payload: unknown,
): ParseResult<ContactRequest> => {
  const raw = readRecord(payload);
  const recipientSlug = readString(raw.recipientSlug);
  const name = readString(raw.name);
  const email = readString(raw.email);
  const phone = readString(raw.phone);
  const message = readString(raw.message);
  const subject = SUBJECTS.find((candidate) => candidate === readString(raw.subject));

  const violations = [
    recipientSlug.length === 0 && "Le destinataire est manquant.",
    name.length < LIMITS.name.min && "Merci d'indiquer votre nom.",
    name.length > LIMITS.name.max && "Le nom est trop long.",
    HEADER_BREAK_PATTERN.test(name) && "Le nom contient des caractères invalides.",
    !isSendableEmail(email) &&
      (isAsciiEmail(email)
        ? "L'adresse email n'est pas valide."
        : "Les adresses email accentuées ne sont pas acceptées."),
    email.length > LIMITS.email.max && "L'adresse email est trop longue.",
    phone.length > LIMITS.phone.max && "Le numéro de téléphone est trop long.",
    !subject && "Merci de choisir un sujet.",
    message.length < LIMITS.message.min && "Le message est trop court.",
    message.length > LIMITS.message.max && "Le message est trop long.",
  ].filter((violation): violation is string => typeof violation === "string");

  // `!subject` est deja dans les violations : le retester ici sert au typage,
  // qui ne peut pas deduire le retrait de `undefined` depuis le tableau.
  if (!subject || violations.length > 0) {
    return { ok: false, violations };
  }

  return {
    ok: true,
    value: {
      recipientSlug,
      name,
      email,
      phone: phone.length > 0 ? phone : null,
      subject,
      message,
    },
  };
};
