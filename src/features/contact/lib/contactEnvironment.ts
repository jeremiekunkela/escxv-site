import {
  createConsoleSender,
  createScalewaySender,
} from "@/features/contact/data-access/contactSenders";
import type { SendContactMessage } from "@/features/contact/types/contact";

/**
 * Secret de repli, reserve au developpement. En production un secret connu
 * rendrait le jeton falsifiable, donc inutile : la route refuse alors de
 * servir plutot que de faire semblant de proteger.
 */
const DEVELOPMENT_TOKEN_SECRET = "dev-only-contact-token-secret";

const DEFAULT_REGION = "fr-par";
const DEFAULT_FROM_NAME = "Site ESC XV";

const isProduction = () => process.env.NODE_ENV === "production";

export const resolveTokenSecret = () => {
  const secret = process.env.CONTACT_TOKEN_SECRET;

  return secret && secret.length > 0
    ? secret
    : isProduction()
      ? null
      : DEVELOPMENT_TOKEN_SECRET;
};

/**
 * Racine de composition : le seul endroit qui lit l'environnement et decide
 * quel emetteur brancher. Tant que les acces Scaleway manquent, le
 * developpement tourne sur la console ; la production, elle, refuse d'envoyer
 * dans le vide.
 */
export const resolveContactSender = (): SendContactMessage | null => {
  const secretKey = process.env.SCW_SECRET_KEY;
  const projectId = process.env.SCW_DEFAULT_PROJECT_ID;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  return secretKey && projectId && fromEmail
    ? createScalewaySender({
        secretKey,
        projectId,
        fromEmail,
        region: process.env.SCW_DEFAULT_REGION ?? DEFAULT_REGION,
        fromName: process.env.CONTACT_FROM_NAME ?? DEFAULT_FROM_NAME,
      })
    : isProduction()
      ? null
      : createConsoleSender();
};
