"use client";
import Image from "next/image";
import { Text } from "../Typography/Text";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface SidebarProps {
  items: { id: string; label: string; icon: string; component: React.ReactNode }[];
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  const [current, setCurrent] = useState(items[0]?.id);

  const t = useTranslations();
  return (
    <div className="w-full box-border items-stretch flex border-2 border-default mb-6">
      <div className="flex-1 min-w-0 ">
        <div className=" p-6 box-border ">{items.find(item => item.id === current)?.component}</div>
      </div>

      <div
        className="bg-secondary sticky top-20  w-[75px] pl-[3px] pr-[3px] box-border pt-6 pb-6 border-l-2 border-default"
        style={{ height: "calc(100vh - 10px)" }}
      >
        <div className="flex flex-col gap-8">
          {items.map(item => (
            <div
              className={`flex flex-col gap-1 items-center cursor-pointer p-2 rounded-md transition-colors ${
                item.id === current ? "bg-[#1256A0]/10 text-[#1256A0]" : "hover:bg-gray-100 text-gray-600"
              }`}
              key={item.id}
              onClick={() => setCurrent(item.id)}
            >
              <div className={`relative w-6 h-6 ${item.id === current ? "text-[#1256A0]" : "text-gray-500"}`}>
                <Image
                  src={item.icon}
                  fill
                  alt={item.label}
                  className={item.id === current ? "!text-[#1256A0]" : ""}
                  style={{
                    filter:
                      item.id === current
                        ? "brightness(0) saturate(100%) invert(22%) sepia(96%) saturate(1024%) hue-rotate(183deg) brightness(93%) contrast(89%)"
                        : "none",
                  }}
                />
              </div>
              <Text size="2xs" className={`text-center ${item.id === current ? "font-medium" : "font-normal"}`}>
                {t(`Sidebar.${item.label}`)}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
