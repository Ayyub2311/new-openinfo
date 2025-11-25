import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factslistaffiliate {
  @IsNumber()
  id: number;

  @IsString()
  basis_name: string;

  @IsNumber()
  num: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsString()
  date_ground: string;

  @IsNumber()
  main: number;

  @IsNumber()
  basis: number;

  static get getColumns(): TableColumn<Factslistaffiliate>[] {
    const columns: TableColumn<Factslistaffiliate>[] = [
      {
        title: "СПИСОК АФФИЛИРОВАННЫХ ЛИЦ",
        align: "center",
        colSpan: 4,
        children: [
          {
            title: "Ф.И.О. физического лица или полное наименование юридического лица",
            align: "center",
            dataIndex: "all_name",
          },
          {
            title:
              "Местонахождение (место жительство) (почтовый адрес) аффилированного лица (государство, область, город, район)",
            align: "center",
            dataIndex: "position",
          },
          {
            title: "Основание, по которому они признаются аффилированными лицами",
            align: "center",
            dataIndex: "basis_name",
          },
          {
            title: "Дата наступления оснований",
            align: "center",
            dataIndex: "date_ground",
          },
        ],
      },
    ];

    return columns;
  }
}
