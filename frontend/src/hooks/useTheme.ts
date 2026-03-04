import { useEffect, useState } from "react";

type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

function getInitialTheme(): Theme {
  // 1. Respect stored preference
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;

  // 2. Fall back to OS preference
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Manages the application colour theme.
 *
 * - Reads `localStorage["theme"]` first; falls back to `prefers-color-scheme`.
 * - Persists the user's choice back to `localStorage` on every change.
 * - Toggles the `dark` class on `<html>` so Tailwind CSS variables kick in.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    // During SSR or first paint `localStorage` may not be ready — guard with try/catch
    try {
      return getInitialTheme();
    } catch {
      return "dark";
    }
  });

  // Apply whenever theme changes
  useEffect(() => {
    applyTheme(theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage unavailable (private mode, quota exceeded, etc.) — silently ignore
    }
  }, [theme]);

  const toggle = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return [theme, toggle];
}
