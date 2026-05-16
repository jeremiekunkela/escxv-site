import { Button } from "@/components/ui/Button/Button";
import type { ActivityContent } from "@/features/activities/types/activity";
import styles from "./ActivityContactForm.module.css";

type ActivityContactFormProps = {
  content: ActivityContent;
};

export function ActivityContactForm({ content }: ActivityContactFormProps) {
  return (
    <div className={styles.card}>
      <p className={styles.eyebrow}>{content.formEyebrow ?? content.contactFormTitle}</p>
      <h3 className={styles.title}>{content.contactFormTitle}</h3>
      <p className={styles.text}>{content.contactFormText}</p>
      <form className={styles.form}>
        <label className={styles.label}>
          {content.formNameLabel ?? "Nom"}
          <input type="text" className={styles.field} />
        </label>
        <label className={styles.label}>
          {content.formEmailLabel ?? "Email"}
          <input type="email" className={styles.field} />
        </label>
        <label className={styles.label}>
          {content.formPhoneLabel ?? "Telephone"}
          <input type="tel" className={styles.field} />
        </label>
        <label className={styles.label}>
          {content.formMessageLabel ?? "Message"}
          <textarea className={`${styles.field} ${styles.textarea}`} />
        </label>
        <Button type="button">{content.formSubmitLabel ?? "Envoyer"}</Button>
      </form>
    </div>
  );
}
