import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factslistsubsidiarie {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsNumber()
  type_change: number;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factslistsubsidiarie>[] {
    const columns: TableColumn<Factslistsubsidiarie>[] = [
      {
        title: "Полное наименование",
        dataIndex: "all_name",
      },
      {
        title: "Местонахождение (почтовый адрес)",
        dataIndex: "position",
      },
      {
        title: "Доля владения (в %)",
        dataIndex: "type_change",
      },
    ];
    return columns;
  }
}
