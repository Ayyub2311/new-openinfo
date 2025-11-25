import { Button } from "@/app/shared/ui/components/Button";
import { Text } from "@/app/shared/ui/components/Typography/Text";
import Image from "next/image";
import React from "react";

interface BrokerData {
  name: string;
  count: number;
  amount: number;
  webLink: string;
  logoUrl: string;
}

const BrokerCatalog: React.FC = () => {
  const brokerData: BrokerData[] = [
    {
      name: 'OOO "DALAL STANDARD"',
      logoUrl: "./assets/sidebar-icons/news.svg",
      count: 43471,
      amount: 59074557521,
      webLink: "ВЕБ-САЙТ »",
    },
    {
      name: 'OOO "Alp omad invest"',
      count: 4876,
      logoUrl: "./assets/sidebar-icons/news.svg",
      amount: 1484910000000,
      webLink: "ВЕБ-САЙТ >",
    },
    {
      name: 'OOO "ТашИнвестКом"',
      count: 6768,
      logoUrl: "./assets/sidebar-icons/news.svg",
      amount: 14378275056,
      webLink: "ВЕБ-САЙТ >",
    },
    {
      name: 'OOO "Leader Finance"',
      count: 371,
      logoUrl: "./assets/sidebar-icons/news.svg",
      amount: 716168971.9,
      webLink: "ВЕБ-САЙТ »",
    },
  ];

  return (
    <div className="broker-catalog">
      <h1>Каталог брокеров</h1>
      {brokerData.map((broker, index) => (
        <div key={index} className="py-2">
          <div className="grid grid-cols-5 gap-2 items-center">
            <div className="col-span-1">
              <Image src={broker.logoUrl} width={55} height={55} alt="logo" />
            </div>
            <div className="col-span-4 mb-2">
              <Text className="font-semibold mb-1">{broker.name}</Text>
              <Text className="text-sm mb-1">Кол-во: {broker.count}</Text>
              <Text className="text-sm mb-1">Сумма: {broker.amount.toLocaleString()} сум</Text>
            </div>
          </div>

          <Button
            className="bg-blue-400 w-full text-center block"
            onClick={() => window.open(broker.webLink, "_blank")}
          >
            ВЕБ-САЙТ »
          </Button>
        </div>
      ))}
    </div>
  );
};

export default BrokerCatalog;
