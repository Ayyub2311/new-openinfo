import { formatNumber } from "@/app/shared/format-number/formatNumber";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber, IsBoolean } from "class-validator";

export class QuarterFinancialResultsBankResp {
  @IsNumber()
  id: number;

  @IsString()
  title_id: string;

  @IsString()
  title: string;

  @IsString()
  value: string;

  @IsString()
  status: string;

  @IsBoolean()
  is_title: boolean;

  @IsBoolean()
  is_highlight: boolean;

  @IsNumber()
  main_report: number;

  static get getColumns(): TableColumn<QuarterFinancialResultsBankResp>[] {
    return [
      {
        dataIndex: "title",
        className: "font-bold",
      },

      {
        title: "",
        dataIndex: "value",
        align: "center",
        render: formatNumber,
      },
    ];
  }
}
