"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Tab } from "./types";

interface TabsProps {
  tabs: Tab[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  className?: string;
  variant?: "underline" | "pill" | "bordered";
  tabGap?: string;
  gapClass?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultActiveTab,
  onChange,
  className = "",
  variant = "underline",
  tabGap,
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab || tabs[0]?.id);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const tabsRef = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  const checkScrollability = () => {
    const sc = scrollContainerRef.current;
    const nav = navRef.current;
    if (!sc || !nav) return;
    const containerWidth = sc.clientWidth;
    const contentWidth = nav.scrollWidth;
    const shouldShow = contentWidth > containerWidth;
    setShowLeftScroll(shouldShow && sc.scrollLeft > 0);
    setShowRightScroll(shouldShow && sc.scrollLeft < contentWidth - containerWidth - 1);
  };

  const updateIndicator = useCallback(() => {
    return () => {
      const sc = scrollContainerRef.current;
      if (!sc) return;
      const idx = tabs.findIndex(t => t.id === activeTab);
      const el = tabsRef.current[idx];
      if (!el) return;

      // include margins
      const cs = window.getComputedStyle(el);
      const ml = parseFloat(cs.marginLeft || "0");
      const mr = parseFloat(cs.marginRight || "0");

      const left = el.offsetLeft - sc.scrollLeft - ml;
      const width = el.offsetWidth + ml + mr;
      setIndicatorStyle({ left, width });
    };
  }, [activeTab, tabs]);

  useEffect(() => {
    checkScrollability();
    window.addEventListener("resize", checkScrollability);
    return () => window.removeEventListener("resize", checkScrollability);
  }, []);

  useEffect(() => {
    const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
    const activeTabElement = tabsRef.current[activeTabIndex];
    if (activeTabElement && scrollContainerRef.current) {
      const { offsetLeft, offsetWidth } = activeTabElement;
      const scrollContainer = scrollContainerRef.current;
      const containerWidth = scrollContainer.clientWidth;
      setIndicatorStyle({ left: offsetLeft, width: offsetWidth });
      const targetScrollLeft = offsetLeft - (containerWidth - offsetWidth) / 2;
      const maxScroll = scrollContainer.scrollWidth - containerWidth;
      const safeScrollLeft = Math.max(0, Math.min(targetScrollLeft, maxScroll));
      scrollContainer.scrollTo({ left: safeScrollLeft, behavior: "smooth" });
    }
    updateIndicator();
  }, [activeTab, tabs, updateIndicator]);

  const handleScroll = useCallback(() => {
    return () => {
      console.log(scrollContainerRef.current?.scrollLeft, "scrollLeft");
      if (scrollContainerRef.current) {
        checkScrollability();
        const activeTabIndex = tabs.findIndex(tab => tab.id === activeTab);
        const activeTabElement = tabsRef.current[activeTabIndex];
        if (activeTabElement) {
          setIndicatorStyle(prev => ({
            ...prev,
            left: activeTabElement.offsetLeft - scrollContainerRef.current.scrollLeft,
            width: activeTabElement.offsetWidth,
          }));
        }
      }
      updateIndicator();
    };
  }, [activeTab, tabs, updateIndicator]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [activeTab, handleScroll]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollContainerRef.current?.scrollLeft || 0));
    setScrollLeft(scrollContainerRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainerRef.current) {
      const x = e.pageX - scrollContainerRef.current.offsetLeft;
      const walk = x - startX;
      scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTabClick = (tabId: string) => {
    if (!isDragging) {
      setActiveTab(tabId);
      onChange?.(tabId);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = Math.min(scrollContainerRef.current.clientWidth * 0.8, 200);
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft + (direction === "left" ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
    }
  };

  return (
    <div className={`relative box-border ${className}`} style={{ width: "100%" }}>
      <div className=" relative w-full border-b border-zinc-100 dark:border-zinc-700">
        {showLeftScroll && (
          <button
            onClick={() => scroll("left")}
            className="absolute -left-2 top-0 bottom-0 z-10 flex items-center justify-center px-1
              bg-gradient-to-r from-white via-white to-transparent
              dark:from-zinc-900 dark:via-zinc-900 dark:to-transparent"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        )}
        {showRightScroll && (
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-0 bottom-0 pr-2 mr-[1px] h-[42px] z-10 flex items-center justify-center
              bg-white
              dark:from-zinc-900 dark:via-zinc-900 dark:to-transparent"
          >
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
        )}

        <div className="relative w-full rounded-xl rounded-t-none border-b border-l border-r border-default">
          <div className="overflow-hidden rounded-xl rounded-t-none">
            <div
              ref={scrollContainerRef}
              className={`overflow-x-auto relative w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]  
                ${showLeftScroll ? "pl-6" : ""}
    ${showRightScroll ? "pr-6" : ""}
    `}
            >
              <nav
                ref={navRef}
                className={`flex xl:gap-3 whitespace-nowrap w-full select-none ${variant === "bordered" ? "justify-between py-1" : ""
                  }  ${tabGap || ""}
            `}
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseUp}
              >
                {tabs.map((tab, index) => {
                  const isActive = activeTab === tab.id;
                  const baseClasses = `px-3 xl:px-2 2xl:px-3 py-2 text-sm font-medium transition-colors relative flex-shrink-0 y `;

                  const underlineStyles = isActive
                    ? "text-sky-700 dark:text-sky-400"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200";

                  const pillStyles = `rounded-full ${isActive
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300"
                    : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                    }`;

                  const borderedStyles = `
                 text-sm px-4 py-2 mx-1 transition-colors duration-200 grow

                ${isActive
                      ? "border-sky-700 text-sky-700 font-semibold bg-white dark:border-sky-400 dark:text-sky-300"
                      : "border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 dark:border-zinc-600 dark:text-gray-400 dark:hover:text-gray-200  "
                    }
              `;

                  return (
                    <button
                      key={tab.id}
                      ref={el => {
                        tabsRef.current[index] = el;
                      }}
                      onClick={() => handleTabClick(tab.id)}
                      className={`${baseClasses} ${variant === "pill" ? pillStyles : variant === "bordered" ? borderedStyles : underlineStyles
                        }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </nav>

              {variant !== "pill" && (
                <div
                  className="absolute bottom-0 h-[2px] bg-sky-700 dark:bg-sky-400 transition-all duration-300"
                  style={{
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                  }}
                />
              )}
            </div>
          </div>
        </div>


      </div>

      <div className="mt-4">{tabs.find(tab => tab.id === activeTab)?.content}</div>
    </div>
  );
};

export default Tabs;
