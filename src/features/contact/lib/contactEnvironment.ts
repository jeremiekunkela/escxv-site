import {
  createConsoleSender,
  createResendSender,
} from "@/features/contact/data-access/contactSenders";
import { getClubInfo } from "@/features/club/data-access/club";
import { IS_CONTACT_MAINTENANCE } from "@/features/contact/lib/contactMaintenance";
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

/** Sans secret declare, pas de jeton : la route refuse plutot que de faire
 * semblant de proteger avec une valeur connue. */
export const resolveTokenSecret = () => readEnv("CONTACT_TOKEN_SECRET") || null;

/**
 * Emetteur : Resend des que la cle et l'adresse d'envoi sont la.
 * `CONTACT_SENDER=console` affiche le message dans la console du serveur sans
 * rien envoyer, pour eprouver le parcours sans clef. Rien sinon.
 */
export type ContactSenderConfig = {
  apiKey: string;
  fromEmail: string;
  fromName: string;
};

/**
 * Acces Resend, quand il est declare. La route de rebond s'en sert aussi :
 * elle relit le message refuse et le renvoie, ce qui demande la meme cle et
 * la meme adresse d'expedition que l'envoi d'origine.
 */
export const resolveContactSenderConfig = (): ContactSenderConfig | null => {
  const apiKey = readEnv("RESEND_API_KEY");
  const fromEmail = readEnv("CONTACT_FROM_EMAIL");
  const fromName = readEnv("CONTACT_FROM_NAME") || DEFAULT_FROM_NAME;

  return apiKey && isSendableEmail(fromEmail)
    ? { apiKey, fromEmail, fromName }
    : null;
};

export const resolveContactSender = (): SendContactMessage | null => {
  const config = resolveContactSenderConfig();

  return config
    ? createResendSender(config)
    : readEnv("CONTACT_SENDER") === "console"
      ? createConsoleSender()
      : null;
};

/**
 * Interrupteur des formulaires. `CONTACT_FORM_ENABLED=false` les coupe : les
 * pages basculent sur les adresses email et la route refuse de servir, sans
 * redeploiement de code. La maintenance du formulaire le coupe de meme,
 * depuis le code cette fois — cf. contactMaintenance.
 *
 * Un formulaire ne s'affiche de toute facon que si l'envoi est configure —
 * secret de jeton et emetteur. Mieux vaut l'adresse de la section qu'un champ
 * qui echoue une fois rempli.
 */
export const isContactFormEnabled = () =>
  !IS_CONTACT_MAINTENANCE &&
  readEnv("CONTACT_FORM_ENABLED") !== "false" &&
  resolveTokenSecret() !== null &&
  resolveContactSender() !== null;

/**
 * Secret de signature des evenements Resend. Sans lui, la route de rebond
 * refuse tout : une signature qu'on ne peut pas verifier ne prouve rien, et
 * un endpoint qui accepte n'importe quel corps declencherait des envois sur
 * commande.
 */
export const resolveWebhookSecret = () =>
  readEnv("RESEND_WEBHOOK_SECRET") || null;

/**
 * Adresse de repli d'un message refuse par une boite de section. Elle est
 * decidee ici et nulle part ailleurs : ni le navigateur, ni l'evenement de
 * rebond n'ont voix au chapitre, sans quoi un tiers choisirait ou le site
 * envoie. Sans variable, c'est l'adresse generale du club.
 */
export const resolveFallbackEmail = () => {
  const declared = readEnv("CONTACT_FALLBACK_EMAIL");

  return isSendableEmail(declared) ? declared : getClubInfo().email;
};

/**
 * Webhook d'alerte, appele quand un message n'a pas pu partir. Vide, il ne se
 * passe rien : le journal serveur reste la seule trace.
 */
export const resolveAlertWebhookUrl = () =>
  readEnv("CONTACT_ALERT_WEBHOOK_URL") || null;
