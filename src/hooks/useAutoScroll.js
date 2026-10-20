import { useEffect } from 'react';

/**
 * Gently auto-scrolls a horizontal carousel.
 *
 * - Advances one item at a time on an interval
 * - Loops back to the start when the end is reached
 * - Pauses while the user hovers or interacts with the carousel
 * - Resets the timer after a manual scroll so it never fights the user
 * - Disabled entirely when the visitor prefers reduced motion
 *
 * @param {React.RefObject<HTMLElement>} ref - the scrollable container
 * @param {{ interval?: number }} [options]
 */
export default function useAutoScroll(ref, { interval = 4500 } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const prefersReducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) return undefined;

    let timer = null;
    let userScrolling = false;

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

    const start = () => {
      if (timer) return;
      timer = window.setInterval(() => {
        if (!userScrolling) tick();
      }, interval);
    };

    const stop = () => {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
    };

    const handleScroll = () => {
      userScrolling = true;
      window.clearTimeout(handleScroll.t);
      handleScroll.t = window.setTimeout(() => {
        userScrolling = false;
      }, 400);
    };

    el.addEventListener('mouseenter', stop);
    el.addEventListener('mouseleave', start);
    el.addEventListener('focusin', stop);
    el.addEventListener('focusout', start);
    el.addEventListener('scroll', handleScroll, { passive: true });
    el.addEventListener('touchstart', stop, { passive: true });
    el.addEventListener('touchend', start, { passive: true });

    start();

    return () => {
      stop();
      window.clearTimeout(handleScroll.t);
      el.removeEventListener('mouseenter', stop);
      el.removeEventListener('mouseleave', start);
      el.removeEventListener('focusin', stop);
      el.removeEventListener('focusout', start);
      el.removeEventListener('scroll', handleScroll);
      el.removeEventListener('touchstart', stop);
      el.removeEventListener('touchend', start);
    };
  }, [ref, interval]);
}
