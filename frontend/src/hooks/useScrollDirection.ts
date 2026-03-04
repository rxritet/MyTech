import { useEffect, useRef, useState } from "react";

type ScrollDirection = "up" | "down";

/**
 * Returns the current scroll direction and whether the page has been scrolled
 * past a threshold.
 *
 * - `direction`: "up" | "down"
 * - `scrolled`: true once the page passes `threshold` pixels
 *
 * Uses a passive scroll listener and a ref for the previous scroll position to
 * avoid re-renders on every pixel moved — only state that actually changes
 * triggers an update.
 */
export function useScrollDirection(threshold = 10): {
  direction: ScrollDirection;
  scrolled: boolean;
} {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const handler = () => {
      const currentY = window.scrollY;
      const diff = currentY - lastY.current;

      // Ignore tiny jitter (momentum scrolling on iOS, etc.)
      if (Math.abs(diff) < 4) return;

      setDirection(diff > 0 ? "down" : "up");
      setScrolled(currentY > threshold);
      lastY.current = currentY;
    };

    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, [threshold]);

  return { direction, scrolled };
}
