import { Button } from "@/components/ui/Button/Button";
import type { ActivityContent } from "@/features/activities/types/activity";
import styles from "./ActivityContactForm.module.css";

type ActivityContactFormProps = {
  content: ActivityContent;
};

export function ActivityContactForm({ content }: ActivityContactFormProps) {
  const contactFormText =
    content.contactFormText && content.contactFormText.trim().length > 0
      ? content.contactFormText
      : "Formulaire statique en attente d'activation fonctionnelle.";

  return (
    <div className={styles.card} data-reveal="zoom">
      <p className={styles.eyebrow}>Formulaire</p>
      <h3 className={styles.title}>Envoyer un message</h3>
      <p className={styles.text}>{contactFormText}</p>
      <form className={styles.form}>
        <label className={styles.label}>
          Nom
          <input type="text" className={styles.field} />
        </label>
        <label className={styles.label}>
          Email
          <input type="email" className={styles.field} />
        </label>
        <label className={styles.label}>
          Telephone
          <input type="tel" className={styles.field} />
        </label>
        <label className={styles.label}>
          Sujet de votre demande *
          <select className={styles.field} defaultValue="" required>
            <option value="" disabled>
              Selectionnez un sujet
            </option>
            <option value="inscription">Inscription</option>
            <option value="cours-essai">Cours d&apos;essai</option>
            <option value="horaires">Horaires</option>
            <option value="tarifs">Tarifs</option>
            <option value="autre">Autre demande</option>
          </select>
        </label>
        <label className={styles.label}>
          Message
          <textarea className={`${styles.field} ${styles.textarea}`} />
        </label>
        <Button type="button">Envoyer</Button>
      </form>
    </div>
  );
}
