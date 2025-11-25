import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber } from "class-validator";

export class Factsinformationabout {
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

  static get getColumns(): TableColumn<Factsinformationabout>[] {
    const columns: TableColumn<Factsinformationabout>[] = [
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
