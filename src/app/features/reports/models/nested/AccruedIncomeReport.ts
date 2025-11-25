import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsBoolean, IsNumber, IsString } from "class-validator";

export class AccruedIncomeReportResp {
  @IsNumber()
  id: number;

  @IsNumber()
  title_id: number;

  @IsString()
  title: string;

  @IsString()
  value: string;

  @IsBoolean()
  is_title: boolean;

  @IsBoolean()
  is_highlight: boolean;

  @IsNumber()
  main_report: number;

  static get getColumns(): TableColumn<AccruedIncomeReportResp>[] {
    const columns: TableColumn<AccruedIncomeReportResp>[] = [
      {
        dataIndex: "title",
      },
      {
        dataIndex: "value",
      },
    ];

    return columns;
  }
}
