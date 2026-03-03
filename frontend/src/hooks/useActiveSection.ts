import { useEffect, useMemo, useState } from "react";

/**
 * Tracks which section id is currently in the viewport using IntersectionObserver.
 *
 * @param ids       - Array of element ids to observe (without `#`).
 *                    Internally serialised so a new array reference on every
 *                    render does NOT cause an infinite effect loop.
 * @param threshold - Visibility ratio that triggers the active state (default 0.4)
 */
export function useActiveSection(ids: string[], threshold = 0.4): string {
  // Stable reference – recomputes only when the contents of the array change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableIds = useMemo(() => ids, [ids.join(",")]);

  const [active, setActive] = useState<string>("");

  useEffect(() => {
    if (stableIds.length === 0) return;

    const observers: IntersectionObserver[] = [];

    stableIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { threshold },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [stableIds, threshold]);

  return active;
}
