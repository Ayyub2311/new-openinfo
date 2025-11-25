import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber, IsBoolean } from "class-validator";
import { useTranslations } from "next-intl";

export class MicroQuarterFinancialResultsResp {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  tnum: string;

  @IsString()
  value1: string;

  @IsString()
  value2: string;

  @IsString()
  value3: string;

  @IsString()
  value4: string;

  @IsBoolean()
  is_title: boolean;

  static get getColumns(): TableColumn<MicroQuarterFinancialResultsResp>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();

    return [
      {
        title: t("Reports.indicator_name"),
        dataIndex: "title",
        className: "font-bold",
      },
      {
        title: t("Reports.row_code"),
        dataIndex: "tnum",
        align: "center",
      },
      {
        title: t("Reports.previous_period"),
        dataIndex: "id",
        colSpan: 2,
        children: [
          {
            title: t("Reports.income_previous"),
            dataIndex: "value",
            align: "right",
          },
        ],
      },
    ];
  }
}
