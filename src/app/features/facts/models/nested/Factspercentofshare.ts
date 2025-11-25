import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factspercentofshare {
  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsNumber()
  type_change: number;

  static get getColumns(): TableColumn<Factspercentofshare>[] {
    const columns: TableColumn<Factspercentofshare>[] = [
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
