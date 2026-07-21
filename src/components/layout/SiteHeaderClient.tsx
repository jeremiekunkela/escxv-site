"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { FocusEvent, KeyboardEvent } from "react";
import { ActivityPictogram } from "@/features/activities/components/ActivityPictogram/ActivityPictogram";
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
    <ActivityPictogram
      iconName={item.iconName ?? "sports"}
      className={styles.activityPictogram}
    />
  );
}

export function SiteHeaderClient({ navigation }: SiteHeaderClientProps) {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownId = "activities-dropdown";
  const mobileMenuId = "mobile-menu";
  const mobileActivitiesId = "mobile-activities";
  const pathname = usePathname();
  const [lastPathname, setLastPathname] = useState(pathname);

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

  /**
   * Le header est persistant d'une page a l'autre : sans ca, le menu mobile
   * reste ouvert apres une navigation (retour navigateur, lien deja actif...).
   * Ajustement pendant le rendu plutot qu'un effet, comme recommande par React.
   */
  if (pathname !== lastPathname) {
    setLastPathname(pathname);
    setMobileOpen(false);
    setMobileActivitiesOpen(false);
  }

  useEffect(() => {
    if (!mobileOpen) return;

    function handleClick(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen]);

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

        <div className={styles.mobileMenu} ref={mobileMenuRef}>
          <button
            type="button"
            className={styles.mobileTrigger}
            aria-expanded={mobileOpen}
            aria-controls={mobileMenuId}
            onClick={() => setMobileOpen((value) => !value)}
          >
            {mobileOpen ? (
              <X aria-hidden="true" size={18} />
            ) : (
              <Menu aria-hidden="true" size={18} />
            )}
            Menu
          </button>
          {mobileOpen ? (
            <div id={mobileMenuId} className={styles.mobilePanel}>
              {navigation.mainLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              {navigation.activityLinks.length > 0 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.mobileLink} ${styles.mobileSubmenuTrigger}`}
                    aria-expanded={mobileActivitiesOpen}
                    aria-controls={mobileActivitiesId}
                    onClick={() => setMobileActivitiesOpen((value) => !value)}
                  >
                    Activites
                    <ChevronDown
                      aria-hidden="true"
                      className={
                        mobileActivitiesOpen
                          ? styles.dropdownIconOpen
                          : styles.dropdownIcon
                      }
                      size={16}
                    />
                  </button>
                  {mobileActivitiesOpen ? (
                    <div id={mobileActivitiesId} className={styles.mobileSubmenu}>
                      {navigation.activityLinks.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={styles.mobileLink}
                          onClick={() => setMobileOpen(false)}
                        >
                          <ActivityLinkIcon item={item} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
