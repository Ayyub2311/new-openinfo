import Card from ".";
import Divider from "../Divider";
import { CardGridProps } from "./types";
import { motion } from "framer-motion";

export const CardGrid: React.FC<CardGridProps> = ({ items, className = "" }) => {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          className="min-h-[100px] w-full h-full relative overflow-hidden rounded-2xl shadow-md bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card {...item} className="h-full flex flex-col justify-between" />
          <Divider />
        </motion.div>
      ))}
    </div>
  );
};
