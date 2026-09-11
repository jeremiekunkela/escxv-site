import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sendContactBounceAlert } from "@/features/contact/lib/contactAlert";
import {
  buildFallbackHtml,
  buildFallbackIdempotencyKey,
  buildFallbackSubject,
  buildFallbackText,
  decideBounceOutcome,
} from "@/features/contact/lib/contactBounce";
import {
  resolveContactSenderConfig,
  resolveFallbackEmail,
  resolveWebhookSecret,
} from "@/features/contact/lib/contactEnvironment";
import { isSendableEmail } from "@/features/contact/lib/emailAddress";

/** La verification de signature s'appuie sur `node:crypto`. */
export const runtime = "nodejs";

/**
 * Evenements de livraison rendus par Resend.
 *
 * Un message accepte par Resend n'est pas un message arrive : le refus de la
 * boite distante revient ici, des minutes plus tard, dans une invocation qui
 * ne rend de page a personne. C'est le seul endroit ou le site apprend qu'un
 * message s'est perdu.
 *
 * Rien n'est retenu entre l'envoi et le rebond : les etiquettes posees a
 * l'envoi reviennent dans l'evenement, et le corps du message se relit chez
 * Resend. Le site n'a donc pas de memoire a tenir, ni a purger.
 */

/** Toujours 200 : un refus ferait rejouer l'evenement sans fin par Resend. */
const acknowledge = () => NextResponse.json({ ok: true });

export const POST = async (request: Request) => {
  const webhookSecret = resolveWebhookSecret();
  const senderConfig = resolveContactSenderConfig();

  if (!webhookSecret) {
    console.error("[contact] RESEND_WEBHOOK_SECRET absent : evenement refuse");

    return NextResponse.json(
      { error: "Webhook non configuré" },
      { status: 500 },
    );
  }

  /**
   * Le corps brut, et lui seul : la signature porte sur les octets recus.
   * Les relire apres un `json()` donnerait un texte reserialise, dont la
   * signature ne correspondrait plus.
   */
  const payload = await request.text();

  const event = (() => {
    try {
      const resend = new Resend(senderConfig?.apiKey);

      /**
       * Le SDK veut les trois en-tetes Svix separement, pas l'objet de la
       * requete. Absents, ils passent en chaines vides : la verification
       * echoue alors comme pour une signature fausse, ce qui est bien le cas.
       */
      return resend.webhooks.verify({
        payload,
        headers: {
          id: request.headers.get("svix-id") ?? "",
          timestamp: request.headers.get("svix-timestamp") ?? "",
          signature: request.headers.get("svix-signature") ?? "",
        },
        webhookSecret,
      });
    } catch (error) {
      console.error("[contact] signature d'evenement invalide", error);

      return null;
    }
  })();

  if (!event) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type !== "email.bounced") {
    return acknowledge();
  }

  const { email_id: emailId, to, tags, bounce } = event.data;
  const originalRecipient = to[0] ?? "destinataire inconnu";

  /**
   * Sans emetteur configure, rien ne peut etre relu ni renvoye. L'alerte
   * part quand meme : c'est elle qui fait remonter l'incident.
   */
  const original = senderConfig
    ? await new Resend(senderConfig.apiKey).emails
        .get(emailId)
        .then(({ data }) => data)
        .catch((error: unknown) => {
          console.error("[contact] message d'origine illisible", error);

          return null;
        })
    : null;

  const outcome = decideBounceOutcome({
    tags,
    hasOriginalMessage: original !== null,
  });

  const visitorEmail = original?.reply_to?.[0];
  const declaredFallback = resolveFallbackEmail();
  const fallbackRecipient =
    declaredFallback && isSendableEmail(declaredFallback)
      ? declaredFallback
      : null;

  if (
    outcome.action === "alert-only" ||
    !original ||
    !senderConfig ||
    !fallbackRecipient
  ) {
    await sendContactBounceAlert({
      recipientSlug: tags?.recipient ?? "inconnue",
      originalRecipient,
      bounceType: bounce.type,
      bounceSubType: bounce.subType,
      bounceMessage: bounce.message,
      outcome: {
        kind: "no-fallback",
        reason:
          outcome.action === "alert-only"
            ? outcome.reason
            : fallbackRecipient
              ? "emetteur indisponible"
              : "aucune adresse de repli exploitable",
      },
      visitorEmail,
      emailId,
    });

    return acknowledge();
  }

  const notice = {
    originalRecipient,
    fallbackRecipient,
    bounceMessage: bounce.message,
  };

  /**
   * Nouvel envoi, et non un transfert du message rebondi : le corps d'origine
   * est relu chez Resend et repart precede de son bandeau. La clef
   * d'idempotence porte l'identifiant du message refuse — une seconde
   * livraison du meme evenement ne fait pas partir un second message.
   */
  const { error } = await new Resend(senderConfig.apiKey).emails.send(
    {
      from: `${senderConfig.fromName} <${senderConfig.fromEmail}>`,
      to: [fallbackRecipient],
      subject: buildFallbackSubject(original.subject),
      text: buildFallbackText({ originalText: original.text ?? "", ...notice }),
      html: buildFallbackHtml({ originalHtml: original.html ?? "", ...notice }),
      replyTo: visitorEmail,
      tags: [
        { name: "recipient", value: tags?.recipient ?? "inconnue" },
        { name: "delivery_type", value: "fallback" },
      ],
    },
    { idempotencyKey: buildFallbackIdempotencyKey(emailId) },
  );

  await sendContactBounceAlert({
    recipientSlug: tags?.recipient ?? "inconnue",
    originalRecipient,
    bounceType: bounce.type,
    bounceSubType: bounce.subType,
    bounceMessage: bounce.message,
    outcome: error
      ? {
          kind: "fallback-failed",
          fallbackRecipient,
          errorMessage: `${error.name} — ${error.message}`,
        }
      : { kind: "fallback-sent", fallbackRecipient },
    visitorEmail,
    emailId,
  });

  return acknowledge();
};
