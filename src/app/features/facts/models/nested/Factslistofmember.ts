import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factslistofmember {
  @IsNumber()
  id: number;

  @IsNumber()
  num: number;

  @IsString()
  all_name: string;

  @IsNumber()
  ownership_num: number;

  @IsString()
  ownership_pro: string;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factslistofmember>[] {
    const columns: TableColumn<Factslistofmember>[] = [
      {
        title: "Ф.И.О. члена наблюдательного совета, у которого произошли изменения во владении акциями эмитента:",
        dataIndex: "all_name",
        align: "center",
      },
      {
        title: "Доля владения (количество):",
        align: "center",
        dataIndex: "ownership_num",
      },
      {
        title: "Доля владения (%):",
        align: "center",
        dataIndex: "ownership_pro",
      },
    ];

    return columns;
  }
}
