"use client";

import { useEffect } from "react";

const REVEAL_SELECTOR = "[data-reveal]";
const REVEALED_CLASS = "is-revealed";
const READY_CLASS = "reveal-ready";

function getRevealTargets(root: ParentNode | Element) {
  const targets =
    root instanceof Element && root.matches(REVEAL_SELECTOR) ? [root] : [];

  return [
    ...targets,
    ...Array.from(root.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)),
  ];
}

export function ScrollReveal() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const canObserve = "IntersectionObserver" in window;
    const html = document.documentElement;

    if (!canObserve) {
      html.classList.remove(READY_CLASS);

      return;
    }

    html.classList.add(READY_CLASS);

    if (prefersReducedMotion) {
      getRevealTargets(document).forEach((element) => {
        element.classList.add(REVEALED_CLASS);
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add(REVEALED_CLASS);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: "0px 0px -10% 0px",
        threshold: 0.14,
      },
    );

    const observeTargets = (root: ParentNode | Element) => {
      getRevealTargets(root).forEach((element) => {
        if (!element.classList.contains(REVEALED_CLASS)) {
          observer.observe(element);
        }
      });
    };

    observeTargets(document);

    const mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof Element) {
            observeTargets(node);
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return null;
}
