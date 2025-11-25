import { LucideLoaderCircle } from "lucide-react";

const Loader = () => {
  return (
    <div className="flex items-center justify-center animate-spin text-primary">
      <LucideLoaderCircle size={32} className="text-gray-500 dark:text-gray-300" />
    </div>
  );
};

export default Loader;
