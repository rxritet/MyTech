import { useScrollProgress } from "../../hooks/useScrollProgress";

/**
 * A thin progress bar that reflects how far the user has scrolled the page.
 *
 * Rendered with `position: absolute; bottom: 0` so it sits flush at the
 * bottom edge of whichever fixed container it lives in (the Navbar).
 * This means it automatically follows the Navbar's hide/show transform
 * without extra wiring.
 *
 * - `pointer-events-none` — never intercepts clicks
 * - Width animated with CSS `transition` for a smooth fill
 * - Color uses the `--primary` CSS variable from the theme
 */
export default function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 bottom-0 h-0.5 pointer-events-none"
    >
      <div
        className="h-full transition-[width] duration-100 ease-linear"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(to right, var(--primary), color-mix(in srgb, var(--primary) 60%, #a855f7))",
        }}
      />
    </div>
  );
}
