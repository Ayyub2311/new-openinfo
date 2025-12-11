// src/app/providers/TopProgressBar.tsx
"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// App Router-compatible progress bar using nprogress
export function TopProgressBar() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const progressStarted = useRef(false);
  const safetyTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Start progress bar when navigation begins (on link click)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest("a");
      
      if (!link) return;

      // Check if it's a Next.js Link or regular anchor
      const href = link.getAttribute("href");
      const isExternal = link.target === "_blank" || link.hasAttribute("download");
      const isAnchor = href?.startsWith("#");
      
      // Skip external links, anchors, and non-navigation links
      if (isExternal || isAnchor || !href) return;

      // Check if it's a same-origin navigation
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin === window.location.origin) {
          // Start progress bar immediately on navigation click
          if (!progressStarted.current) {
            NProgress.start();
            progressStarted.current = true;
            
            // Set safety timeout in case navigation gets stuck
            if (safetyTimerRef.current) {
              clearTimeout(safetyTimerRef.current);
            }
            safetyTimerRef.current = setTimeout(() => {
              if (progressStarted.current) {
                NProgress.done();
                progressStarted.current = false;
              }
            }, 10000); // 10 second max timeout
          }
        }
      } catch {
        // Invalid URL, skip
      }
    };

    // Listen for clicks on the document
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      if (!progressStarted.current) {
        NProgress.start();
        progressStarted.current = true;
        
        // Set safety timeout
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
        }
        safetyTimerRef.current = setTimeout(() => {
          if (progressStarted.current) {
            NProgress.done();
            progressStarted.current = false;
          }
        }, 10000);
      }
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Complete progress bar when pathname changes (navigation completes)
  useEffect(() => {
    // Only complete if pathname actually changed
    if (previousPathname.current !== pathname) {
      previousPathname.current = pathname;
      
      // If progress was started, complete it
      if (progressStarted.current) {
        // Clear safety timeout
        if (safetyTimerRef.current) {
          clearTimeout(safetyTimerRef.current);
          safetyTimerRef.current = null;
        }
        
        // Small delay to ensure smooth transition
        const timer = setTimeout(() => {
          NProgress.done();
          progressStarted.current = false;
        }, 100);

        return () => {
          clearTimeout(timer);
        };
      }
    }
  }, [pathname]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (safetyTimerRef.current) {
        clearTimeout(safetyTimerRef.current);
      }
      NProgress.done();
      progressStarted.current = false;
    };
  }, []);

  return (
    <style jsx global>{`
      #nprogress {
        pointer-events: none;
      }
      #nprogress .bar {
        background: #2563eb;
        height: 3px;
      }
      #nprogress .peg {
        box-shadow: 0 0 10px #2563eb, 0 0 5px #2563eb;
      }
      #nprogress .spinner {
        display: none;
      }
    `}</style>
  );
}
