import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact45 extends FactBase {
  @IsString()
  shareholder_fullname: string;

  @IsString()
  shareholder_email: string;

  @IsString()
  securities_type: string;

  @IsString()
  securites_nominal_price: string;

  @IsString()
  reasons_for_buy: string;

  @IsString()
  sollution_approval_date: string;

  @IsString()
  redemption_price: string;

  @IsString()
  redemption_start_date: string;

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
        title: this.t("Facts.fact45.title"),
        items: [
          { label: this.t("Facts.fact45.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact45.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact45.shareholderFullnameTitle"), value: this.shareholder_fullname },
          { label: this.t("Facts.fact45.shareholderEmailTitle"), value: this.shareholder_email },
          { label: this.t("Facts.fact45.securitiesTypeTitle"), value: this.securities_type },
          { label: this.t("Facts.fact45.securitiesNominalPriceTitle"), value: this.securites_nominal_price },
          { label: this.t("Facts.fact45.reasonsForBuyTitle"), value: this.reasons_for_buy },
          {
            label: this.t("Facts.fact45.solutionApprovalDateTitle"),
            value: this.sollution_approval_date?.split("-").reverse().join("."),
          },
          { label: this.t("Facts.fact45.redemptionPriceTitle"), value: this.redemption_price },
          {
            label: this.t("Facts.fact45.redemptionStartDateTitle"),
            value: this.redemption_start_date?.split("-").reverse().join("."),
          },
        ],
      },
    };
  }
}
