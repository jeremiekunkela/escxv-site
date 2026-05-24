"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import type {
  NavigationContent,
  NavigationLink,
} from "@/features/navigation/types/navigation";
import styles from "./SiteHeader.module.css";

type SiteHeaderClientProps = {
  navigation: NavigationContent;
};

function ActivityLinkIcon({ item }: { item: NavigationLink }) {
  return (
    <span className={styles.activityPictogram} aria-hidden="true">
      {item.iconName ?? "sports"}
    </span>
  );
}

export function SiteHeaderClient({ navigation }: SiteHeaderClientProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const dropdownId = "activities-dropdown";

  useEffect(() => {
    if (!openDropdown) return;

    function handleClick(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openDropdown]);

  function closeDropdownWhenFocusLeaves(event: FocusEvent<HTMLDivElement>) {
    const nextFocusedElement = event.relatedTarget;

    if (!dropdownRef.current || !nextFocusedElement) {
      setOpenDropdown(false);
      return;
    }

    if (!dropdownRef.current.contains(nextFocusedElement)) {
      setOpenDropdown(false);
    }
  }

  function handleDropdownKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpenDropdown(false);
    }
  }

  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>
            <Image
              src="/escxv-logo.png"
              alt=""
              width={36}
              height={36}
              priority
              className={styles.logoImage}
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{navigation.club.shortName}</span>
            <span className={styles.brandMeta}>
              {navigation.club.city}{" "}
              {navigation.club.arrondissement.replace(" arrondissement", "")}
            </span>
          </span>
        </Link>

        <div className={styles.desktopLinks}>
          {navigation.mainLinks.map((item) => (
            <Link key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </Link>
          ))}
          {navigation.activityLinks.length > 0 ? (
            <div
              className={styles.dropdownWrapper}
              ref={dropdownRef}
              onMouseEnter={() => setOpenDropdown(true)}
              onMouseLeave={() => setOpenDropdown(false)}
              onFocus={() => setOpenDropdown(true)}
              onBlur={closeDropdownWhenFocusLeaves}
              onKeyDown={handleDropdownKeyDown}
            >
              <div className={styles.dropdownInner}>
                <button
                  type="button"
                  className={styles.navLink}
                  aria-haspopup="menu"
                  aria-controls={dropdownId}
                  aria-expanded={openDropdown}
                  onClick={() => setOpenDropdown((value) => !value)}
                >
                  Activites
                  <ChevronDown
                    aria-hidden="true"
                    className={openDropdown ? styles.dropdownIconOpen : styles.dropdownIcon}
                    size={16}
                  />
                </button>
                {openDropdown ? (
                  <div
                    id={dropdownId}
                    className={styles.dropdownMenu}
                    role="menu"
                    aria-label="Activites"
                  >
                    <div className={styles.dropdownHeader}>Toutes les activites</div>
                    {navigation.activityLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.dropdownMenuItem}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => setOpenDropdown(false)}
                      >
                        <ActivityLinkIcon item={item} />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        <details className={styles.mobileMenu}>
          <summary className={styles.mobileTrigger}>
            <Menu aria-hidden="true" size={18} />
            Menu
          </summary>
          <div className={styles.mobilePanel}>
            {navigation.mainLinks.map((item) => (
              <Link key={item.href} href={item.href} className={styles.mobileLink}>
                {item.label}
              </Link>
            ))}
            {navigation.activityLinks.length > 0 ? (
              <details>
                <summary className={styles.mobileLink} tabIndex={0}>
                  Activites
                </summary>
                <div className={styles.mobileSubmenu}>
                  {navigation.activityLinks.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.mobileLink}>
                      <ActivityLinkIcon item={item} />
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            ) : null}
          </div>
        </details>
      </nav>
    </header>
  );
}
