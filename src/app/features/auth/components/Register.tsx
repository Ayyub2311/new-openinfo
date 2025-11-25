import { GDPRConsent } from "@/app/shared/GDPR";
import { Button } from "@/app/shared/ui/components/Button";
import Card from "@/app/shared/ui/components/Card";
import Input from "@/app/shared/ui/components/Input";
import { Calendar as CalendarIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

interface RegistrationModalProps {
  onClose: () => void;
}

const DatePicker = ({
  selected,
  onSelect,
  placeholder = "Выберите дату",
}: {
  selected?: Date;
  onSelect: (date: Date | undefined) => void;
  placeholder?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selected) {
      setInputValue(formatDate(selected));
    } else {
      setInputValue("");
    }
  }, [selected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.valueAsDate;
    if (date) {
      onSelect(date);
      setIsOpen(false);
    } else {
      onSelect(undefined);
    }
  };

  return (
    <div className="relative" ref={datePickerRef}>
      <div className="relative">
        <input
          type="text"
          readOnly
          value={inputValue}
          onClick={() => setIsOpen(!isOpen)}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        />
        <CalendarIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-auto rounded-md border bg-popover p-2 shadow-md">
          <input
            type="date"
            onChange={handleDateChange}
            className="block w-full rounded-md border p-2 text-sm"
            value={selected?.toISOString().split("T")[0] || ""}
          />
        </div>
      )}
    </div>
  );
};

export default function RegistrationModal({ onClose }: RegistrationModalProps) {
  const [gender, setGender] = useState("М");
  const [resident, setResident] = useState("Резидент");
  const [dob, setDob] = useState<Date | undefined>();
  const [gdprAccepted, setGdprAccepted] = useState(false);

  return (
    <Card className="max-w-xl mx-auto mt-10 p-6 space-y-4">
      <div className="flex justify-end">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
          ×
        </button>
      </div>

      <div className="flex space-x-2">
        <Button variant="ghost" className="font-semibold border-b-2 border-black rounded-none">
          Регистрация физического лица
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">* ФИО</label>
          <Input placeholder="Введите ФИО" />
        </div>

        <div>
          <label className="block text-sm font-medium">* Дата рождения</label>
          <DatePicker selected={dob} onSelect={setDob} />
        </div>

        <div className="flex items-center space-x-4">
          <div>
            <p className="text-sm font-medium">Пол</p>
            <div className="flex space-x-2 mt-1">
              {["М", "Ж"].map(g => (
                <Button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  variant={gender === g ? "outline" : "filled"}
                >
                  {g}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium">Статус</p>
            <div className="flex space-x-2 mt-1">
              {["Резидент", "Не резидент"].map(s => (
                <Button
                  key={s}
                  type="button"
                  onClick={() => setResident(s)}
                  variant={resident === s ? "outline" : "filled"}
                >
                  {s}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">* Контактные данные</label>
          <Input placeholder="+998 --- -- --" />
        </div>

        <div>
          <label className="block text-sm font-medium">* Электронная почта</label>
          <Input type="email" placeholder="example@mail.com" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">* Пароль</label>
            <Input type="password" />
          </div>
          <div>
            <label className="block text-sm font-medium">* Подтвердить пароль</label>
            <Input type="password" />
          </div>
        </div>

        {/* GDPR Consent */}
        <GDPRConsent onAccept={setGdprAccepted} initiallyAccepted={gdprAccepted} />

        <div className="flex gap-4">
          <Button className="bg-green-500 hover:bg-green-600 w-full" disabled={!gdprAccepted}>
            Отправить
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Вернуться
          </Button>
        </div>
      </div>
    </Card>
  );
}
