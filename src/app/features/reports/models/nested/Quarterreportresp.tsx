import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsString, IsNumber, IsBoolean } from "class-validator";
import { useTranslations } from "next-intl";

export class Quarterreportresp {
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

  static get getColumns(): TableColumn<Quarterreportresp>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();

    const columns: TableColumn<Quarterreportresp>[] = [
      {
        title: t("Reports.position"),
        dataIndex: "title",
      },
      {
        title: "",
        dataIndex: "value",
      },
    ];

    return columns;
  }
}
