import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factslistoflegal {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsString()
  ownership: string;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factslistoflegal>[] {
    const columns: TableColumn<Factslistoflegal>[] = [
      {
        title: "Полное наименование",
        dataIndex: "all_name",
      },
      {
        title: "Местонахождение (почтовый адрес)",

        dataIndex: "position",
      },

      {
        title: "Доля владения (%):",
        dataIndex: "ownership",
      },
    ];

    return columns;
  }
}
