import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact5 extends FactBase {
  @IsString()
  body_decided: string;

  @IsString()
  decision_date: string;

  @IsString()
  drawing_date: string;

  @IsString()
  suspension_date: string;

  @IsString()
  decided_suspend: string;

  @IsString()
  date_of_reorganization: string;

  @IsString()
  decided_termination: string;

  @IsString()
  date_termination: string;

  @IsString()
  term_of_request: string;

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
        title: this.t("Facts.fact5.title"),
        items: [
          { label: this.t("Facts.fact5.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact5.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact5.bodyDecidedTitle"), value: this.body_decided },
          { label: this.t("Facts.fact5.decisionDateTitle"), value: this.formatDate(this.decision_date) },
          { label: this.t("Facts.fact5.drawingDateTitle"), value: this.formatDate(this.drawing_date) },
          { label: this.t("Facts.fact5.dateTerminationTitle"), value: this.formatDate(this.date_termination) },
          { label: this.t("Facts.fact5.decidedTerminationTitle"), value: this.decided_termination },
          {
            label: this.t("Facts.fact5.dateOfReorganizationTitle"),
            value: this.formatDate(this.date_of_reorganization),
          },
          { label: this.t("Facts.fact5.termOfRequestTitle"), value: this.formatDate(this.term_of_request) },
        ],
      },
    };
  }
}
