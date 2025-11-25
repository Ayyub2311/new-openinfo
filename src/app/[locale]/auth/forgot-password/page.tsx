"use client";
import ForgotPassword from "@/app/features/auth/components/ForgotPassword";
import React from "react";

import { useRouter } from "@/i18n/routing";
import { useNotification } from "@/app/shared/contexts/NotificationContext";
import { FetchService } from "@/app/shared/lib/api/fetch.service";

const AuthPage: React.FC = () => {
  const { showNotification } = useNotification();
  const router = useRouter();

  const handleSubmit = async (email: string) => {
    try {
      await FetchService.fetch("/api/v2/userprofile/users/reset_password/", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      showNotification({
        message: "Password reset link sent! Please check your email.",
        type: "success",
        duration: 5000,
      });

      return true; // Indicate success to the ForgotPassword component
    } catch (error) {
      showNotification({
        message: "Failed to send reset link. Please try again.",
        type: "error",
        duration: 5000,
      });
      console.error("Reset password error:", error);
      return false; // Indicate failure
    }
  };

  const handleBackToLogin = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 p-4">
      <ForgotPassword onSubmit={handleSubmit} onBackToLogin={handleBackToLogin} />
    </div>
  );
};

export default AuthPage;
