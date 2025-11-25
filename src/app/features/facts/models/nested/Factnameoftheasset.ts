import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber } from "class-validator";

export class Factnameoftheasset {
  @IsNumber()
  id: number;

  @IsString()
  akt_name: string;

  @IsString()
  pub_date: string;

  @IsNumber()
  sum: number;

  @IsNumber()
  prosent: number;

  static get getColumns(): TableColumn<Factnameoftheasset>[] {
    const columns: TableColumn<Factnameoftheasset>[] = [
      {
        title: "Наименование актива",
        dataIndex: "akt_name",
      },
      {
        title: "Дата увеличения актива",
        dataIndex: "pub_date",
      },
      {
        title: "Сумма (тыс. сум .)",
        dataIndex: "sum",
      },
      {
        title: "Процент",
        dataIndex: "prosent",
      },
    ];

    return columns;
  }
}
