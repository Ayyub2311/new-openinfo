import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsNumber, IsString } from "class-validator";
import { useTranslations } from "next-intl";

export class PersonnelChangeReportResp {
  @IsNumber()
  id: number;

  @IsNumber()
  main_report: number;

  @IsString()
  change_date: string;

  @IsString()
  personnel_name: string;

  @IsString()
  personnel_responsibility: string;

  @IsString()
  auth_body: string;

  @IsString()
  chg_result: string;

  static get getColumns(): TableColumn<PersonnelChangeReportResp>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();
    return [
      {
        title: t("PersonnelChangeReport.decision_date"),
        dataIndex: "change_date",
        align: "center",
      },
      {
        title: t("PersonnelChangeReport.start_duty_date"),
        dataIndex: "start_date",
        align: "center",
      },
      {
        title: t("PersonnelChangeReport.full_name"),
        dataIndex: "personnel_name",
        className: "font-bold",
      },
      {
        title: t("PersonnelChangeReport.position"),
        dataIndex: "personnel_responsibility",
      },
      {
        title: t("PersonnelChangeReport.authority"),
        dataIndex: "auth_body",
      },
      {
        title: t("PersonnelChangeReport.result"),
        dataIndex: "chg_result",
        render: (value: string) => (value === "1" ? "Избран (назначен)" : "выведен из состава (уволен)"),
      },
    ];
  }
}
