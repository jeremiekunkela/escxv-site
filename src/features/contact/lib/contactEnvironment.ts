import {
  createConsoleSender,
  createResendSender,
} from "@/features/contact/data-access/contactSenders";
import type { SendContactMessage } from "@/features/contact/types/contact";

/**
 * Secret de repli, reserve au developpement. En production un secret connu
 * rendrait le jeton falsifiable, donc inutile : la route refuse alors de
 * servir plutot que de faire semblant de proteger.
 */
const DEVELOPMENT_TOKEN_SECRET = "dev-only-contact-token-secret";

const DEFAULT_FROM_NAME = "Site ESC XV";

const isProduction = () => process.env.NODE_ENV === "production";

const readEnv = (name: string) => process.env[name]?.trim() ?? "";

const isProductionDeployment = () =>
  process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : isProduction();

export const resolveRecipientOverrideEmail = () => {
  const email =
    readEnv("CONTACT_RECIPIENT_OVERRIDE_EMAIL") ||
    readEnv("CONTACT_DEVELOPMENT_RECIPIENT_EMAIL");

  return !isProductionDeployment() && email && email.length > 0 ? email : null;
};

export const resolveTokenSecret = () => {
  const secret = readEnv("CONTACT_TOKEN_SECRET");

  return secret && secret.length > 0
    ? secret
    : isProduction()
      ? null
      : DEVELOPMENT_TOKEN_SECRET;
};

/**
 * Racine de composition : le seul endroit qui lit l'environnement et decide
 * quel emetteur brancher. Tant que la cle Resend manque, le
 * developpement tourne sur la console ; la production, elle, refuse d'envoyer
 * dans le vide.
 */
export const resolveContactSender = (): SendContactMessage | null => {
  const apiKey = readEnv("RESEND_API_KEY");
  const fromEmail = readEnv("CONTACT_FROM_EMAIL");
  const fromName = readEnv("CONTACT_FROM_NAME") || DEFAULT_FROM_NAME;

  return apiKey && fromEmail
    ? createResendSender({
        apiKey,
        fromEmail,
        fromName,
      })
    : isProduction()
      ? null
      : createConsoleSender();
};
