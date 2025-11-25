import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact1 extends FactBase {
  @IsString()
  full_name_before_change: string;

  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsString()
  date_of_changes_registration: string;

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
        title: this.t("Facts.fact1.title"),
        items: [
          { label: this.t("Facts.fact1.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact1.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact1.fullNameBeforeChangeTitle"), value: this.full_name_before_change },
          { label: this.t("Facts.fact1.bodyDecidedTitle"), value: this.body_decided },
          { label: this.t("Facts.fact1.decisionDateTitle"), value: this.formatDate(this.decision_date) },
          {
            label: this.t("Facts.fact1.dateOfChangesRegistrationTitle"),
            value: this.formatDate(this.date_of_changes_registration),
          },
        ],
      },
    };
  }
}
