import { BoxSplitterProps } from "./types";

export const BoxSplitter = ({ className = "" }: BoxSplitterProps) => {
  return <div className={`w-full h-px border-t border-gray-200 ${className}`} />;
};
