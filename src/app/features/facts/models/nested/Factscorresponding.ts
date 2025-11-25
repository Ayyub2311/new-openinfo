import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factscorresponding {
  @IsNumber()
  id: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsString()
  type_change: string;

  @IsString()
  view_paper: string;

  @IsNumber()
  type_events: number;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factscorresponding>[] {
    const columns: TableColumn<Factscorresponding>[] = [
      {
        title: "Ф.И.О. физического лица или полное наименование юридического лица",
        dataIndex: "all_name",
        align: "center",
      },
      {
        title:
          "Местонахождение (место жительство) (почтовый адрес) аффилированного лица (государство, область, город, район)",
        align: "center",
        dataIndex: "position",
      },
      {
        title: "Количества ценных бумаг (размер доли, паев)",
        align: "center",
        dataIndex: "type_change",
      },
      {
        title: "Вид ценных бумаг",
        align: "center",
        dataIndex: "view_paper",
      },
      {
        title: "Тип события",
        align: "center",
        dataIndex: "type_events",
      },
    ];

    return columns;
  }
}
