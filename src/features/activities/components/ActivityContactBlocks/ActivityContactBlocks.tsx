import { Mail, Phone } from "lucide-react";
import type { ActivityContact } from "@/features/activities/types/activity";
import styles from "./ActivityContactBlocks.module.css";

type ActivityContactBlocksProps = {
  contacts: ActivityContact[];
};

export function ActivityContactBlocks({ contacts }: ActivityContactBlocksProps) {
  return (
    <div className={styles.grid}>
      {contacts.map((contact) => (
        <article key={contact.id} className={styles.card}>
          <p className={styles.role}>{contact.role}</p>
          <h3 className={styles.name}>{contact.name}</h3>
          <div className={styles.links}>
            <a href={`mailto:${contact.email}`} className={styles.link}>
              <Mail aria-hidden="true" size={18} />
              {contact.email}
            </a>
            {contact.phone ? (
              <p className={styles.phone}>
                <Phone aria-hidden="true" size={18} />
                {contact.phone}
              </p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
