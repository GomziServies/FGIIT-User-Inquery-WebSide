import { useEffect } from 'react';

/**
 * Gently auto-scrolls a horizontal carousel.
 *
 * - Starts only once the carousel scrolls into view (not on page load), and
 *   stops again whenever it leaves the viewport
 * - Advances one item at a time on an interval
 * - Loops back to the start when the end is reached
 * - Pauses while the user hovers or interacts with the carousel
 * - Resets the timer after a manual scroll so it never fights the user
 * - Disabled entirely when the visitor prefers reduced motion
 *
 * @param {React.RefObject<HTMLElement>} ref - the scrollable container
 * @param {{ interval?: number, visibleThreshold?: number }} [options]
 *   visibleThreshold — share of the carousel (0–1) that must be on screen before it starts
 */
export default function useAutoScroll(ref, { interval = 4500, visibleThreshold = 0.4 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    let timer = null;
    let userScrolling = false;
    let scrollIdleTimer = null;
    // Without IntersectionObserver support, fall back to the old always-on behaviour
    let inView = typeof window.IntersectionObserver !== 'function';
    let paused = false; // hover / focus / touch

    const stepSize = () => {
      const first = el.firstElementChild;
      if (!first) return Math.max(el.clientWidth * 0.8, 200);
      const styles = window.getComputedStyle(el);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    };

    const tick = () => {
      const max = el.scrollWidth - el.clientWidth;
      if (max <= 4) return;
      const step = Math.min(stepSize(), max);
      if (el.scrollLeft >= max - 2) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollTo({ left: Math.min(el.scrollLeft + step, max), behavior: 'smooth' });
      }
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    // Runs only while the carousel is on screen and the user is not interacting with it.
    // The first slide always stays put for one full interval before moving.
    const sync = () => {
      if (inView && !paused && !document.hidden) {
        if (timer) return;
        timer = window.setInterval(() => {
          if (!userScrolling) tick();
        }, interval);
      } else {
        stop();
      }
    };

    const pause = () => {
      paused = true;
      sync();
    };

    const resume = () => {
      paused = false;
      sync();
    };

    const handleScroll = () => {
      userScrolling = true;
      window.clearTimeout(scrollIdleTimer);
      scrollIdleTimer = window.setTimeout(() => {
        userScrolling = false;
      }, 400);
    };

    let observer = null;
    if (!inView) {
      observer = new window.IntersectionObserver(
        ([entry]) => {
          inView = entry.isIntersecting && entry.intersectionRatio >= visibleThreshold;
          sync();
        },
        { threshold: [0, visibleThreshold] }
      );
      observer.observe(el);
    }

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('focusin', pause);
    el.addEventListener('focusout', resume);
    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('touchstart', pause, { passive: true });
    el.addEventListener('touchend', resume, { passive: true });
    document.addEventListener('visibilitychange', sync);

    sync();

    return () => {
      stop();
      window.clearTimeout(scrollIdleTimer);
      if (observer) observer.disconnect();
      el.removeEventListener('mouseenter', pause);
      el.removeEventListener('mouseleave', resume);
      el.removeEventListener('focusin', pause);
      el.removeEventListener('focusout', resume);
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('touchstart', pause);
      el.removeEventListener('touchend', resume);
      document.removeEventListener('visibilitychange', sync);
    };
  }, [ref, interval, visibleThreshold]);
}
