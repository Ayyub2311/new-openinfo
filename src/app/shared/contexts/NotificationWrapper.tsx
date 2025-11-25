"use client";

import { NotificationProvider } from "./NotificationContext";

export function NotificationWrapper({ children }: { children: React.ReactNode }) {
  return <NotificationProvider>{children}</NotificationProvider>;
}
