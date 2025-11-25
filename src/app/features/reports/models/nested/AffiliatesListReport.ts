import { TableColumn } from "@/app/shared/ui/components/Table/types";
import { IsNumber, IsString } from "class-validator";
import { useTranslations } from "next-intl";

export class AffiliatesListReport {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  location: string;

  @IsString()
  lg_basis: string;

  @IsString()
  lg_basis_date: string;

  static get getColumns(): TableColumn<AffiliatesListReport>[] {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const t = useTranslations();
    return [
      {
        title: t("AffiliatesListReport.full_name"),
        dataIndex: "name",
      },
      {
        title: t("AffiliatesListReport.location"),
        dataIndex: "location",
      },
      {
        title: t("AffiliatesListReport.legal_basis"),
        dataIndex: "lg_basis",
      },
      {
        title: t("AffiliatesListReport.legal_basis_date"),
        dataIndex: "lg_basis_date",
      },
    ];
  }
}
