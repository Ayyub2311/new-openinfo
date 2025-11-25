"use client";
import RequireAuth from "../../auth/RequireAuth";
import SidebarSubscriptions from "./SidebarSubscriptions";

export default function NotificationsContainer() {
  return (
    <RequireAuth
      fallback={
        <div className="rounded-xl border border-dashed p-5 text-center text-sm text-gray-600">
          Требуется вход, чтобы увидеть список наблюдения
        </div>
      }
    >
      <SidebarSubscriptions />
    </RequireAuth>
  );
}
