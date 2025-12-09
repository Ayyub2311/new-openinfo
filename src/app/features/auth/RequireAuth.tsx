// src/app/shared/auth/RequireAuth.tsx
"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { useAuthStore } from "@/app/shared/store/useAuthstore";
import { authModal } from "@/app/shared/store/authModalStore";
import { useTranslations } from "next-intl";

export default function RequireAuth({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  const t = useTranslations();
  const { user, loading, initialized, ensureLoaded } = useAuthStore();

  useEffect(() => {
    if (!initialized && !loading) {
      void ensureLoaded();
    }
  }, [initialized, loading, ensureLoaded]);

  if (!initialized || loading) {
    return <span className="text-sm text-gray-500">{t("Login.loading")}</span>;
  }

  if (!user) {
    if (fallback) return fallback;

    return (
      <div className="rounded-xl border border-dashed p-6 text-center text-sm text-gray-600">

        <h2 className="mb-2">Войдите, чтобы продолжить </h2>

        <p className="mb-2"> Функция доступна только для зарегистрированных пользователей.
        </p>
        <button
          type="button"
          onClick={() => authModal.open("required")}
          className="inline-flex px-4 py-2 rounded-xl bg-blue-600 text-white text-sm"
        >
          {t("Login.login")}
        </button>
      </div>
    );
  }

  return <>{children}</>;
}
