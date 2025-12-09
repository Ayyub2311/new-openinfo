"use client";
import RequireAuth from "../../auth/RequireAuth";
import SidebarSubscriptions from "./SidebarSubscriptions";
import { authModal } from "@/app/shared/store/authModalStore";

export default function NotificationsContainer() {
  return (
    <RequireAuth
      fallback={
        <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-600">
          <p className="mb-2">Требуется вход, чтобы увидеть уведомления.</p>
          <button
            type="button"
            onClick={() => authModal.open("required")}
            className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
          >
            Войти
          </button>
        </div>
      }
    >
      <SidebarSubscriptions />
    </RequireAuth>
  );
}
