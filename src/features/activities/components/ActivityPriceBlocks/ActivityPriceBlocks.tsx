import { formatEuro } from "@/lib/utils";
import type { CSSProperties } from "react";
import type { ActivityPrice } from "@/features/activities/types/activity";
import styles from "./ActivityPriceBlocks.module.css";

type ActivityPriceBlocksProps = {
  prices: ActivityPrice[];
};

export function ActivityPriceBlocks({ prices }: ActivityPriceBlocksProps) {
  if (prices.length === 0) {
    return <p className={styles.empty}>Aucun tarif n&apos;est encore renseigné.</p>;
  }

  return (
    <div className={styles.grid}>
      {prices.map((price, index) => (
        <article
          key={price.id}
          className={styles.card}
          data-reveal="zoom"
          style={{ "--reveal-delay": `${index * 70}ms` } as CSSProperties}
        >
          <p className={styles.label}>{price.label}</p>
          <p className={styles.total}>{formatEuro(price.total)}</p>
          <p className={styles.season}>{price.season}</p>
          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>Cotisation club (règlement unique par saison)</dt>
              <dd className={styles.amount}>{formatEuro(price.clubFee)}</dd>
            </div>
            <div className={styles.row}>
              <dt>Participation activité</dt>
              <dd className={styles.amount}>{formatEuro(price.activityFee)}</dd>
            </div>
          </dl>
          {price.extraFees.length > 0 ? (
            <>
              <p className={styles.extraFeesTitle}>En supplément</p>
              <ul className={styles.extraFees}>
                {price.extraFees.map((extraFee) => (
                  <li key={extraFee.label} className={styles.extraFee}>
                    <span>{extraFee.label}</span>
                    <span className={styles.amount}>
                      {formatEuro(extraFee.amount)}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </article>
      ))}
    </div>
  );
}
