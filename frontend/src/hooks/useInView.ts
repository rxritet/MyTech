import { useEffect, useRef, useState } from "react";

/**
 * Returns a [ref, isInView] tuple. Once the element attached to `ref`
 * enters the viewport it stays "in view" (fires only once by default).
 *
 * @param threshold - Intersection ratio to trigger (0–1, default 0.15)
 * @param once      - Disconnect observer after first intersection (default true)
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  threshold = 0.15,
  once = true,
): [React.RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        }
      },
      { threshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  return [ref, inView];
}
