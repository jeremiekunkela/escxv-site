import { Mail, Phone } from "lucide-react";
import type { CSSProperties } from "react";
import type { ContactChannel } from "@/features/contact/types/contact";
import styles from "./ContactBlocks.module.css";

type ContactBlocksProps = {
  contacts: ContactChannel[];
  emptyText?: string;
};

function toPhoneHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

const DEFAULT_EMPTY_TEXT =
  "Les coordonnées de la section ne sont pas encore disponibles.";

export function ContactBlocks({ contacts, emptyText }: ContactBlocksProps) {
  if (contacts.length === 0) {
    return <div className={styles.empty}>{emptyText ?? DEFAULT_EMPTY_TEXT}</div>;
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
