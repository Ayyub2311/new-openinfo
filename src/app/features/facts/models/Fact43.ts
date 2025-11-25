import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact43 extends FactBase {
  @IsString()
  shareholder_fullname: string;

  @IsString()
  shareholder_email: string;

  @IsString()
  shareholder_full_title: string;

  @IsString()
  transaction_date: string;

  @IsString()
  securities_amount: string;

  @IsString()
  securities_percent: string;

  @IsString()
  securities_overall: string;

  @IsString()
  notification_date: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact43.title"),
        items: [
          { label: this.t("Facts.fact43.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact43.factTitleTitle"), value: this.fact_title },
        ],
      },
    };
  }
}
