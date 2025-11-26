import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Pattern from "public/pattern.svg"

const Footer = () => {
  const t = useTranslations();

  return (
    <footer className="relative w-full h-full bg-[#182c3a] overflow-hidden">
      {/* <div className="absolute inset-0 bg-black/20" /> */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#182c3a]/70 to-[#2a3f54]/70 " />

      <Image src={Pattern} alt="Top Left" className="absolute -top-[65px] -left-[65px] w-[200px] h-[200px] opacity-15"/>
      <Image src={Pattern} alt="Top Right" className="absolute -top-[55px] right-[135px] w-[150px] h-[150px] opacity-15"/>
      <Image src={Pattern} alt="Bottom Left" className="absolute -bottom-[55px] left-[245px] w-[135px] h-[135px] opacity-10"/>
      <Image src={Pattern} alt="Bottom Right" className="absolute -bottom-[55px] -right-[15px] w-[180px] h-[180px] opacity-5"/>
      <Image src={Pattern} alt="Random Pattern" className="absolute -top-[80px] left-1/2 w-[160px] h-[160px] opacity-5"/>
      <Image src={Pattern} alt="Random Pattern" className="absolute bottom-[100px] right-1/4 w-[120px] h-[120px] opacity-5"/>
      <Image src={Pattern} alt="Random Pattern" className="absolute bottom-[160px] left-1/4 w-[140px] h-[140px] opacity-5"/>
      <div className="flex relative z-10 h-full">
        <div className="container mx-auto mt-8 md:mt-12 lg:mt-16 xl:mt-24 2xl:mt-32 mb-8 px-4 xl:px-0">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            <div className="space-y-6">
              <h2 className="text-white font-semibold text-sm md:text-base max-w-lg">
                {t("Footer.portal_description")}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Image src="/assets/general-icons/logos_telegram.svg" alt="Broker Icon" width={20} height={20} />
                  <span className="text-white font-semibold text-sm">
                    {" "}
                    <a href="https://t.me/openinfouz_bot" target="_blank">
                      openinfouz_bot
                    </a>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/assets/general-icons/phone-icon.svg" alt="Broker Icon" width={20} height={20} />
                  <span className="text-white font-semibold text-sm">
                    {" "}
                    <a href="tel:+998712317909">+998 71 231 79 09</a>
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <Image src="/assets/general-icons/location-icon.svg" alt="Broker Icon" width={20} height={20} />
                  <span className="text-white font-semibold text-sm">
                    <a
                      href="https://yandex.uz/maps/10335/tashkent/house/YkAYdA9iSEUPQFprfX54dXRqZw==/?ll=69.282108%2C41.294893&z=17"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t("Footer.address")}
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <span className="text-white font-semibold text-sm">{t("Footer.moderator_phone")}</span>
                  <span className="text-white text-sm">
                    {" "}
                    <a href="tel:+998712311875" target="_blank" rel="noopener noreferrer">
                      +998 71 231 18 75
                    </a>
                  </span>
                </div>
                <div className="flex flex-col md:flex-row gap-2 md:items-center">
                  <span className="text-white font-semibold text-sm">{t("Footer.moderator_email")}</span>
                  <span className="text-white text-sm">
                    {" "}
                    <a href="mailto:info@napp.uz" target="_blank" rel="noopener noreferrer">
                      info@napp.uz
                    </a>
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-white text-sm max-w-lg">
                  <a href="https://napp.uz/ru#zero-496">{t("Footer.agency_description")}</a>
                </p>
                <p className="text-white text-sm max-w-lg">
                  <a href="https://www.kapitalbozori.uz/about/#">{t("Footer.technical_support")}</a>
                </p>
                <p className="text-white text-sm max-w-lg">
                  <a href="https://www.kapitalbozori.uz/about/#">
                    <b> {t("Footer.resource_center")} </b>
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gray-200/60 my-6"></div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <span className="text-white font-semibold text-sm">{t("Footer.copyright")}</span>
            <p className="text-white font-semibold text-sm text-left md:text-right max-w-lg">
              {t("Footer.usage_notice")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
