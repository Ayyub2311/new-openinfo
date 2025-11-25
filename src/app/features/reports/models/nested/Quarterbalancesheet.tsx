import { formatNumber } from "@/app/shared/format-number/formatNumber";
import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber, IsBoolean } from "class-validator";
import { useTranslations } from "next-intl";

export class QuarterBalanceSheetResp {
  @IsNumber()
  id: number;

  @IsNumber()
  title_id: number;

  @IsString()
  title: string;

  @IsString()
  tnum: string;

  @IsString()
  value1: string;

  @IsString()
  value2: string;

  @IsBoolean()
  is_title: boolean;

  @IsBoolean()
  is_highlight: boolean;

  @IsBoolean()
  is_automated: boolean;

  @IsNumber()
  main_report: number;

  static get getColumns(): TableColumn<QuarterBalanceSheetResp>[] {
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
        title: t("Reports.start_period"),
        dataIndex: "value1",
        align: "right",
        render: formatNumber,
      },
      {
        title: t("Reports.end_period"),
        dataIndex: "value2",
        align: "right",
        render: formatNumber,
      },
    ];
  }
}
