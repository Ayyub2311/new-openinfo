// src/app/(root)/providers/AuthUIMount.tsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/app/shared/store/useAuthstore";
import LoginModal from "@/app/features/auth/LoginModal";

export default function AuthUIMount() {
  const { ensureLoaded } = useAuthStore();
  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);
  return <LoginModal />;
}
