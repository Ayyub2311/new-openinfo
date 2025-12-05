"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Minus, Maximize2, EyeOff, ArrowDown } from "lucide-react";

type ViewMode = "expanded" | "compact" | "hidden";

interface BackgroundProps {
  children: React.ReactNode;
  isMain?: boolean;
  backgroundImage?: string;
  view: ViewMode;
}

const BG_GRADIENT = "bg-gradient-to-r from-[#182c3a]/70 to-[#2a3f54]/70";

function Background({ children, isMain = false, backgroundImage, view }: BackgroundProps) {
  const base = "relative flex flex-col rounded-xl overflow-hidden justify-center items-center";
  const sizing = view === "expanded" ? "min-h-[220px] sm:min-h-[400px]" : "min-h-[84px] sm:min-h-[96px]";
  return (
    <div
      className={`${base} ${sizing} ${isMain ? `${BG_GRADIENT} ` : "bg-black/30"} `}
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/20 via-transparent to-black/30" />
      <div className="relative p-5 py-5 sm:p-2">{children}</div>
    </div>
  );
}

export default function CorporatePortal() {
  const t = useTranslations();

  // 1) Always start with a hydration-safe default that matches the server render.
  const [view, setView] = useState<ViewMode>("expanded");

  // 2) Track mount to avoid SSR/client mismatches.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Now it's safe to read localStorage and update the view.
    try {
      const saved = localStorage.getItem("corpPortal:view") as ViewMode | null;
      if (saved === "expanded" || saved === "compact" || saved === "hidden") {
        setView(saved);
      }
    } catch {
      // ignore
    }
  }, []);

  // 3) Remember last non-hidden mode.
  const lastVisibleMode = useRef<ViewMode>("expanded");
  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("corpPortal:view", view);
    } catch {
      // ignore
    }
    if (view !== "hidden") lastVisibleMode.current = view;
  }, [view, mounted]);

  const toggleSize = () => setView(v => (v === "expanded" ? "compact" : "expanded"));
  const hide = () => setView("hidden");
  const show = () => setView(lastVisibleMode.current);

  // IMPORTANT: Don't early-return "hidden" before mount.
  // On the server we rendered "expanded"; we must match that through hydration.
  if (mounted && view === "hidden") {
    return (
      <div className="w-full flex justify-start">
        <button
          onClick={show}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#182c3a]/70 to-[#2a3f54]/70 hover:bg-black/40 text-white text-xs px-3 py-1.5 backdrop-blur-md transition"
          aria-label="Show corporate portal"
          title="Show"
        >
          {t("corporate_portal.show_button") || "Show corporate portal"}
          <ArrowDown size={14} />
        </button>
      </div>
    );
  }

  const Controls = (
    <div className="absolute left-2 top-2 z-10 flex gap-1">
      <button
        onClick={toggleSize}
        className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white px-2 py-1 backdrop-blur-md transition"
        aria-label={view === "expanded" ? "Collapse" : "Expand"}
        title={view === "expanded" ? "Collapse" : "Expand"}
      >
        {view === "expanded" ? <Minus size={16} /> : <Maximize2 size={16} />}
      </button>
      <button
        onClick={hide}
        className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white px-2 py-1 backdrop-blur-md transition"
        aria-label="Hide"
        title="Hide"
      >
        <EyeOff size={16} />
      </button>
    </div>
  );

  return (
    <div className="relative hidden lg:grid grid-cols-5 gap-4">
      <div className="relative col-span-5 xl:col-span-3">
        {Controls}
        <Background isMain backgroundImage="/assets/backgrounds/big-card.svg" view={view}>
          <h1
            className={` text-white font-semibold w-full px-8 mx-auto ${view === "expanded" ? "text-[32px] md:text-[38px] xl:text-[40px] 2xl:text-[43px]" : "text-sm sm:text-base"
              }`}
          >
            {t("Hero.title1")}
          </h1>

          <p
            className={`block xl:hidden mt-4 text-white font-semibold w-full px-8 mx-auto ${view === "expanded" ? "text-[16px] lg:text-[22px] xl:text-[24px]" : "text-sm sm:text-base"
              }`}
          >
            {t("Hero.title2")}
          </p>
        </Background>
      </div>

      <div className="relative hidden xl:block xl:col-span-2">
        <Background backgroundImage="/assets/backgrounds/card.svg" view={view}>
          <p
            className={`text-white font-semibold w-full px-4 mx-auto ${view === "expanded" ? "text-[16px] lg:text-[22px] xl:text-[25px]" : "text-sm sm:text-base"
              }`}
          >
            {t("Hero.title2")}
          </p>
        </Background>
      </div>

      {view === "compact" && <div className="col-span-full text-right"></div>}
    </div>
  );
}
