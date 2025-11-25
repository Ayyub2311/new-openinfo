import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact37 extends FactBase {
  @IsString()
  stock_kind: string;

  @IsString()
  stock_type: string;

  @IsString()
  stocks_nominal_cost: string;

  @IsString()
  buyout_reason: string;

  @IsString()
  decision_date: string;

  @IsString()
  buyout_price: string;

  @IsString()
  buyout_start_date: string;

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
        title: this.t("Facts.fact37.title"),
        items: [
          { label: this.t("Facts.fact37.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact37.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact37.stockKindTitle"), value: this.stock_kind },
          { label: this.t("Facts.fact37.stockTypeTitle"), value: this.stock_type },
          { label: this.t("Facts.fact37.stocksNominalCostTitle"), value: this.stocks_nominal_cost },
          { label: this.t("Facts.fact37.buyoutReasonTitle"), value: this.buyout_reason },
          {
            label: this.t("Facts.fact37.decisionDateTitle"),
            value: this.decision_date?.split("-").reverse().join("."),
          },
          { label: this.t("Facts.fact37.buyoutPriceTitle"), value: this.buyout_price },
          {
            label: this.t("Facts.fact37.buyoutStartDateTitle"),
            value: this.buyout_start_date?.split("-").reverse().join("."),
          },
        ],
      },
    };
  }
}
