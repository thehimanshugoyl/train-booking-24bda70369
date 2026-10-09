"use client";

import React, { useEffect, useState } from "react";

export type Theme = "dark" | "light";

export default function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("gaddvya_theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
      applyTheme(saved);
    } else {
      // default to dark (Black theme)
      setTheme("dark");
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    if (t === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
      root.setAttribute("data-theme", "dark");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
      root.setAttribute("data-theme", "light");
    }
  };

  const handleSelect = (newTheme: Theme) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("gaddvya_theme", newTheme);
  };

  if (!mounted) {
    return (
      <div
        className={`flex items-center gap-1 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs ${className}`}
      >
        <span className="px-2.5 py-1 rounded-full text-zinc-400">🌙 Black</span>
        <span className="px-2.5 py-1 rounded-full text-zinc-400">☀️ White</span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-1 rounded-full bg-zinc-900/90 dark:bg-zinc-900/90 light:bg-zinc-100 border border-zinc-700/60 dark:border-zinc-800 light:border-zinc-300 shadow-inner backdrop-blur-md transition-colors ${className}`}
      role="group"
      aria-label="Theme Selection: Black or White"
    >
      <button
        type="button"
        onClick={() => handleSelect("dark")}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "dark"
            ? "bg-white text-black shadow-md shadow-white/20"
            : "text-zinc-400 hover:text-white"
        }`}
        title="Switch to Black Theme (Dark Mode)"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
        <span>Black</span>
      </button>

      <button
        type="button"
        onClick={() => handleSelect("light")}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
          theme === "light"
            ? "bg-black text-white shadow-md shadow-black/25"
            : "text-zinc-400 dark:text-zinc-400 light:text-zinc-600 hover:text-zinc-900 dark:hover:text-white"
        }`}
        title="Switch to White Theme (Light Mode)"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <span>White</span>
      </button>
    </div>
  );
}
