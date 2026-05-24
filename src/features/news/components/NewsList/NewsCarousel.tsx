"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { NewsItem } from "@/features/news/types/news";
import styles from "./NewsList.module.css";

type NewsCarouselProps = {
  news: NewsItem[];
  layout?: "multi" | "single";
  children: ReactNode;
};

const NEWS_PREVIEW_CARD_SELECTOR = "[data-news-preview-card]";

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function NewsCarousel({
  news,
  layout = "multi",
  children,
}: NewsCarouselProps) {
  const carouselId = useId();
  const carouselRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef<number | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const hasCarouselControls = news.length > 1;

  const scrollToSlide = useCallback((slideIndex: number) => {
    const carousel = carouselRef.current;
    const slide = carousel?.querySelectorAll<HTMLElement>(
      NEWS_PREVIEW_CARD_SELECTOR,
    )[slideIndex];

    if (!slide) {
      return;
    }

    const carouselBounds = carousel.getBoundingClientRect();
    const slideBounds = slide.getBoundingClientRect();
    const targetScrollLeft =
      carousel.scrollLeft + slideBounds.left - carouselBounds.left;

    carousel.scrollTo({
      left: targetScrollLeft,
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    setActiveSlide(slideIndex);
  }, []);

  const goToPreviousSlide = useCallback(() => {
    const previousSlide = activeSlide === 0 ? news.length - 1 : activeSlide - 1;

    scrollToSlide(previousSlide);
  }, [activeSlide, news.length, scrollToSlide]);

  const goToNextSlide = useCallback(() => {
    const nextSlide = activeSlide >= news.length - 1 ? 0 : activeSlide + 1;

    scrollToSlide(nextSlide);
  }, [activeSlide, news.length, scrollToSlide]);

  const updateActiveSlideFromScroll = useCallback(() => {
    const carousel = carouselRef.current;

    if (!carousel) {
      return;
    }

    if (scrollFrameRef.current) {
      window.cancelAnimationFrame(scrollFrameRef.current);
    }

    scrollFrameRef.current = window.requestAnimationFrame(() => {
      const slides = Array.from(
        carousel.querySelectorAll<HTMLElement>(NEWS_PREVIEW_CARD_SELECTOR),
      );

      if (slides.length === 0) {
        return;
      }

      const closestSlide = slides.reduce((closestIndex, slide, slideIndex) => {
        const closestSlideDistance = Math.abs(
          slides[closestIndex].offsetLeft - carousel.scrollLeft,
        );
        const slideDistance = Math.abs(slide.offsetLeft - carousel.scrollLeft);

        return slideDistance < closestSlideDistance ? slideIndex : closestIndex;
      }, 0);

      setActiveSlide(closestSlide);
    });
  }, []);

  useEffect(() => {
    if (!hasCarouselControls || isCarouselPaused || prefersReducedMotion()) {
      return;
    }

    const autoplayInterval = window.setInterval(goToNextSlide, 9000);

    return () => window.clearInterval(autoplayInterval);
  }, [goToNextSlide, hasCarouselControls, isCarouselPaused]);

  useEffect(() => {
    return () => {
      if (scrollFrameRef.current) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }
    };
  }, []);

  return (
    <div
      className={styles.carouselShell}
      aria-roledescription="carousel"
      onMouseEnter={() => setIsCarouselPaused(true)}
      onMouseLeave={() => setIsCarouselPaused(false)}
      onFocus={() => setIsCarouselPaused(true)}
      onBlur={(event) => {
        const nextTarget = event.relatedTarget;

        if (
          !(nextTarget instanceof Node) ||
          !event.currentTarget.contains(nextTarget)
        ) {
          setIsCarouselPaused(false);
        }
      }}
    >
      {hasCarouselControls ? (
        <div className={styles.carouselToolbar}>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToPreviousSlide}
            aria-controls={carouselId}
            aria-label="Actualité précédente"
          >
            <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.4} />
          </button>
          <button
            type="button"
            className={styles.navButton}
            onClick={goToNextSlide}
            aria-controls={carouselId}
            aria-label="Actualité suivante"
          >
            <ChevronRight aria-hidden="true" size={22} strokeWidth={2.4} />
          </button>
        </div>
      ) : null}

      <div
        id={carouselId}
        ref={carouselRef}
        className={
          layout === "single"
            ? `${styles.carousel} ${styles.carouselSingle}`
            : styles.carousel
        }
        onScroll={updateActiveSlideFromScroll}
      >
        {children}
      </div>

      {hasCarouselControls ? (
        <div className={styles.dots} aria-label="Navigation des actualités">
          {news.map((newsItem, slideIndex) => (
            <button
              key={newsItem.id}
              type="button"
              className={
                slideIndex === activeSlide
                  ? `${styles.dot} ${styles.dotActive}`
                  : styles.dot
              }
              onClick={() => scrollToSlide(slideIndex)}
              aria-controls={carouselId}
              aria-current={slideIndex === activeSlide ? "true" : undefined}
              aria-label={`Afficher l'actualité ${slideIndex + 1} : ${
                newsItem.title
              }`}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
