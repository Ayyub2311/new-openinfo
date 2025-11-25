"use client";

import { X } from "lucide-react";
import { useState } from "react";
import RegistrationModal from "./Register";
import { Link } from "@/i18n/routing";
import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  setNotification: (
    notification: {
      message: string;
      type: "success" | "error" | "info";
    } | null
  ) => void;
}

export default function LoginModal({ isOpen, onClose, setNotification }: Props) {
  const [showRegistration, setShowRegistration] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const t = useTranslations();

  if (!isOpen) return null;

  const handleRegistrationClick = () => {
    setShowRegistration(true);
    // onClose();
  };

  const handleRegistrationClose = () => {
    setShowRegistration(false);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `https://new-api.openinfo.uz/api/v2/investors/google/login/?result_redirect=${encodeURIComponent("https://testing.openinfo.uz/ru/login")}`;
  };

  const handleForgotPasswordClick = () => {
    // onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await FetchService.fetch("/api/v2/userprofile/jwt/create/custom/", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
        }),
      });

      setNotification({
        message: t("Login.login_success"),
        type: "success",
      });
      onClose();
    } catch (err) {
      console.error("Login failed", err);
      setError(t("Login.invalid_credentials"));
      setNotification({
        message: t("Login.login_failed"),
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showRegistration && <RegistrationModal onClose={handleRegistrationClose} />}

      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative border border-gray-200">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <form className="space-y-6 mt-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">{t("Login.username")}</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">{t("Login.password")}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}

            <div className="grid grid-cols-2 gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all font-medium shadow-md hover:shadow-lg ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? t("Login.loading") : t("Login.login")}
              </button>
              <button
                type="button"
                disabled={isLoading}
                className={`h-12 w-full bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-all font-medium shadow-sm hover:shadow-md ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <Link
                  href="/auth/register"
                  className="w-full h-full flex items-center justify-center"
                  onClick={handleRegistrationClick}
                >
                  {t("Login.register")}
                </Link>
              </button>
            </div>

            <div className="text-center">
              <Link
                href="/auth/forgot-password"
                className="text-sm text-blue-600 hover:underline transition"
                onClick={handleForgotPasswordClick}
              >
                {t("Login.forgot_password")}
              </Link>
            </div>

            <div>
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className={`h-12 w-full flex items-center justify-center gap-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition shadow-sm hover:shadow-md ${
                  isLoading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="text-sm font-medium text-gray-700">{t("Login.login_with_google")}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
