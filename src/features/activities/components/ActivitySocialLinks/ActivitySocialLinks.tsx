import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import type { ActivitySocialLink } from "@/features/activities/types/activity";
import styles from "./ActivitySocialLinks.module.css";

type ActivitySocialLinksProps = {
  socialLinks: ActivitySocialLink[];
};

const SOCIAL_NETWORK_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
} as const;

/** Bases completes : TikTok garde l'arobase, que `sanitizeHandle` retire. */
const SOCIAL_NETWORK_URLS = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  tiktok: "https://www.tiktok.com/@",
  x: "https://x.com/",
} as const;

/** Un pictogramme par reseau, dessine au trait comme le reste des icones. */
const SOCIAL_NETWORK_ICONS = {
  facebook: <span className={styles.iconLetter}>f</span>,
  instagram: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="1" />
    </svg>
  ),
  tiktok: (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <circle cx="8" cy="16.5" r="3.5" />
      <path d="M11.5 16.5V4c.4 3.2 2.6 5.2 5.7 5.4" />
    </svg>
  ),
  x: <span className={styles.iconLetter}>X</span>,
} as const satisfies Record<ActivitySocialLink["network"], ReactNode>;

function SocialNetworkIcon({ network }: Pick<ActivitySocialLink, "network">) {
  return SOCIAL_NETWORK_ICONS[network];
}

function sanitizeHandle(handle: string) {
  return handle.trim().replace(/^@/, "");
}

function getSocialHref(socialLink: ActivitySocialLink) {
  if (socialLink.url) {
    return socialLink.url;
  }

  const handle = sanitizeHandle(socialLink.handle);

  return `${SOCIAL_NETWORK_URLS[socialLink.network]}${handle}`;
}

export function ActivitySocialLinks({ socialLinks }: ActivitySocialLinksProps) {
  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <aside className={styles.card} aria-labelledby="activity-social-links-title">
      <p className={styles.eyebrow}>Reseaux sociaux</p>
      <h3 id="activity-social-links-title" className={styles.title}>
        Suivre la section
      </h3>
      <div className={styles.links}>
        {socialLinks.map((socialLink) => {
          const handle = sanitizeHandle(socialLink.handle);
          const networkLabel = SOCIAL_NETWORK_LABELS[socialLink.network];

          return (
            <a
              key={`${socialLink.network}-${handle}`}
              href={getSocialHref(socialLink)}
              className={styles.link}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.icon} aria-hidden="true">
                <SocialNetworkIcon network={socialLink.network} />
              </span>
              <span className={styles.label}>
                <span>{networkLabel}</span>
                <strong>@{handle}</strong>
              </span>
              <ExternalLink size={16} aria-hidden="true" />
            </a>
          );
        })}
      </div>
    </aside>
  );
}
