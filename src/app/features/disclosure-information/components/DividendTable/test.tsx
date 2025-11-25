import { Table } from "@/app/shared/ui/components/Table";
import { Text } from "@/app/shared/ui/components/Typography/Text/Text";

export const DividendTable = () => {
  return (
    <div>
      <Table
        bordered={false}
        columns={[
          {
            title: "Дата",
            dataIndex: "date",
            key: "date",
            render: (v: string) => {
              return <Text weight="bold">{v}</Text>;
            },
          },
          {
            title: "Сумма",
            dataIndex: "summa",
            key: "summa",
          },
          {
            title: "Доходность",
            dataIndex: "income",
            key: "income",
            align: "right",
          },
        ]}
        data={[
          {
            key: "1",
            date: "2024-01-15",
            summa: "₽125.50",
            income: "4.2%",
          },
          {
            key: "2",
            date: "2024-02-15",
            summa: "₽130.75",
            income: "4.3%",
          },
          {
            key: "3",
            date: "2024-03-15",
            summa: "₽128.90",
            income: "4.1%",
          },
          {
            key: "4",
            date: "2024-04-15",
            summa: "₽132.25",
            income: "4.4%",
          },
          {
            key: "5",
            date: "2024-05-15",
            summa: "₽135.00",
            income: "4.5%",
          },
          {
            key: "2",
            date: "2024-02-15",
            summa: "₽130.75",
            income: "4.3%",
          },
          {
            key: "3",
            date: "2024-03-15",
            summa: "₽128.90",
            income: "4.1%",
          },
          {
            key: "4",
            date: "2024-04-15",
            summa: "₽132.25",
            income: "4.4%",
          },
          {
            key: "5",
            date: "2024-05-15",
            summa: "₽135.00",
            income: "4.5%",
          },
        ]}
      />
    </div>
  );
};
