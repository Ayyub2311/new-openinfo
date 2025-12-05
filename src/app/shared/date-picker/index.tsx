"use client";

import { CalendarOutlined } from "@ant-design/icons";
import { DatePicker as AntDatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";
import { useLocale } from "next-intl";

import enUS from "antd/es/date-picker/locale/en_US";
import ruRU from "antd/es/date-picker/locale/ru_RU";
import "dayjs/locale/uz";
import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);

dayjs.updateLocale("uz", {
  name: "uz",
  months: [
    "Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun",
    "Iyul", "Avgust", "Sentyabr", "Oktyabr", "Noyabr", "Dekabr"
  ],
  monthsShort: [
    "Yan", "Fev", "Mar", "Apr", "May", "Iyun",
    "Iyul", "Avg", "Sen", "Okt", "Noy", "Dek"
  ],
  weekdays: [
    "Yakshanba", "Dushanba", "Seshanba", "Chorshanba",
    "Payshanba", "Juma", "Shanba"
  ],
  weekdaysShort: ["Yak", "Dush", "Sesh", "Chor", "Pay", "Jum", "Shan"],
  weekdaysMin: ["Ya", "Du", "Se", "Ch", "Pa", "Ju", "Sh"],
});

const uzUZ = {
  lang: {
    locale: 'uz',
    today: 'Bugun',
    now: 'Hozir',
    backToToday: 'Bugunga qayt',
    ok: 'OK',
    clear: 'Tozalash',
    month: 'Oy',
    year: 'Yil',
    timeSelect: 'Vaqtni tanlash',
    dateSelect: 'Sana tanlash',
    monthSelect: 'Oyni tanlash',
    yearSelect: 'Yilni tanlash',
    decadeSelect: 'O‘n yillikni tanlash',
    yearFormat: 'YYYY',
    dateFormat: 'DD.MM.YYYY',
    dayFormat: 'DD',
    dateTimeFormat: 'DD.MM.YYYY HH:mm:ss',
    monthFormat: 'MMMM',
    monthBeforeYear: true,
    previousMonth: 'Oldingi oy',
    nextMonth: 'Keyingi oy',
    previousYear: 'Oldingi yil',
    nextYear: 'Keyingi yil',
    previousDecade: 'Oldingi o‘n yillik',
    nextDecade: 'Keyingi o‘n yillik',
    previousCentury: 'Oldingi asr',
    nextCentury: 'Keyingi asr',
  },
  timePickerLocale: {
    placeholder: 'Vaqtni tanlash',
  },
};



interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  picker?: "date" | "week" | "month" | "quarter" | "year";
}

export const DatePicker: React.FC<DatePickerProps> = ({
  selected,
  onSelect,
  placeholder = "Select date",
  className = "",
  picker = "date",
}) => {
  const locale = useLocale();

  const [value, setValue] = useState<Dayjs | null>(selected ? dayjs(selected) : null);

  useEffect(() => {
    setValue(selected ? dayjs(selected) : null);
  }, [selected]);

  const handleChange = (date: Dayjs | null) => {
    setValue(date);
    onSelect(date ? date.toDate() : undefined);
  };

  const antLocaleMap: Record<string, any> = {
    en: enUS,
    ru: ruRU,
    uz: uzUZ,
  };

  return (
    <div className={`relative ${className}`}>
      <AntDatePicker
        value={value} // ✅ value must be Dayjs | null
        picker={picker} // ✅ picker now available here
        onChange={handleChange}
        placeholder={placeholder}
        allowClear
        suffixIcon={<CalendarOutlined className="text-gray-500" />}
        locale={antLocaleMap[locale]}
        style={{
          width: "100%",
          borderRadius: "9999px", // Full rounded
          backgroundColor: "#eff6ff", // Matches Select bg
          padding: "6px 16px", // Matches Select padding
        }}
        className="w-full text-sm text-gray-700 border-default"
      />
    </div>
  );
};
