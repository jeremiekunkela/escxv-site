import { Resend } from "resend";
import type {
  ContactMessage,
  SendContactMessage,
} from "@/features/contact/types/contact";

type ResendSenderConfig = {
  apiKey: string;
  fromEmail: string;
  fromName: string;
};

/**
 * Emetteur de developpement : rien ne part, le message s'affiche dans la
 * console du serveur. Il permet d'eprouver tout le parcours sans attendre la
 * cle Resend, et n'est jamais retenu en production.
 */
export const createConsoleSender = (): SendContactMessage => async (message) => {
  console.info(
    "[contact] message non envoyé (émetteur de développement)\n",
    message,
  );

  return { mode: "console", messageId: null };
};

/**
 * Etiquettes Resend. Leurs valeurs n'acceptent que des lettres ASCII, des
 * chiffres, `_` et `-` : les slugs et les booleens passent tels quels, et
 * rien d'autre n'a besoin de voyager par la.
 */
const toResendTags = (metadata: ContactMessage["metadata"]) => [
  { name: "recipient", value: metadata.recipientSlug },
  { name: "allow_fallback", value: metadata.allowFallback ? "true" : "false" },
  { name: "delivery_type", value: metadata.deliveryType },
];

/**
 * Adaptateur Resend. L'adresse `from` doit appartenir a un domaine verifie
 * dans Resend ; l'adresse du visiteur reste en `replyTo`.
 */
export const createResendSender =
  (config: ResendSenderConfig): SendContactMessage =>
  async (message) => {
    const resend = new Resend(config.apiKey);
    const { data, error } = await resend.emails.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
      tags: toResendTags(message.metadata),
    });

    if (error) {
      // Le nom du refus (`validation_error`, `rate_limit_exceeded`...) est ce
      // qui permet de trancher entre donnee fautive et incident passager.
      console.error("[contact] Resend a refuse l'envoi", {
        name: error.name,
        message: error.message,
      });

      throw new Error(`Resend a refuse l'envoi : ${error.name} — ${error.message}`);
    }

    /**
     * L'identifiant est la seule prise sur ce message une fois parti : c'est
     * lui que portera l'evenement si la boite distante le refuse.
     */
    return { mode: "email", messageId: data?.id ?? null };
  };
