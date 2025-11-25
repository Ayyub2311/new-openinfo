import { IsNumber, IsString } from "class-validator";
import { TableColumn } from "@/app/shared/ui/components/Table/types";

export class Factsshareinauthorized {
  @IsNumber()
  id: number;

  @IsNumber()
  to_change_num: number;

  @IsString()
  to_change_pro: string;

  @IsNumber()
  after_change_num: number;

  @IsString()
  after_change_pro: string;

  @IsNumber()
  main: number;

  static get getColumns(): TableColumn<Factsshareinauthorized>[] {
    const columns: TableColumn<Factsshareinauthorized>[] = [
      {
        title: "Доля в уставном фонде эмитента члена наблюдательного совета",
        colSpan: 4,
        align: "center",
        children: [
          {
            title: "До изменения:",
            colSpan: 2,
            align: "center",
            children: [
              {
                title: "кол-во",
                align: "center",
                dataIndex: "to_change_num",
              },
              {
                title: "%%",
                align: "center",
                dataIndex: "to_change_pro",
              },
            ],
          },
          {
            title: "После изменения:",
            colSpan: 2,
            align: "center",
            children: [
              {
                title: "кол-во",
                align: "center",
                dataIndex: "after_change_num",
              },
              {
                title: "%%",
                align: "center",
                dataIndex: "after_change_pro",
              },
            ],
          },
        ],
      },
    ];

    return columns;
  }
}
