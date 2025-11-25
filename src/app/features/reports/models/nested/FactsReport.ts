import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsNumber, IsString } from "class-validator";
import { useTranslations } from "next-intl";

export class FactsReport {
  @IsNumber()
  id: number;

  @IsString()
  fact: string;

  @IsNumber()
  fact_number: number;

  @IsString()
  date: string;

  @IsString()
  misc: string;

  @IsNumber()
  main_report: number;

  static get getColumns(): TableColumn<FactsReport>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();
    return [
      {
        title: t("FactsReport.fact_name"),
        dataIndex: "fact",
      },
      {
        title: t("FactsReport.fact_number"),
        dataIndex: "fact_number",
      },
      {
        title: t("FactsReport.fact_date"),
        dataIndex: "date",
      },
      {
        title: t("FactsReport.publication_date"),
        dataIndex: "misc",
      },
    ];
  }
}
