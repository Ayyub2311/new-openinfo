"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const toggleTheme = () => {
    try {
      const isDark = document.documentElement.classList.contains("dark");

      if (isDark) {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      }
    } catch (e) {
      console.error("Failed to toggle theme:", e);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={`text-white hover:text-blue-200 transition-colors ${className}`}
      title="Toggle theme"
      aria-label="Toggle theme"
    >
      <Sun className="h-5 w-5 hidden dark:block" />
      <Moon className="h-5 w-5 block dark:hidden" />
    </button>
  );
}
