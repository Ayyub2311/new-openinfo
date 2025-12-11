"use client";

import { useEffect } from "react";
import { Dropdown, Avatar } from "antd";
import type { MenuProps } from "antd";
import { useAuthStore } from "@/app/shared/store/useAuthstore";
import { authModal } from "@/app/shared/store/authModalStore";
import { useTranslations } from "next-intl";
import Image from "next/image";

export default function HeaderUserSection() {
  const t = useTranslations();
  const { user, logout, loading, ensureLoaded, initialized } = useAuthStore();

  useEffect(() => {
    if (!initialized) ensureLoaded();
  }, [initialized, ensureLoaded]);

  // While we don't know yet, show small placeholder
  if (loading && !initialized) {
    return <span className="text-white text-sm">…</span>;
  }

  // 🔹 Build menu items depending on auth state
  const menuItems: MenuProps["items"] = user
    ? [
      {
        key: "adminpanel",
        label: (
          <span className="text-sm">
            {t("Navigation.issuer_profile")}
          </span>
        ),
      },
      {
        key: "investoraccount",
        label: (
          <span className="text-sm">
            {t("Navigation.investor_account")}
          </span>
        ),
      },
      { type: "divider" as const },
      {
        key: "logout",
        danger: true,
        label: (
          <span className="text-sm">
            {t("Login.logout")}
          </span>
        ),
      },
    ]
    : [
      {
        key: "adminpanel",
        label: (
          <span className="text-sm">
            {t("Navigation.issuer_profile")}
          </span>
        ),
      },
      {
        key: "investoraccount",
        label: (
          <span className="text-sm">
            {t("Navigation.investor_account")}
          </span>
        ),
      },
      { type: "divider" as const },
      {
        key: "login",
        label: (
          <span className="text-sm">
            {t("Login.login")}
          </span>
        ),
      },
    ];

  // 🔹 Centralized click handling (fixes "logout sometimes doesn't work")
  const handleMenuClick: MenuProps["onClick"] = async ({ key }) => {
    try {
      if (key === "adminpanel") {
        window.open("https://openinfo.uz/ru/admin/", "_blank");
      } else if (key === "investoraccount") {
        window.open("https://invest.openinfo.uz/before-login", "_blank");
      } else if (key === "login") {
        authModal.open("manual");
      } else if (key === "logout") {
        await logout();
      }
    } catch (e) {
      console.error("HeaderUserSection menu click error:", e);
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <Dropdown
        menu={{ items: menuItems, onClick: handleMenuClick }}
        trigger={["click"]}
        placement="bottomRight"
      >
        {/* 🔹 Trigger – always visible (authorized or not) */}
        <div className="flex items-center space-x-2 text-white cursor-pointer">
          {user ? (
            <Avatar src={user.avatar ?? undefined} size={28}>
              {(user.first_name || user.username || "?")
                .slice(0, 1)
                .toUpperCase()}
            </Avatar>
          ) : (
            <Image
              src="/assets/header-icons/profile-icon.svg"
              width={20}
              height={20}
              alt="Profile"
            />
          )}

          <span className="text-sm hidden xl:inline">
            {user?.first_name || user?.username || t("Login.login")}
          </span>
        </div>
      </Dropdown>
    </div>
  );
}
