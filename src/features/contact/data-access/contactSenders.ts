import { Resend } from "resend";
import type { SendContactMessage } from "@/features/contact/types/contact";

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

  return { mode: "console" };
};

/**
 * Adaptateur Resend. L'adresse `from` doit appartenir a un domaine verifie
 * dans Resend ; l'adresse du visiteur reste en `replyTo`.
 */
export const createResendSender =
  (config: ResendSenderConfig): SendContactMessage =>
  async (message) => {
    const resend = new Resend(config.apiKey);
    const { error } = await resend.emails.send({
      from: `${config.fromName} <${config.fromEmail}>`,
      to: [message.to],
      cc: message.copyEmails.length > 0 ? message.copyEmails : undefined,
      subject: message.subject,
      text: message.text,
      html: message.html,
      replyTo: message.replyTo,
    });

    if (error) {
      throw new Error(`Resend a refuse l'envoi : ${error.message}`);
    }

    return { mode: "email" };
  };
