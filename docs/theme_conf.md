# Руководство по темизации в Next.js с Tailwind CSS

## Оглавление

1. [Базовая настройка](#базовая-настройка)
2. [Создание компонентов с поддержкой темы](#создание-компонентов-с-поддержкой-темы)
3. [CSS переменные для темизации](#css-переменные-для-темизации)
4. [Лучшие практики](#лучшие-практики)

## Базовая настройка

### 1. Настройка Tailwind CSS

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Важно для работы темизации
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;

export default config;
```

### 2. Базовые стили

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light dark;
}

@layer base {
  body {
    @apply bg-white text-black transition-colors dark:bg-slate-900 dark:text-white;
  }
}
```

### 3. Настройка Layout

```typescript
// src/app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

## Создание компонентов с поддержкой темы

### 1. Простой компонент с темизацией

```typescript
// components/Card.tsx
export function Card({ title, content }: { title: string; content: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-gray-900 dark:text-white text-xl font-bold">{title}</h2>
      <p className="text-gray-600 dark:text-gray-300 mt-2">{content}</p>
    </div>
  );
}
```

### 2. Компонент переключателя темы

```typescript
// components/theme-switcher.tsx
"use client";

export function ThemeSwitcher() {
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-800">
      <span className="block dark:hidden">🌙</span>
      <span className="hidden dark:block">☀️</span>
    </button>
  );
}
```

## CSS переменные для темизации

### 1. Определение переменных

```css
/* src/app/globals.css */
:root {
  /* Основные цвета */
  --color-primary: 59 130 246; /* blue-500 */
  --color-secondary: 107 114 128; /* gray-500 */

  /* Цвета фона */
  --bg-primary: 255 255 255;
  --bg-secondary: 249 250 251;

  /* Цвета текста */
  --text-primary: 17 24 39;
  --text-secondary: 107 114 128;
}

/* Темная тема */
.dark {
  /* Основные цвета */
  --color-primary: 96 165 250; /* blue-400 */
  --color-secondary: 156 163 175; /* gray-400 */

  /* Цвета фона */
  --bg-primary: 17 24 39;
  --bg-secondary: 31 41 55;

  /* Цвета текста */
  --text-primary: 255 255 255;
  --text-secondary: 209 213 219;
}
```

### 2. Использование переменных в Tailwind

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  content: [...],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
      },
      backgroundColor: {
        primary: 'rgb(var(--bg-primary) / <alpha-value>)',
        secondary: 'rgb(var(--bg-secondary) / <alpha-value>)',
      },
      textColor: {
        primary: 'rgb(var(--text-primary) / <alpha-value>)',
        secondary: 'rgb(var(--text-secondary) / <alpha-value>)',
      },
    },
  },
} satisfies Config;

export default config;
```

### 3. Использование в компонентах

```typescript
function CustomButton({ children }: { children: React.ReactNode }) {
  return <button className="bg-primary text-primary hover:bg-primary/90 px-4 py-2 rounded-lg">{children}</button>;
}
```

## Лучшие практики

1. **Стандартизация цветов**

   - Создайте единую палитру цветов через CSS переменные
   - Используйте семантические имена (primary, secondary, accent)
   - Определите оттенки для каждого цвета (100-900)

2. **Компонентный подход**

   ```typescript
   // Плохо
   <div className="bg-white dark:bg-gray-800 p-4">...</div>;

   // Хорошо
   function Card({ children }: { children: React.ReactNode }) {
     return <div className="bg-primary p-4">{children}</div>;
   }
   ```

3. **Плавные переходы**

   ```css
   @layer base {
     * {
       @apply transition-colors duration-200;
     }
   }
   ```

4. **Проверка доступности**

   - Убедитесь в достаточном контрасте между текстом и фоном
   - Тестируйте компоненты в обеих темах
   - Используйте WCAG рекомендации для контраста

5. **Организация стилей**
   - Группируйте связанные CSS переменные
   - Используйте префиксы для разных категорий (--color-, --spacing-, etc.)
   - Документируйте значения переменных
