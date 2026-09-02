import {
  createConsoleSender,
  createResendSender,
} from "@/features/contact/data-access/contactSenders";
import { isSendableEmail } from "@/features/contact/lib/emailAddress";
import type { SendContactMessage } from "@/features/contact/types/contact";

const DEFAULT_FROM_NAME = "Site ESC XV";

const readEnv = (name: string) => process.env[name]?.trim() ?? "";

/**
 * Racine de composition du contact : le seul endroit qui lit l'environnement.
 *
 * Aucune regle ne depend du deploiement. Une configuration qui se devine
 * (secret de repli en developpement, emetteur console implicite, destinataire
 * force ignore en production) se teste mal : ce qu'on voit en local ne dit
 * plus ce que fera la production. Ici tout se declare, et la meme
 * configuration donne partout le meme comportement.
 */

/**
 * Destinataire force : tout part a cette adresse au lieu des boites de
 * section. Utile pour eprouver le parcours sans ecrire aux responsables. La
 * variable seule decide — un override silencieusement ignore ferait croire a
 * un test reussi.
 */
export const resolveRecipientOverrideEmail = () =>
  readEnv("CONTACT_RECIPIENT_OVERRIDE_EMAIL") ||
  readEnv("CONTACT_DEVELOPMENT_RECIPIENT_EMAIL") ||
  null;

/**
 * Suffixe de variable pour un destinataire : `course-a-pied-trail` devient
 * `COURSE_A_PIED_TRAIL`, le club `CLUB`.
 */
const toEnvSuffix = (slug: string) =>
  slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_");

/**
 * Adresses en copie d'un destinataire, declarees une variable par section :
 * `CONTACT_CC_FOOTBALL`, `CONTACT_CC_CLUB`... Absente, personne n'est en
 * copie — c'est le cas courant, on ne declare que les sections qui en ont
 * besoin. Plusieurs adresses se separent par des virgules.
 */
export const resolveRecipientCopyEmails = (slug: string) =>
  readEnv(`CONTACT_CC_${toEnvSuffix(slug)}`)
    .split(",")
    .map((email) => email.trim())
    .filter(isSendableEmail);

/** Sans secret declare, pas de jeton : la route refuse plutot que de faire
 * semblant de proteger avec une valeur connue. */
export const resolveTokenSecret = () => readEnv("CONTACT_TOKEN_SECRET") || null;

/**
 * Emetteur : Resend des que la cle et l'adresse d'envoi sont la.
 * `CONTACT_SENDER=console` affiche le message dans la console du serveur sans
 * rien envoyer, pour eprouver le parcours sans clef. Rien sinon.
 */
export const resolveContactSender = (): SendContactMessage | null => {
  const apiKey = readEnv("RESEND_API_KEY");
  const fromEmail = readEnv("CONTACT_FROM_EMAIL");
  const fromName = readEnv("CONTACT_FROM_NAME") || DEFAULT_FROM_NAME;

  return apiKey && isSendableEmail(fromEmail)
    ? createResendSender({ apiKey, fromEmail, fromName })
    : readEnv("CONTACT_SENDER") === "console"
      ? createConsoleSender()
      : null;
};

/**
 * Interrupteur des formulaires. `CONTACT_FORM_ENABLED=false` les coupe : les
 * pages basculent sur les adresses email et la route refuse de servir, sans
 * redeploiement de code.
 *
 * Un formulaire ne s'affiche de toute facon que si l'envoi est configure —
 * secret de jeton et emetteur. Mieux vaut l'adresse de la section qu'un champ
 * qui echoue une fois rempli.
 */
export const isContactFormEnabled = () =>
  readEnv("CONTACT_FORM_ENABLED") !== "false" &&
  resolveTokenSecret() !== null &&
  resolveContactSender() !== null;
