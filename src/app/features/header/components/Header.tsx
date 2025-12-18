"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, Search, X, Globe } from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import HeaderUserSection from "./HeaderClient";

import AutocompleteSearch from "./AutocompleteSearch";
import { Divider } from "antd";
import Container from "@/app/shared/ui/components/Container";
import { Alert, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { Undo2 } from "lucide-react";


export default function HeaderClient() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);
  const [showLegacyBar, setShowLegacyBar] = useState(true);

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

  const [hideTopDesktop, setHideTopDesktop] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 1024) return;

    let lastY = window.scrollY;
    let hide = hideTopDesktop;

    const SCROLL_THRESHOLD = 20;

    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY;

      {
        if (delta > SCROLL_THRESHOLD && !hide) {
          hide = true;
          setHideTopDesktop(true);
        } else if (delta < -SCROLL_THRESHOLD && hide) {
          hide = false;
          setHideTopDesktop(false);
        }
      }

      lastY = y;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const UndoIcon = () => (
    <Undo2 className="w-5 h-5 text-white stroke-[1.75]" />
  );


  // const btnRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  // const handleMagneticMove = (e: React.MouseEvent, index: number) => {
  //   const btn = btnRefs.current[index];
  //   if (!btn) return;

  //   const rect = btn.getBoundingClientRect();
  //   const x = e.clientX - rect.left - rect.width / 2;
  //   const y = e.clientY - rect.top - rect.height / 2;

  //   btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  // };

  // const handleMagneticLeave = (index: number) => {
  //   const btn = btnRefs.current[index];
  //   if (!btn) return;

  //   btn.style.transform = "translate(0, 0)";
  // };

  return (
    <nav className="sticky top-0 left-0 w-full z-50  bg-gradient-to-r from-[#182c3a] to-[#2a3f54] ">

      <div
        className={`"bg-[#0ea5e9]" bg-[#f59e0b] overflow-hidden transition-all duration-300 ease-in-out ${showLegacyBar ? "max-h-10 opacity-100" : "max-h-0 opacity-0"
          }`}
      >
        <Container>
          <Alert
            type="info"
            banner
            showIcon={false}
            className="bg-transparent px-0 py-1"
            message={
              <div className="flex items-center justify-center gap-5 w-full">
                <a
                  href="https://new.openinfo.uz"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black hover:underline hover:text-white font-medium"
                >
                  {t("Navigation.legacy_site")}
                </a>

                <Button
                  type="text"
                  icon={<CloseOutlined className="text-white" />}
                  onClick={() => setShowLegacyBar(false)}
                />
              </div>
            }
          />
        </Container>

      </div>


      {!showLegacyBar && (
        <div className="bg-transparent animate-fade-in">
          <Container className="flex justify-end pt-1">
            <Button
              type="text"
              icon={<UndoIcon />}
              className="w-auto transition-transform hover:text-white hover:-translate-x-0.5 text-white"
              onClick={() => setShowLegacyBar(true)}
            />
          </Container>

        </div>
      )}

      <Container>
        {/* Mobile Top Navigation */}
        <div className="lg:hidden relative flex items-center justify-between h-16 border-b border-default dark:border-black mx-auto">
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
                  className="absolute right-0 top-8 w-36 rounded-xl bg-white shadow-lg ring-1 ring-black/5 overflow-hidden"
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
        <div className="lg:hidden flex items-center mx-auto py-2 space-x-4">
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
              className="w-full px-4 py-2 rounded-xl placeholder-blue-200 focus:outline-none focus:border-blue-300"
            />
          </div>
        )}

        {/* Desktop Top Navigation */}
        <div className="hidden lg:flex h-16 items-center justify-between border-b border-default border-opacity-30 mx-auto transition-all duration-300"
          style={{
            transform: hideTopDesktop ? "translateY(-100%)" : "translateY(0)",
            opacity: hideTopDesktop ? 0 : 1,
            maxHeight: hideTopDesktop ? 0 : "64px",
          }}
        >
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
        <div className="hidden lg:flex flex-wrap items-center h-full pt-3 dark:border-black overflow-x-auto overflow-y-hidden justify-between">
          {navLinks.map((link, index) => {
            const isHome = link.href === "/" && (currentPath === `/${locale}` || currentPath === `/${locale}/`);
            const isActive = isHome || (link.href !== "/" && currentPath?.startsWith(`/${locale}${link.href}`));
            return (
              <Link
                key={index}
                href={link.href}
                locale={locale}
                // ref={(el) => (btnRefs.current[index] = el)}
                // onMouseMove={(e) => handleMagneticMove(e, index)}
                // onMouseLeave={() => handleMagneticLeave(index)}
                className={`relative flex flex-shrink-0 h-full pb-3 items-center whitespace-nowrap cursor-pointer text-white transition-transform duration-300 ease-out
                  after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-white after:opacity-80 after:w-0 after:transition-all after:duration-300 hover:after:w-full
                  `}
              >
                {link.icon && <Image src={link.icon} alt={link.text} className="mr-2 w-[12px] h-[12px] xl:w-[16px] xl:h-[16px]" width={20} height={20} />}
                <span className="text-xs xl:text-sm 2xl:text-base">{link.text}</span>
                {isActive && (<span className="absolute bottom-0 left-0 w-full h-[2px] bg-white"></span>)}
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
                      className={`flex items-center hover:text-blue-200 ${isActive ? "text-white font-semibold underline" : "text-white"
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
      </Container>

    </nav>
  );
}
