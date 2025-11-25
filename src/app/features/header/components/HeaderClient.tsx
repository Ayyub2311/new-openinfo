"use client";

import { useEffect } from "react";
import { Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { useAuthStore } from "@/app/shared/store/useAuthstore";
import { authModal } from "@/app/shared/store/authModalStore";
import { useTranslations } from "next-intl";

export default function HeaderUserSection() {
  const t = useTranslations();

  // ✅ single call to useAuthStore
  const { user, logout, loading, ensureLoaded, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) ensureLoaded();
  }, [initialized, ensureLoaded]);

  if (loading && !initialized) {
    return <span className="text-white text-sm">…</span>;
  }

  if (!user) {
    return (
      <button
        onClick={() => authModal.open("manual")} // 👉 just open the modal
        className="flex items-center text-white hover:text-blue-200"
      >
        <img src="/assets/header-icons/profile-icon.svg" width={20} height={20} alt="" />
        <span className="ml-1 text-sm">{t("Login.login")}</span>
      </button>
    );
  }

  const menuItems: MenuProps["items"] = [
    {
      key: "adminpanel",
      label: (
        <a href="https://openinfo.uz/ru/admin/" target="_blank" className="text-white text-sm hover:text-blue-200">
          {t("Navigation.issuer_profile")}
        </a>
      ),
    },
    {
      key: "investoraccount",
      label: (
        <a
          href="https://invest.openinfo.uz/before-login"
          target="_blank"
          className="text-white text-sm hover:text-blue-200"
        >
          {t("Navigation.investor_account")}
        </a>
      ),
    },
    { type: "divider" },
    {
      key: "logout",
      danger: true,
      label: <button onClick={logout}>{t("Login.logout")}</button>,
    },
  ];

  return (
    <div className="flex items-center space-x-4">
      <Dropdown menu={{ items: menuItems }} trigger={["click"]} placement="bottomRight">
        <div className="flex items-center space-x-2 text-white cursor-pointer">
          <Avatar src={user.avatar ?? undefined} size={28}>
            {(user.first_name || user.username || "?").slice(0, 1).toUpperCase()}
          </Avatar>
          <span className="text-sm hidden xl:inline">{user.first_name || user.username}</span>
        </div>
      </Dropdown>
    </div>
  );
}
