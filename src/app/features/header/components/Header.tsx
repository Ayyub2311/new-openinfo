"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Search, X, Globe } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import HeaderUserSection from "./HeaderClient";

import AutocompleteSearch from "./AutocompleteSearch";
import { Divider } from "antd/lib";

// import type { Session } from "@/app/auth/session";
// import UserMenu from "../UserMenu";

// function DiamondDots() {
//   const rows = 5;
//   const cols = 65;

//   const dotSize = 10;
//   const gapX = 28;
// const gapY = 16;

//   const cx = dotSize + gapX;
//   const cy = dotSize + gapY;
//   const offset = cx / 2;
//   const rowMarginTop = (cy - dotSize); 

//   return (
//     <div className="absolute inset-0 pointer-events-none z-0 flex flex-col">
//   {[...Array(rows)].map((_, rowIndex) => (
//     <div 
//     key={rowIndex} 
//     className="flex w-full"
//     style={{ 
//       marginLeft: rowIndex % 2 === 0 ? 0 : offset,
//       marginTop: rowIndex === 0 ? 0 : rowMarginTop,
//       alignItems: "center",
//       minHeight: dotSize,
//       }}
//       >
//     {[...Array(cols)].map((_, colIndex) => {
//     const topOpacity = 0.07;
//     const bottomOpacity = 0.02;
//     const opacity = 
//     Math.max(
//       bottomOpacity, 
//       topOpacity - (rowIndex / (rows - 1)) * (topOpacity - bottomOpacity)
//     );

//     return (
//       <div
//       key={colIndex}
//       className="rounded-full"
//       style={{ 
//         width: dotSize,
//         height: dotSize,
//         background: "white",
//         opacity,
//       marginRight: gapX,
//       flex: "0 0 auto",
//       }}
//       />
//     );
// })}
// </div>
// ))}
// </div>
//   )
// }

export default function HeaderClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const params = useParams();
  const currentPath = usePathname();
  const locale = params.locale as string;
  const t = useTranslations();
  const router = useRouter();

  const changeLocale = (targetLocale: string) => {
    const pathWithoutLocale = currentPath?.replace(new RegExp(`^/${locale}(?=/|$)`), "") || "/";
    const suffix = pathWithoutLocale === "/" ? "" : pathWithoutLocale;
    router.push(`/${targetLocale}${suffix}`);
    setIsLangOpen(false);
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!langMenuRef.current) return;
      if (!langMenuRef.current.contains(e.target as Node)) setIsLangOpen(false);
    }
    if (isLangOpen) document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [isLangOpen]);

  const navLinks = [
    { icon: "/assets/header-icons/main.svg", text: t("Navigation.main"), href: `/` },
    {
      icon: "/assets/header-icons/license.svg",
      text: t("Navigation.license_certification"),
      href: `/license-certification`,
    },
    {
      icon: "/assets/header-icons/organizations-icon.svg",
      text: t("Navigation.organizations"),
      href: `/organizations`,
    },
    {
      icon: "/assets/header-icons/inovations.svg",
      text: t("Navigation.investment_brokers"),
      href: `/investment-brokers`,
    },
    { icon: "/assets/header-icons/legislations-icon.svg", text: t("Navigation.legislation"), href: `/legislation` },
    { icon: "/assets/header-icons/sitemap-icon.svg", text: t("Navigation.sitemap"), href: `/sitemap` },
    { icon: "/assets/header-icons/portfolios-icon.svg", text: t("Navigation.portfolio"), href: `/portfolio` },
  ];

  return (
    <nav className="sticky top-0 left-0 w-full z-50  bg-gradient-to-r from-[#182c3a] to-[#2a3f54] min-h-[64px] ">
      
{/* <DiamondDots /> */}
      {/* Mobile Top Navigation */}
      <div className="lg:hidden relative flex items-center justify-between h-16 border-b border-gray-500 dark:border-black container mx-auto px-4">
        <Link href="/" locale={locale} className="flex items-center hover:opacity-80 transition-opacity">
          <Image src="/assets/logo.svg" alt="Logo" className="h-6 w-6" width={20} height={20} />
          <span className="text-white font-bold ml-2">OPENINFO.UZ</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="relative flex items-center" ref={langMenuRef}>
            <button
              aria-haspopup="menu"
              aria-expanded={isLangOpen}
              onClick={() => setIsLangOpen(v => !v)}
              className="text-white"
            >
              <Globe className="h-5 w-5" />
            </button>

            {isLangOpen && (
              <div
                role="menu"
                className="absolute right-0 top-8 w-36 rounded-lg bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
              >
                <button
                  role="menuitem"
                  onClick={() => changeLocale("en")}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
                >
                  <Image src="/assets/language-icons/english.svg" alt="EN" width={18} height={18} className="mr-2" />
                  <span className="text-sm">English</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => changeLocale("uz")}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
                >
                  <Image src="/assets/language-icons/uzbek.svg" alt="UZ" width={18} height={18} className="mr-2" />
                  <span className="text-sm">O‘zbekcha</span>
                </button>
                <button
                  role="menuitem"
                  onClick={() => changeLocale("ru")}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-100"
                >
                  <Image src="/assets/language-icons/russian.svg" alt="RU" width={18} height={18} className="mr-2" />
                  <span className="text-sm">Русский</span>
                </button>
              </div>
            )}
          </div>

          <button onClick={() => setIsSearchOpen(v => !v)} className="text-white">
            <Search className="h-5 w-5" />
          </button>
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation */}
      <div className="lg:hidden flex items-center container mx-auto px-4 p-2 space-x-4">
        <Link href="/login" className="text-white text-sm hover:text-blue-200">
          {t("Navigation.issuer_profile")}
        </Link>
        <span className="text-white">/</span>
        <a href="https://invest.openinfo.uz/before-login" className="text-white text-sm hover:text-blue-200">
          {t("Navigation.investor_account")}
        </a>
      </div>

      {isSearchOpen && (
        <div className="lg:hidden container mx-auto px-4 py-2 border-b border-blue-500/50">
          <input
            type="text"
            placeholder="Search --"
            className="w-full px-4 py-2 rounded placeholder-blue-200 focus:outline-none focus:border-blue-300"
          />
        </div>
      )}

      {/* Desktop Top Navigation */}
      <div className="hidden lg:flex items-center justify-between h-16 border-b border-gray-500  container mx-auto px-4 xl:px-0">
        <Link href="/" locale={locale} className="flex items-center hover:opacity-80 transition-opacity">
          <Image src="/assets/logo.svg" alt="Logo" className="h-6 w-6" width={20} height={20} />
          <span className="text-white font-bold ml-2">OPENINFO.UZ</span>
        </Link>

        <AutocompleteSearch />

        <div className="flex items-center">
          <div className="mr-1 flex items-center space-x-2">
            <button onClick={() => changeLocale("en")} aria-label="Switch to English">
              <Image src="/assets/language-icons/english.svg" alt="EN" width={20} height={20} />
            </button>
            <button onClick={() => changeLocale("uz")} aria-label="Switch to Uzbek">
              <Image src="/assets/language-icons/uzbek.svg" alt="UZ" width={20} height={20} />
            </button>
            <button onClick={() => changeLocale("ru")} aria-label="Switch to Russian">
              <Image src="/assets/language-icons/russian.svg" alt="RU" width={20} height={20} />
            </button>
          </div>

          <Divider type="vertical" className="h-6  border-primary" />
          <HeaderUserSection />
        </div>
      </div>

      {/* Desktop Navigation Links */}
      <div className="hidden lg:flex items-center h-12 border-b border-blue-500/50 dark:border-black container px-4 xl:px-0 justify-between overflow-x-hidden lg:overflow-x-auto gap-1">
        {navLinks.map((link, index) => {
          const isHome = link.href === "/" && (currentPath === `/${locale}` || currentPath === `/${locale}/`);
          const isActive = isHome || (link.href !== "/" && currentPath?.startsWith(`/${locale}${link.href}`));
          return (
            <Link
              key={index}
              href={link.href}
              locale={locale}
              className={`relative flex h-full items-center mr-6 last:mr-0 whitespace-nowrap cursor-pointer hover:text-blue-200 text-white`}
            >
              {link.icon && <Image src={link.icon} alt={link.text} className="mr-2" width={20} height={20} />}
              <span>{link.text}</span>
              {isActive && (<span className="absolute bottom-0 left-0 w-full h-1 bg-white"></span>)}
            </Link>
          );
        })}
      </div>

      {/* Mobile Sidebar */}
      {isSidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 w-64 bg-gradient-to-r from-[#182c3a] to-[#2a3f54] dark:bg-blue-800 p-4">
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-bold">{t("Navigation.menu")}</span>
              <button onClick={() => setIsSidebarOpen(false)} className="text-white" aria-label="Close menu">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="flex flex-col space-y-4">
              {navLinks.map((link, index) => {
                const isHome = link.href === "/" && (currentPath === `/${locale}` || currentPath === `/${locale}/`);
                const isActive = isHome || (link.href !== "/" && currentPath?.startsWith(`/${locale}${link.href}`));
                return (
                  <Link
                    key={index}
                    href={link.href}
                    locale={locale}
                    className={`flex items-center hover:text-blue-200 ${
                      isActive ? "text-white font-semibold underline" : "text-white"
                    }`}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    {link.icon && <Image src={link.icon} alt={link.text} className="mr-2" width={20} height={20} />}
                    <span>{link.text}</span>
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 border-t border-blue-500/40 pt-4">
              <div className="flex items-center space-x-3">
                <button onClick={() => changeLocale("en")} className="flex items-center text-white">
                  <Image src="/assets/language-icons/english.svg" alt="EN" width={18} height={18} className="mr-1" />
                  EN
                </button>
                <button onClick={() => changeLocale("uz")} className="flex items-center text-white">
                  <Image src="/assets/language-icons/uzbek.svg" alt="UZ" width={18} height={18} className="mr-1" />
                  UZ
                </button>
                <button onClick={() => changeLocale("ru")} className="flex items-center text-white">
                  <Image src="/assets/language-icons/russian.svg" alt="RU" width={18} height={18} className="mr-1" />
                  RU
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
