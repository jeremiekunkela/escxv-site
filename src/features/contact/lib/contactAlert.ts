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

/**
 * Alerte de rebond. Elle ne suit pas le meme chemin que la precedente : un
 * rebond arrive longtemps apres la requete du visiteur, dans une invocation
 * qui ne rend de page a personne. Ce qu'elle doit dire tient en une question
 * — le message a-t-il fini par arriver quelque part, et sinon pourquoi.
 */
export type ContactBounceAlert = {
  recipientSlug: string;
  /** Adresse qui a refuse le message. */
  originalRecipient: string;
  bounceType: string;
  bounceSubType: string;
  bounceMessage: string;
  /** Ce qui a ete fait du message : renvoye, ou seulement signale. */
  outcome:
    | { kind: "fallback-sent"; fallbackRecipient: string }
    | {
        kind: "fallback-failed";
        fallbackRecipient: string;
        errorMessage: string;
      }
    | { kind: "no-fallback"; reason: string };
  visitorEmail?: string;
  emailId: string;
};

const formatBounceAlert = (alert: ContactBounceAlert) =>
  [
    alert.outcome.kind === "fallback-failed"
      ? "🚨 Echec du renvoi du formulaire de contact"
      : "⚠️ Rebond du formulaire de contact",
    `Quand : ${new Date().toISOString()}`,
    `Environnement : ${process.env.VERCEL_ENV ?? "hors-vercel"}`,
    `Section : ${alert.recipientSlug}`,
    `Destination initiale : ${alert.originalRecipient}`,
    `Type : ${alert.bounceType}${alert.bounceSubType ? ` / ${alert.bounceSubType}` : ""}`,
    `Raison : ${alert.bounceMessage}`,
    alert.visitorEmail ? `Visiteur : ${alert.visitorEmail}` : null,
    `Message Resend : ${alert.emailId}`,
    "",
    alert.outcome.kind === "fallback-sent"
      ? `Le visiteur avait autorise le renvoi. Message transmis a ${alert.outcome.fallbackRecipient}.`
      : alert.outcome.kind === "fallback-failed"
        ? `Le message n'a pu etre delivre ni a l'adresse de section ni a ${alert.outcome.fallbackRecipient}.\nRefus : ${alert.outcome.errorMessage}`
        : `Aucun renvoi effectue : ${alert.outcome.reason}.`,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

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
export const sendContactAlert = async (alert: ContactAlert) =>
  postAlert(formatAlert(alert));

/**
 * Meme voie, meme silence en cas d'echec : le rebond est deja un incident, en
 * rater l'alerte ne doit pas en creer un second dans les journaux.
 */
export const sendContactBounceAlert = async (alert: ContactBounceAlert) =>
  postAlert(formatBounceAlert(alert));

const postAlert = async (text: string) => {
  const webhookUrl = resolveAlertWebhookUrl();

  if (!webhookUrl) {
    return;
  }

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
