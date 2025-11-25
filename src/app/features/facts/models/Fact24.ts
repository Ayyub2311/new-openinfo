import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact24 extends FactBase {
  @IsString()
  type_activity: string;

  @IsString()
  date_issue: string;

  @IsNumber()
  license_number: number;

  @IsString()
  name_of_organ: string;

  @IsString()
  revocation_reason: string;

  @IsString()
  revocation_organ: string;

  @IsString()
  date_decision_cancellation: string;

  @IsString()
  date_receipt_annul: string;

  @IsString()
  for_period: string;

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
        title: this.t("Facts.fact24.title"),
        items: [
          { label: this.t("Facts.fact24.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact24.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact24.type_activity"), value: this.type_activity },
          { label: this.t("Facts.fact24.date_issue"), value: this.date_issue },
          { label: this.t("Facts.fact24.license_number"), value: this.license_number },
          { label: this.t("Facts.fact24.name_of_organ"), value: this.name_of_organ },
          { label: this.t("Facts.fact24.revocation_reason"), value: this.revocation_reason },
          { label: this.t("Facts.fact24.revocation_organ"), value: this.revocation_organ },
          { label: this.t("Facts.fact24.date_decision_cancellation"), value: this.date_decision_cancellation },
          { label: this.t("Facts.fact24.date_receipt_annul"), value: this.date_receipt_annul },
          { label: this.t("Facts.fact24.for_period"), value: this.for_period },
        ],
      },
    };
  }
}
