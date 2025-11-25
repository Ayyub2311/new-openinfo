import { CalendarOutlined } from "@ant-design/icons";
import { DatePicker as AntDatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import React, { useEffect, useState } from "react";

interface DatePickerProps {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
  picker?: "date" | "week" | "month" | "quarter" | "year";
}

export const DatePicker = ({
  selected,
  onSelect,
  placeholder = "Select date",
  className = "",
  picker = "date", // ✅ Added picker to destructuring with default
}: DatePickerProps) => {
  const [value, setValue] = useState<Dayjs | null>(selected ? dayjs(selected) : null);

  useEffect(() => {
    setValue(selected ? dayjs(selected) : null);
  }, [selected]);

  const handleChange = (date: Dayjs | null) => {
    setValue(date);
    onSelect(date ? date.toDate() : undefined);
  };

  return (
    <div className={`relative ${className} min-w-[200px]`}>
      <AntDatePicker
        value={value} // ✅ value must be Dayjs | null
        picker={picker} // ✅ picker now available here
        onChange={handleChange}
        placeholder={placeholder}
        allowClear
        suffixIcon={<CalendarOutlined className="text-gray-500" />}
        style={{
          width: "100%",
          borderRadius: "9999px", // Full rounded
          backgroundColor: "#eff6ff", // Matches Select bg
          padding: "6px 16px", // Matches Select padding
        }}
        className="w-full text-sm text-gray-700"
      />
    </div>
  );
};
