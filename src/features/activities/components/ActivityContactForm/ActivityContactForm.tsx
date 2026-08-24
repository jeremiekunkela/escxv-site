"use client";

import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import type { ActivityContent } from "@/features/activities/types/activity";
import styles from "./ActivityContactForm.module.css";

type ActivityContactFormProps = {
  activitySlug: string;
  content: ActivityContent;
};

type SubmissionStatus = "idle" | "sending" | "sent" | "error";

const DEFAULT_FORM_TEXT =
  "Votre message arrive directement dans la boîte de la section, qui vous répondra par email.";

const SUCCESS_MESSAGE =
  "Message envoyé. La section vous répondra à l'adresse indiquée.";

const DEVELOPMENT_SUCCESS_MESSAGE =
  "Message simulé en développement : aucun email réel n'a été envoyé.";

const NETWORK_ERROR_MESSAGE =
  "L'envoi a échoué. Vérifiez votre connexion ou écrivez directement à la section.";

const SUBJECT_OPTIONS = [
  { value: "inscription", label: "Inscription" },
  { value: "cours-essai", label: "Cours d'essai" },
  { value: "horaires", label: "Horaires" },
  { value: "tarifs", label: "Tarifs" },
  { value: "autre", label: "Autre demande" },
];

export function ActivityContactForm({
  activitySlug,
  content,
}: ActivityContactFormProps) {
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [feedback, setFeedback] = useState<string | null>(null);
  const tokenRequest = useRef<Promise<string> | null>(null);

  const contactFormText =
    content.contactFormText && content.contactFormText.trim().length > 0
      ? content.contactFormText
      : DEFAULT_FORM_TEXT;

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
        activitySlug,
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
      <h3 className={styles.title}>Envoyer un message</h3>
      <p className={styles.text}>{contactFormText}</p>
      <form className={styles.form} onSubmit={handleSubmit} onFocus={ensureToken}>
        <label className={styles.label}>
          Nom *
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
