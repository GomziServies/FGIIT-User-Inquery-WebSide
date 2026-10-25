/**
 * Guaranteed smooth scrolling to an element by ID or element reference.
 * Uses requestAnimationFrame with cubic easing so it works smoothly
 * across all browsers, operating systems, and accessibility settings.
 *
 * @param {string | HTMLElement} target - Element ID (e.g. 'courses') or HTMLElement
 * @param {number} offset - Pixel offset from top for sticky header clearance (default: 76px)
 * @param {number} duration - Animation duration in milliseconds (default: 650ms)
 */
export function smoothScrollTo(target, offset = 76, duration = 650) {
  if (typeof window === 'undefined') return;

  const el = typeof target === 'string' ? document.getElementById(target.replace(/^#/, '')) : target;
  if (!el) return;

  const startPosition = window.pageYOffset || document.documentElement.scrollTop || 0;
  const rect = el.getBoundingClientRect();
  const targetPosition = Math.max(0, rect.top + startPosition - offset);
  const distance = targetPosition - startPosition;

  if (Math.abs(distance) < 5) return;

  // Temporarily set scrollBehavior to auto so RAF can interpolate frame-by-frame
  const prevBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';

  let startTime = null;

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function step(currentTime) {
    if (startTime === null) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutCubic(progress);

    window.scrollTo(0, Math.round(startPosition + distance * ease));

    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      document.documentElement.style.scrollBehavior = prevBehavior;
    }
  }

  window.requestAnimationFrame(step);
}
