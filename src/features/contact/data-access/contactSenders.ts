import type { SendContactMessage } from "@/features/contact/types/contact";

type ScalewaySenderConfig = {
  secretKey: string;
  projectId: string;
  region: string;
  fromEmail: string;
  fromName: string;
};

const TEM_ENDPOINT =
  "https://api.scaleway.com/transactional-email/v1alpha1/regions";

/**
 * Emetteur de developpement : rien ne part, le message s'affiche dans la
 * console du serveur. Il permet d'eprouver tout le parcours sans attendre les
 * acces Scaleway, et n'est jamais retenu en production.
 */
export const createConsoleSender = (): SendContactMessage => async (message) => {
  console.info(
    "[contact] message non envoyé (émetteur de développement)\n",
    message,
  );

  return { mode: "console" };
};

/**
 * Adaptateur Scaleway Transactional Email. `additional_headers` est le seul
 * moyen d'y poser un `Reply-To` : il n'existe pas de champ dedie.
 */
export const createScalewaySender =
  (config: ScalewaySenderConfig): SendContactMessage =>
  async (message) => {
    const response = await fetch(`${TEM_ENDPOINT}/${config.region}/emails`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Token": config.secretKey,
      },
      body: JSON.stringify({
        from: { name: config.fromName, email: config.fromEmail },
        to: [{ email: message.to }],
        subject: message.subject,
        text: message.text,
        project_id: config.projectId,
        additional_headers: [{ key: "Reply-To", value: message.replyTo }],
      }),
    });

    if (!response.ok) {
      throw new Error(
        `Scaleway Transactional Email a répondu ${response.status}.`,
      );
    }

    return { mode: "email" };
  };
