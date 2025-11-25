import React from "react";
import { SplitPanelContainerProps } from "./types";
import { cn } from "@/app/shared/lib/utils/cn";

export const SplitPanelContainer = React.forwardRef<HTMLDivElement, SplitPanelContainerProps>(
  ({ items, gap = 0, showDividers = true, orientation = "horizontal", className, ...props }, ref) => {
    if (!items.length) {
      return null;
    }

    const isVertical = orientation === "vertical";

    return (
      <div ref={ref} className={cn("w-full h-full", className)} {...props}>
        <div className="w-full h-full rounded border border-gray-300">
          <div
            className={cn(
              "grid h-full",
              // Mobile - always vertical
              "grid-cols-1",
              isVertical
                ? `grid-rows-${items.length}`
                : `md:grid-cols-2 lg:grid-cols-${items.length} grid-rows-${items.length} md:grid-rows-${Math.ceil(items.length / 2)} lg:grid-rows-1`
            )}
            style={{ gap: `${gap}px` }}
          >
            {items.map((item, index) => (
              <div
                key={`split-panel-${index}`}
                className={cn(
                  "grid-item",
                  index === 1 && "flex items-center",
                  // Responsive padding
                  "p-2 md:p-2 lg:p-4",
                  showDividers &&
                    index < items.length - 1 &&
                    (isVertical
                      ? "border-b border-gray-200"
                      : cn(
                          "border-b md:border-b-0 md:border-r border-gray-200",
                          index % 2 === 0 && "md:border-r lg:border-r"
                        ))
                )}
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
);

SplitPanelContainer.displayName = "SplitPanelContainer";
