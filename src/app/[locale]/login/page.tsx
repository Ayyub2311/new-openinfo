"use client";

import { useState } from "react";

import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { useTranslations } from "next-intl";
import RegistrationModal from "@/app/features/auth/components/Register";
import { Button } from "@/app/shared/ui/components/Button";
import Input from "@/app/shared/ui/components/Input";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/shared/store/useAuthstore";

export default function LoginPage() {
  const [showRegistration, setShowRegistration] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const t = useTranslations();

  // const handleRegistrationClick = () => {
  //   setShowRegistration(true);
  // };

  const handleRegistrationClose = () => {
    setShowRegistration(false);
  };

  const handleGoogleSignIn = () => {
    window.location.href = `https://new-api.openinfo.uz/api/v2/investors/google/login/?result_redirect=${encodeURIComponent("https://testing.openinfo.uz/ru/portfolio")}`;
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

      // Redirect or handle successful login
      await useAuthStore.getState().fetchUser();
      router.refresh();
    } catch (err) {
      console.error("Login failed", err);
      setError(t("Login.invalid_credentials"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {showRegistration && <RegistrationModal onClose={handleRegistrationClose} />}

      <div className="flex items-center justify-center mt-10 px-4">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-[400px] p-6 border border-gray-200">
          <h1 className="text-xl font-bold text-center text-gray-800 mb-5">{t("Login.login")}</h1>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">{t("Login.username")}</label>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder={t("Login.username")}
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">{t("Login.password")}</label>
              <Input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder={t("Login.password")}
                required
              />
            </div>

            {error && <div className="text-red-500 text-xs text-center py-1">{error}</div>}

            <div className="pt-2 w-full">
              <Button
                type="submit"
                variant="filled"
                color="primary"
                size="md"
                isLoading={isLoading}
                disabled={isLoading}
                className="w-full"
              >
                {t("Login.login")}
              </Button>

              {/* <Button
                type="button"
                variant="outline"
                color="primary"
                size="md"
                disabled={isLoading}
                className="w-full"
                onClick={handleRegistrationClick}
              >
                {t("Login.register")}
              </Button> */}
            </div>
            {/*
            <div className="text-center pt-1">
              <Link href="/auth/forgot-password" className="text-xs text-blue-600 hover:underline transition">
                {t("Login.forgot_password")}
              </Link>
            </div> */}

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-2 bg-white text-gray-500">или</span>
              </div>
            </div>

            <div>
              <Button
                type="button"
                variant="outline"
                color="default"
                size="md"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
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
                {t("Login.login_with_google")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
