import { useEffect, useRef, useState } from "react";

/**
 * Returns the current scroll progress of the page as a value 0–100.
 * Updates are throttled to one requestAnimationFrame per scroll burst (~16ms),
 * preventing layout thrash on fast scrolling.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const calc = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable > 0 ? (scrollTop / scrollable) * 100 : 0);
      rafId.current = null;
    };

    const onScroll = () => {
      // Skip if a frame is already scheduled (throttle to ~16 ms)
      if (rafId.current !== null) return;
      rafId.current = requestAnimationFrame(calc);
    };

    // Compute initial value synchronously
    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    };
  }, []);

  return progress;
}
