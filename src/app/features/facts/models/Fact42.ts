import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact42 extends FactBase {
  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsString()
  payment_start_date: string;

  @IsString()
  payment_end_date: string;

  @IsString()
  overall_calculated_sum: string;

  @IsString()
  overall_calculated_percent: string;

  @IsString()
  overall_paid_sum: string;

  @IsString()
  overall_paid_percent: string;

  @IsString()
  overall_debt_sum: string;

  @IsString()
  overall_debt_percent: string;

  @IsString()
  non_payment_explanation: string;

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
        title: this.t("Facts.fact42.title"),
        items: [
          { label: this.t("Facts.fact42.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact42.factTitleTitle"), value: this.fact_title },
        ],
      },
    };
  }
}
