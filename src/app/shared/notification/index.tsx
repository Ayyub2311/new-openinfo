"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Text } from "../ui/components/Typography/Text";

interface NotificationProps {
  message: string;
  type: "success" | "error" | "info";
  duration?: number;
  onClose?: () => void;
}

export function Notification({ message, type, duration = 4000, onClose }: NotificationProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const bgColor = {
    success: "bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700",
    error: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700",
    info: "bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700",
  }[type];

  const textColor = {
    success: "text-green-700 dark:text-green-100",
    error: "text-red-700 dark:text-red-100",
    info: "text-blue-700 dark:text-blue-100",
  }[type];

  const iconColor = {
    success: "text-green-500 dark:text-green-300",
    error: "text-red-500 dark:text-red-300",
    info: "text-blue-500 dark:text-blue-300",
  }[type];

  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl border ${bgColor} shadow-lg max-w-sm`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 ${iconColor}`}>
          {type === "success" && <CheckCircle2 className="w-5 h-5" />}
          {type === "error" && <AlertCircle className="w-5 h-5" />}
          {type === "info" && <Info className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <Text className={`font-medium ${textColor}`}>{message}</Text>
        </div>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className={`p-1 rounded-full hover:bg-opacity-20 ${iconColor} hover:bg-black dark:hover:bg-white hover:bg-opacity-10`}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
