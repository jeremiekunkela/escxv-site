import Link from "next/link";
import Image from "next/image";
import { getFooterContent } from "@/features/navigation/data-access/navigation";
import { Container } from "@/components/ui/Container/Container";
import styles from "./SiteFooter.module.css";


export function SiteFooter() {
  const footer = getFooterContent();

  return (
    <footer className={styles.footer}>
      <Container className={styles.inner}>
        <div className={styles.brandBlock}>
          <div className={styles.brandHeader}>
            <span className={styles.logo}>
              <Image
                src="/escxv-logo.png"
                alt=""
                width={44}
                height={44}
                className={styles.logoImage}
              />
            </span>
            <div>
              <p className={styles.name}>{footer.club.shortName}</p>
              <p className={styles.kicker}>
                {footer.club.city} {footer.club.arrondissement.replace(" arrondissement", "")}
              </p>
            </div>
          </div>
          <p className={styles.description}>
            {footer.club.description}
          </p>
        </div>
        <div className={styles.links}>
          {footer.mainLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.link}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </Container>
    </footer>
  );
}
