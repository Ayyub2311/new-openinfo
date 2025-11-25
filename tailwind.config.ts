import type { Config } from "tailwindcss";
import path from "path";

const config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./stories/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        body: ["var(--font-body)"],
        heading: ["var(--font-heading)"],
      },
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
      },
      animation: {
        marquee: "marquee 15s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(70%)" },
          "100%": { transform: "translateX(-70%)" },
        },
      },
      backgroundColor: {
        primary: "rgb(var(--bg-primary) / <alpha-value>)",
        secondary: "rgb(var(--bg-secondary) / <alpha-value>)",
        accent: "rgb(var(--bg-accent) / <alpha-value>)",
      },
      textColor: {
        primary: "rgb(var(--text-primary) / <alpha-value>)",
        secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
        accent: "rgb(var(--text-accent) / <alpha-value>)",
        inverse: "rgb(var(--text-inverse) / <alpha-value>)",
        success: "rgb(var(--text-success) / <alpha-value>)",
      },
      fill: {
        primary: "rgb(var(--text-primary) / <alpha-value>)",
        secondary: "rgb(var(--text-secondary) / <alpha-value>)",
        tertiary: "rgb(var(--text-tertiary) / <alpha-value>)",
        accent: "rgb(var(--text-accent) / <alpha-value>)",
        inverse: "rgb(var(--text-inverse) / <alpha-value>)",
        success: "rgb(var(--text-success) / <alpha-value>)",
      },
      borderColor: {
        default: "rgb(var(--border-default) / <alpha-value>)",
      },
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "2rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
      },
    },
  },
  plugins: [],
  resolve: {
    alias: {
      "@public": path.resolve(__dirname, "./public"),
    },
  },
} satisfies Config;

export default config;
