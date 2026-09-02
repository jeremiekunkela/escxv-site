import { resolveAlertWebhookUrl } from "@/features/contact/lib/contactEnvironment";

/**
 * Alerte envoyee quand un message de contact n'a pas pu partir. Elle passe par
 * un webhook et non par email : prevenir d'une panne d'envoi en utilisant
 * l'envoi qui vient d'echouer ne previendrait personne.
 *
 * Sans `CONTACT_ALERT_WEBHOOK_URL`, il ne se passe rien : le journal serveur
 * reste la seule trace, comme avant.
 */
export type ContactAlert = {
  /** Ce qui a echoue, en clair : « envoi refuse », « destinataire invalide ». */
  reason: string;
  recipientSlug: string;
  /** Adresse du visiteur, pour pouvoir le rappeler si son message est perdu. */
  visitorEmail?: string;
  /** Nom du refus rendu par l'emetteur, quand il y en a un. */
  errorName?: string;
  errorMessage?: string;
  /** En-tete `x-vercel-id` de la requete : relie l'alerte aux journaux. */
  requestId?: string;
};

/** Trois secondes : au-dela, mieux vaut rendre la main au visiteur. */
const ALERT_TIMEOUT_MS = 3_000;

const formatAlert = (alert: ContactAlert) =>
  [
    "⚠️ Formulaire de contact en echec",
    `Quand : ${new Date().toISOString()}`,
    `Environnement : ${process.env.VERCEL_ENV ?? "hors-vercel"}`,
    "Route : /api/contact",
    `Cause : ${alert.reason}`,
    `Section : ${alert.recipientSlug}`,
    alert.errorName ? `Refus : ${alert.errorName}` : null,
    alert.errorMessage ? `Detail : ${alert.errorMessage}` : null,
    alert.visitorEmail ? `Visiteur : ${alert.visitorEmail}` : null,
    alert.requestId ? `Requete : ${alert.requestId}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

/**
 * Ne leve jamais et ne renvoie rien : une alerte qui echoue ne doit pas
 * transformer un envoi rate en page d'erreur. Le contenu du message du
 * visiteur n'est jamais transmis — seule son adresse l'est, pour qu'on puisse
 * le rappeler.
 */
export const sendContactAlert = async (alert: ContactAlert) => {
  const webhookUrl = resolveAlertWebhookUrl();

  if (!webhookUrl) {
    return;
  }

  const text = formatAlert(alert);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // `content` pour Discord, `text` pour Slack et Mattermost : le meme
      // corps convient aux trois, sans avoir a declarer lequel est branche.
      body: JSON.stringify({ content: text, text }),
      signal: AbortSignal.timeout(ALERT_TIMEOUT_MS),
    });

    if (!response.ok) {
      console.error("[contact] alerte refusee par le webhook", {
        status: response.status,
      });
    }
  } catch (error) {
    console.error("[contact] alerte impossible", error);
  }
};
