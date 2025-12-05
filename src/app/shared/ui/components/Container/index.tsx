import React from "react";
import { ContainerProps } from "./types";

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ children, className = "", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={`w-[90%] 2xl:w-[85%] mx-auto px-0 xl:px-8 2xl:px-16 ${className}`}
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
