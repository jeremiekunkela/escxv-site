import { ExternalLink } from "lucide-react";
import type { ActivitySocialLink } from "@/features/activities/types/activity";
import styles from "./ActivitySocialLinks.module.css";

type ActivitySocialLinksProps = {
  socialLinks: ActivitySocialLink[];
};

const SOCIAL_NETWORK_LABELS = {
  facebook: "Facebook",
  instagram: "Instagram",
  x: "X",
} as const;

const SOCIAL_NETWORK_URLS = {
  facebook: "https://www.facebook.com/",
  instagram: "https://www.instagram.com/",
  x: "https://x.com/",
} as const;

function SocialNetworkIcon({ network }: Pick<ActivitySocialLink, "network">) {
  if (network === "instagram") {
    return (
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.3" cy="6.7" r="1" />
      </svg>
    );
  }

  return <span className={styles.iconLetter}>{network === "facebook" ? "f" : "X"}</span>;
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
