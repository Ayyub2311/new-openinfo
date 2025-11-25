import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factsinformationofabout {
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

  static get getColumns(): TableColumn<Factsinformationofabout>[] {
    const columns: TableColumn<Factsinformationofabout>[] = [
      {
        title: "Полное наименование",
        dataIndex: "all_name",
      },
      {
        title: "Местонахождение (почтовый адрес)",
        dataIndex: "position",
      },
      {
        title: "Вид изменения",
        dataIndex: "type_change",
      },
    ];
    return columns;
  }
}
