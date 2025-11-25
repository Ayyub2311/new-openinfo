"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light";

export type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
};

export type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export const ThemeContext = createContext<ThemeProviderState | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  // Инициализируем тему сразу из localStorage
  const [theme, setTheme] = useState<Theme>(() => {
    // Проверяем, есть ли мы на стороне клиента
    if (typeof window !== "undefined") {
      try {
        // Пытаемся получить тему из localStorage
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) {
          return savedTheme;
        }
        // Если темы нет, проверяем системные настройки
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
      } catch (e) {
        // Если что-то пошло не так, возвращаем defaultTheme
        console.error("Error accessing localStorage:", e);
      }
    }
    return defaultTheme;
  });

  // Применяем тему к документу
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    try {
      localStorage.setItem("theme", theme);
    } catch (e) {
      console.error("Error saving theme to localStorage:", e);
    }
  }, [theme]);

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      setTheme(newTheme);
    },
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
