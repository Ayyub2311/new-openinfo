import { IsString, IsNumber } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
export class Factslistbranch {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  all_name: string;

  @IsString()
  position: string;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factslistbranch>[] {
    const columns: TableColumn<Factslistbranch>[] = [
      {
        title: "Название филиала",
        dataIndex: "all_name",
      },
      {
        title: "Адрес филиала",
        dataIndex: "position",
      },
    ];
    return columns;
  }
}
