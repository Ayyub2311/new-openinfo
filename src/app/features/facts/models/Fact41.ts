import { IsString, IsOptional } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact41 extends FactBase {
  @IsString()
  decision_date: string;

  @IsString()
  description_changes: string;

  @IsString()
  supervisory_board_proposal: string;

  @IsString()
  supervisory_board_protocol: string;

  @IsOptional()
  distrubution_offer_date: string;

  @IsString()
  distrubution_share_sums: string;

  @IsString()
  par_value_percent: string;

  @IsString()
  dividend_share_sums: string;

  @IsString()
  dividend_share_percent: string;

  @IsString()
  each_security_price: string;

  @IsString()
  each_security_nominal_percent: string;

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
        title: this.t("Facts.fact41.title"),
        items: [
          { label: this.t("Facts.fact41.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact41.factTitleTitle"), value: this.fact_title },
        ],
      },
    };
  }
}
