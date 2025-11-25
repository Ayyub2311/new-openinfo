import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact44 extends FactBase {
  @IsString()
  shareholder_fullname: string;

  @IsString()
  shareholder_email: string;

  @IsNumber()
  securities_amount: number;

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
        title: this.t("Facts.fact44.title"),
        items: [
          { label: this.t("Facts.fact44.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact44.factTitleTitle"), value: this.fact_title },
        ],
      },
    };
  }
}
