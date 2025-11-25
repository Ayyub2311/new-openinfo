import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factsinformationchange {
  @IsNumber()
  id: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsNumber()
  type_change: number;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factsinformationchange>[] {
    const columns: TableColumn<Factsinformationchange>[] = [
      {
        title: "Название филиала",
        dataIndex: "all_name",
      },
      {
        title: "Адрес филиала",
        dataIndex: "position",
      },
      {
        title: "Тип изменения",
        dataIndex: "type_change",
      },
    ];
    return columns;
  }
}
