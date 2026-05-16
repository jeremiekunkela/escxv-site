"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NavigationContent } from "@/features/navigation/types/navigation";
import styles from "./SiteHeader.module.css";

type SiteHeaderClientProps = {
  navigation: NavigationContent;
};

export function SiteHeaderClient({ navigation }: SiteHeaderClientProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>
            <Image
              src="/escxv-logo.svg"
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
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <div
                className={styles.dropdownInner}
                onMouseEnter={() => setOpenDropdown(true)}
                onMouseLeave={() => setOpenDropdown(false)}
              >
                <button
                  type="button"
                  className={styles.navLink}
                  aria-haspopup="menu"
                  aria-expanded={openDropdown}
                  onClick={() => setOpenDropdown((value) => !value)}
                  onFocus={() => setOpenDropdown(true)}
                  onBlur={() => setTimeout(() => setOpenDropdown(false), 120)}
                >
                  Activites
                </button>
                {openDropdown ? (
                  <div
                    className={
                      navigation.activityLinks.length > 8
                        ? `${styles.dropdownMenu} ${styles.grid}`
                        : styles.dropdownMenu
                    }
                    role="menu"
                  >
                    {navigation.activityLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.dropdownMenuItem}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => setOpenDropdown(false)}
                      >
                        {item.label}
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
                <div>
                  {navigation.activityLinks.map((item) => (
                    <Link key={item.href} href={item.href} className={styles.mobileLink}>
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
