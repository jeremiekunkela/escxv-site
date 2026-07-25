import styles from "./SectionTitle.module.css";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
};

export function SectionTitle({ eyebrow, title }: SectionTitleProps) {
  return (
    <div className={styles.block} data-reveal>
      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
