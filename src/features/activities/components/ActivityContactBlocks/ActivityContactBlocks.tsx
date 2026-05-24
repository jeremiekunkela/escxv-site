import { Mail, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import type { ActivityContact } from "@/features/activities/types/activity";
import styles from "./ActivityContactBlocks.module.css";

type ActivityContactBlocksProps = {
  contacts: ActivityContact[];
};

function toPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function ActivityContactBlocks({ contacts }: ActivityContactBlocksProps) {
  if (contacts.length === 0) {
    return (
      <div className={styles.empty}>
        Les coordonnees de la section ne sont pas encore disponibles.
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {contacts.map((contact, index) => (
        <article
          key={contact.id}
          className={styles.card}
          data-reveal="zoom"
          style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
        >
          <p className={styles.role}>{contact.role}</p>
          <h3 className={styles.name}>{contact.name}</h3>
          <div className={styles.links}>
            <a href={`mailto:${contact.email}`} className={styles.link}>
              <Mail aria-hidden="true" size={18} />
              {contact.email}
            </a>
            {contact.phone ? (
              <a href={toPhoneHref(contact.phone)} className={`${styles.link} ${styles.phone}`}>
                <Phone aria-hidden="true" size={18} />
                {contact.phone}
              </a>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
