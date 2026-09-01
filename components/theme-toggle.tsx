"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = window.localStorage.getItem("ibx-theme") as Theme | null;
    const initial = stored === "light" ? "light" : "dark";
    document.documentElement.dataset.theme = initial;
    const syncTheme = window.setTimeout(() => setTheme(initial), 0);
    return () => window.clearTimeout(syncTheme);
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    window.localStorage.setItem("ibx-theme", next);
    setTheme(next);
  };

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Dark mode — switch to light" : "Light mode — switch to dark"}
      aria-pressed={theme === "light"}
    >
      <span aria-hidden="true">{theme === "dark" ? "☀" : "◐"}</span>
      <span>{theme === "dark" ? "Light" : "Dark"}</span>
    </button>
  );
}
