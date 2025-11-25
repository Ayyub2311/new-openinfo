import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact39 extends FactBase {
  @IsString()
  decision_date: string;

  @IsString()
  date_registration: string;

  @IsString()
  foreign_cap_markets: string;

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
        title: this.t("Facts.fact39.title"),
        items: [
          { label: this.t("Facts.fact39.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact39.factTitleTitle"), value: this.fact_title },
          {
            label: this.t("Facts.fact39.decisionDateTitle"),
            value: this.decision_date?.split("-").reverse().join("."),
          },
          {
            label: this.t("Facts.fact39.dateRegistrationTitle"),
            value: this.date_registration?.split("-").reverse().join("."),
          },
          { label: this.t("Facts.fact39.foreignCapMarketsTitle"), value: this.foreign_cap_markets },
        ],
      },
    };
  }
}
