// src/app/providers/TopProgressBar.tsx
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// App Router-compatible progress bar using nprogress
export function TopProgressBar() {
  const pathname = usePathname();

  useEffect(() => {
    // start on route change
    NProgress.start();

    // finish shortly after render to keep the bar visible
    const timer = setTimeout(() => {
      NProgress.done();
    }, 200);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [pathname]);

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
