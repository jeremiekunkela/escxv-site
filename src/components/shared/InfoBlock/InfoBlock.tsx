import { AlertTriangle } from "lucide-react";
import styles from "./InfoBlock.module.css";

type InfoBlockProps = {
  title: string;
  children: React.ReactNode;
};

export function InfoBlock({ title, children }: InfoBlockProps) {
  return (
    <aside className={styles.block}>
      <div className={styles.inner}>
        <AlertTriangle aria-hidden="true" className={styles.icon} size={20} />
        <div>
          <p className={styles.title}>{title}</p>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </aside>
  );
}
