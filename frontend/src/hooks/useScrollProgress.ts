import { useEffect, useState } from "react";

/**
 * Returns the current scroll progress of the page as a percentage (0–100).
 * Updates on every scroll event using a passive listener.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const calc = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const scrollable = scrollHeight - clientHeight;
      setProgress(scrollable > 0 ? Math.round((scrollTop / scrollable) * 100) : 0);
    };

    // Set initial value
    calc();
    window.addEventListener("scroll", calc, { passive: true });
    return () => window.removeEventListener("scroll", calc);
  }, []);

  return progress;
}
