"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import styles from "./ContactForm.module.css";

export type ContactFormRecipient = {
  slug: string;
  label: string;
};

type ContactFormProps = {
  /**
   * Un seul destinataire : le selecteur disparait, la page de section porte
   * deja l'information. Plusieurs : le visiteur choisit qui il ecrit.
   */
  recipients: ContactFormRecipient[];
  defaultRecipientSlug?: string;
  title: string;
  /** Omise, aucun paragraphe n'est rendu : le selecteur se suffit. */
  description?: string;
};

type SubmissionStatus = "idle" | "sending" | "sent" | "error";

const SUCCESS_MESSAGE =
  "Message envoyé. Vous recevrez une réponse à l'adresse indiquée.";

const DEVELOPMENT_SUCCESS_MESSAGE =
  "Message simulé en développement : aucun email réel n'a été envoyé.";

const NETWORK_ERROR_MESSAGE =
  "L'envoi a échoué. Vérifiez votre connexion ou écrivez directement au club.";

const SUBJECT_OPTIONS = [
  { value: "inscription", label: "Inscription" },
  { value: "cours-essai", label: "Cours d'essai" },
  { value: "horaires", label: "Horaires" },
  { value: "tarifs", label: "Tarifs" },
  { value: "autre", label: "Autre demande" },
];

export function ContactForm({
  recipients,
  defaultRecipientSlug,
  title,
  description,
}: ContactFormProps) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const tokenRequest = useRef<Promise<string> | null>(null);

  const singleRecipient = recipients.length === 1 ? recipients[0] : null;

  /**
   * Le jeton est demande des la premiere interaction, et non a l'envoi : il
   * date le debut de la saisie, ce qui permet au serveur d'ecarter les envois
   * instantanes. Une seule requete par formulaire, memorisee ici.
   */
  const ensureToken = () => {
    tokenRequest.current ??= fetch("/api/contact")
      .then((response) => (response.ok ? response.json() : null))
      .then((payload: { token?: string } | null) => payload?.token ?? "")
      .catch(() => "");

    return tokenRequest.current;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);

    setStatus("sending");
    setFeedback(null);

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipientSlug: singleRecipient?.slug ?? fields.get("recipientSlug"),
        token: await ensureToken(),
        name: fields.get("name"),
        email: fields.get("email"),
        phone: fields.get("phone"),
        subject: fields.get("subject"),
        message: fields.get("message"),
        website: fields.get("website"),
      }),
    }).catch(() => null);

    const payload: { deliveryMode?: "console" | "email"; error?: string } | null =
      (await response?.json().catch(() => null)) ?? null;

    if (!response?.ok) {
      setStatus("error");
      setFeedback(payload?.error ?? NETWORK_ERROR_MESSAGE);
      return;
    }

    // Un jeton ne vaut que pour un envoi : le suivant en redemande un.
    tokenRequest.current = null;
    form.reset();
    setStatus("sent");
    setFeedback(
      payload?.deliveryMode === "console"
        ? DEVELOPMENT_SUCCESS_MESSAGE
        : SUCCESS_MESSAGE,
    );
  };

  return (
    <div className={styles.card} data-reveal="zoom">
      <p className={styles.eyebrow}>Formulaire</p>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.text}>{description}</p> : null}
      <form className={styles.form} onSubmit={handleSubmit} onFocus={ensureToken}>
        {singleRecipient ? null : (
          <label className={styles.label}>
            Qui souhaitez-vous contacter ? *
            <select
              className={styles.field}
              name="recipientSlug"
              defaultValue={defaultRecipientSlug ?? ""}
              required
            >
              <option value="" disabled>
                Sélectionnez un destinataire
              </option>
              {recipients.map((recipient) => (
                <option key={recipient.slug} value={recipient.slug}>
                  {recipient.label}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className={styles.label}>
          Nom complet *
          <input
            type="text"
            name="name"
            className={styles.field}
            maxLength={80}
            autoComplete="name"
            required
          />
        </label>
        <label className={styles.label}>
          Email *
          <input
            type="email"
            name="email"
            className={styles.field}
            maxLength={120}
            autoComplete="email"
            required
          />
        </label>
        <label className={styles.label}>
          Téléphone
          <input
            type="tel"
            name="phone"
            className={styles.field}
            maxLength={30}
            autoComplete="tel"
          />
        </label>
        <label className={styles.label}>
          Sujet de votre demande *
          <select className={styles.field} name="subject" defaultValue="" required>
            <option value="" disabled>
              Sélectionnez un sujet
            </option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className={styles.label}>
          Message *
          <textarea
            name="message"
            className={`${styles.field} ${styles.textarea}`}
            maxLength={2000}
            required
          />
        </label>

        {/* Champ leurre : hors ecran et hors tabulation, seuls les robots le remplissent. */}
        <label className={styles.honeypot} aria-hidden="true">
          Ne remplissez pas ce champ
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>

        <p className={styles.consent}>
          Les informations saisies servent uniquement à vous répondre. Voir la{" "}
          <a href="/confidentialite">politique de confidentialité</a>.
        </p>

        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi en cours…" : "Envoyer"}
        </Button>

        <p
          className={`${styles.feedback} ${status === "error" ? styles.feedbackError : ""} ${status === "sent" ? styles.feedbackSuccess : ""}`}
          role="status"
          aria-live="polite"
        >
          {feedback}
        </p>
      </form>
    </div>
  );
}
