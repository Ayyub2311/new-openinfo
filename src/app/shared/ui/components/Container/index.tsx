import React from "react";
import { ContainerProps } from "./types";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`container mx-auto px-0 sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl 2xl:max-w-screen-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
});

// const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className = "", ...props }, ref) => {
//   return (
//     <div ref={ref} className={`px-10 ${className}`} {...props}>
//       {children}
//     </div>
//   );
// });

Container.displayName = "Container";

export default Container;
