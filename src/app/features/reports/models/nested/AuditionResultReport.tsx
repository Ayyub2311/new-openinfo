import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsNumber, IsString, IsOptional } from "class-validator";
import { useTranslations } from "next-intl";
import Link from "next/link";

export class AuditionResultReport {
  @IsNumber()
  id: number;

  @IsString()
  org_name: string;

  @IsString()
  license_date: string;

  @IsOptional()
  @IsString()
  license_number?: string | null;

  @IsString()
  conclusion_type: string;

  @IsString()
  conclusion_date: string;

  @IsNumber()
  conclusion_number: number;

  @IsString()
  auditor_name: string;

  @IsString()
  conclusion_file: string;

  static get getColumns(): TableColumn<AuditionResultReport>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();

    return [
      {
        title: t("AuditionResultReport.org_name"),
        dataIndex: "org_name",
      },
      {
        title: t("AuditionResultReport.license_date"),
        dataIndex: "license_date",
      },
      {
        title: t("AuditionResultReport.license_number"),
        dataIndex: "license_number",
      },
      {
        title: t("AuditionResultReport.conclusion_type"),
        dataIndex: "conclusion_type",
      },
      {
        title: t("AuditionResultReport.conclusion_date"),
        dataIndex: "conclusion_date",
      },
      {
        title: t("AuditionResultReport.conclusion_number"),
        dataIndex: "conclusion_number",
      },
      {
        title: t("AuditionResultReport.auditor_name"),
        dataIndex: "auditor_name",
      },
      {
        title: t("AuditionResultReport.conclusion_file"),
        dataIndex: "conclusion_file",
        render: (value: string) => (
          <Link href={`https://openinfo.uz/media/${value}`} target="_blank" rel="noopener noreferrer">
            {t("AuditionResultReport.download_pdf")}
          </Link>
        ),
      },
    ];
  }
}
