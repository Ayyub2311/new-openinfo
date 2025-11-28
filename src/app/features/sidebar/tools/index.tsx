import React from "react";

const CalendarMenu: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="text-lg bg-blue-400 px-1 rounded-xl font-medium mb-4">Календари</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className=" hover:underline">
            Экономический Календарь
          </a>
        </li>
        <li>
          <a href="#" className=" hover:underline">
            Календарь Отчетности
          </a>
        </li>
        <li>
          <a href="#" className=" hover:underline">
            Календарь Праздников
          </a>
        </li>
      </ul>
    </div>
  );
};

const EconomicsUZB: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="text-lg bg-blue-400 px-1 rounded-xl font-medium mb-4">Экономика УЗБ</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className=" hover:underline">
            Инструмент отслеживания ставки ФРС
          </a>
        </li>
        <li>
          <a href="#" className=" hover:underline">
            Кривая доходности казначейских облигаций США
          </a>
        </li>
      </ul>
    </div>
  );
};

const MoreTools: React.FC = () => {
  return (
    <div className="py-4">
      <h2 className="text-lg bg-blue-400 px-1 rounded-xl font-medium mb-4">Больше Инструментов</h2>
      <ul className="space-y-2">
        <li>
          <a href="#" className=" hover:underline">
            Фильтр Акций
          </a>
        </li>
        <li>
          <a href="#" className=" hover:underline">
            Конвертер Валют
          </a>
        </li>
      </ul>
    </div>
  );
};

const ToolsContainer: React.FC = () => {
  return (
    <div className="font-sans p-8 gap-8">
      <CalendarMenu />
      <EconomicsUZB />
      <MoreTools />
    </div>
  );
};

export default ToolsContainer;
