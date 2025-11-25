"use client";

import { Select } from "antd";
import Image from "next/image";

const LanguageSelect = ({
  currentLocale,
  changeLocale,
}: {
  currentLocale: string;
  changeLocale: (locale: string) => void;
}) => {
  const options = [
    {
      value: "en",
      label: (
        <div className="">
          <Image src="/assets/language-icons/english.svg" alt="EN" width={25} height={25} />
        </div>
      ),
    },
    {
      value: "uz",
      label: (
        <div className="">
          <Image src="/assets/language-icons/uzbek.svg" alt="UZ" width={25} height={25} />
        </div>
      ),
    },
    {
      value: "ru",
      label: (
        <div className="">
          <Image src="/assets/language-icons/russian.svg" alt="RU" width={25} height={25} />
        </div>
      ),
    },
  ];

  return (
    <Select
      value={currentLocale}
      onChange={val => changeLocale(val)}
      options={options}
      className="w-fit"
      placement="bottomRight"
      variant="borderless"
      suffixIcon={null}
    />
  );
};

export default LanguageSelect;
