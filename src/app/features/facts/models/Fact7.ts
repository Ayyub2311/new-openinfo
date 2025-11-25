import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact7 extends FactBase {
  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsString()
  description_changes: string;

  @IsString()
  date_registration: string;

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
        title: this.t("Facts.fact7.title"),
        items: [
          { label: this.t("Facts.fact7.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact7.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact7.bodyDecidedTitle"), value: this.body_decided },
          { label: this.t("Facts.fact7.decisionDateTitle"), value: this.formatDate(this.decision_date) },
          { label: this.t("Facts.fact7.descriptionChangesTitle"), value: this.description_changes },
          { label: this.t("Facts.fact7.dateRegistrationTitle"), value: this.formatDate(this.date_registration) },
        ],
      },
    };
  }
}
