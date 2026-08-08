"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
  FocusEvent,
  KeyboardEvent,
  MouseEvent as ReactMouseEvent,
} from "react";
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
   * Le header est persistant d'une page à l'autre : sans ça, le menu mobile
   * reste ouvert après une navigation (retour navigateur, lien déjà actif...).
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

  function handleNavigationClick(
    event: ReactMouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    setOpenDropdown(false);
    setMobileOpen(false);
    setMobileActivitiesOpen(false);

    const url = new URL(href, window.location.href);
    const target = url.hash ? document.getElementById(url.hash.slice(1)) : null;

    if (url.pathname !== window.location.pathname || !target) {
      return;
    }

    event.preventDefault();
    window.history.pushState(null, "", `${url.pathname}${url.search}${url.hash}`);
    target.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className={styles.header}>
      <nav aria-label="Navigation principale" className={styles.nav}>
        <Link href="/" className={styles.brand}>
          <span className={styles.logo}>
            <Image
              src="/escxv-logo.png"
              alt=""
              width={132}
              height={105}
              priority
              className={styles.logoImage}
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>{navigation.club.shortName}</span>
            <span className={styles.brandMeta}>Paris 1910</span>
          </span>
        </Link>

        <div className={styles.desktopLinks}>
          {/*
            Les activites en tete : c'est la raison de venue la plus frequente,
            et un menu se lit de gauche a droite.
          */}
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
                  Activités
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
                    aria-label="Activités"
                  >
                    <div className={styles.dropdownHeader}>Toutes les activités</div>
                    {navigation.activityLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={styles.dropdownMenuItem}
                        role="menuitem"
                        tabIndex={0}
                        onClick={(event) => handleNavigationClick(event, item.href)}
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
          {navigation.mainLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.navLink}
              onClick={(event) => handleNavigationClick(event, item.href)}
            >
              {item.label}
            </Link>
          ))}
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
              {navigation.activityLinks.length > 0 ? (
                <>
                  <button
                    type="button"
                    className={`${styles.mobileLink} ${styles.mobileSubmenuTrigger}`}
                    aria-expanded={mobileActivitiesOpen}
                    aria-controls={mobileActivitiesId}
                    onClick={() => setMobileActivitiesOpen((value) => !value)}
                  >
                    Activités
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
                          onClick={(event) => handleNavigationClick(event, item.href)}
                        >
                          <ActivityLinkIcon item={item} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </>
              ) : null}
              {navigation.mainLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={styles.mobileLink}
                  onClick={(event) => handleNavigationClick(event, item.href)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </nav>
    </header>
  );
}
