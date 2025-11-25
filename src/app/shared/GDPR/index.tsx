import { Check, Languages, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/app/shared/checkbox";

interface GDPRConsentProps {
  onAccept: (accepted: boolean) => void;
  initiallyAccepted?: boolean;
}

export const GDPRConsent = ({ onAccept, initiallyAccepted = false }: GDPRConsentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState("ru");
  const [accepted, setAccepted] = useState(initiallyAccepted);

  const toggleAccordion = () => setIsOpen(!isOpen);
  const toggleLanguage = () => {
    setLanguage(prev => (prev === "ru" ? "uz" : prev === "uz" ? "en" : "ru"));
  };

  const translations = {
    ru: {
      title: "Пользовательское соглашение",
      intro: "Перед началом использования сайта, пожалуйста, ознакомьтесь с условиями пользовательского соглашения.",
      sections: [
        "Общие положения",
        "Регистрация на сайте",
        "Персональные данные",
        "Права и обязанности",
        "Интеллектуальная собственность",
        "Ответственность сторон",
      ],
      button: "Принять условия",
      accepted: "Соглашение принято",
    },
    en: {
      title: "User Agreement",
      intro: "Before using the website, please review the terms of the user agreement.",
      sections: [
        "General Provisions",
        "Site Registration",
        "Personal Data",
        "Rights and Obligations",
        "Intellectual Property",
        "Liability",
      ],
      button: "Accept terms",
      accepted: "Agreement accepted",
    },
    uz: {
      title: "Foydalanuvchi shartnomasi",
      intro: "Saytdan foydalanishdan oldin, foydalanuvchi shartnomasi shartlarini ko'rib chiqing.",
      sections: [
        "Umumiy qoidalar",
        "Saytda ro'yxatdan o'tish",
        "Shaxsiy ma'lumotlar",
        "Huquq va majburiyatlar",
        "Intellektual mulk",
        "Javobgarlik",
      ],
      button: "Shartlarni qabul qilish",
      accepted: "Shartnoma qabul qilindi",
    },
  };

  const handleAccept = (checked: boolean) => {
    setAccepted(checked);
    onAccept(checked);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium text-gray-900">{translations[language].title}</h3>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs"
        >
          <Languages size={14} />
          <span className="uppercase">{language}</span>
        </button>
      </div>

      <p className="text-sm text-gray-700 mb-3">{translations[language].intro}</p>

      <button
        onClick={toggleAccordion}
        className="w-full flex justify-between items-center p-2 bg-white rounded-md border border-gray-200 hover:bg-gray-50 text-sm"
      >
        <span className="text-gray-700">
          {translations[language].sections.length}{" "}
          {language === "en" ? "sections" : language === "ru" ? "разделов" : "bo'limlar"}
        </span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-white rounded-md border border-gray-200">
          <ul className="space-y-2">
            {translations[language].sections.map((section, index) => (
              <li key={index} className="flex items-start text-sm">
                <div className="flex-shrink-0 mt-1.5 mr-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-gray-400"></div>
                </div>
                <span className="text-gray-700">{section}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center">
          <Checkbox id="gdpr-consent" checked={accepted} onCheckedChange={handleAccept} className="h-4 w-4" />
          <label htmlFor="gdpr-consent" className="ml-2 text-sm text-gray-700">
            {language === "en"
              ? "I accept the terms"
              : language === "ru"
                ? "Я принимаю условия"
                : "Men shartlarni qabul qilaman"}
          </label>
        </div>

        {accepted && (
          <div className="flex items-center gap-1 text-sm text-green-600">
            <Check size={16} />
            <span>{translations[language].accepted}</span>
          </div>
        )}
      </div>
    </div>
  );
};
