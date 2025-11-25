import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact23 extends FactBase {
  @IsString()
  type_activity: string;

  @IsString()
  date_issue: string;

  @IsString()
  license_number: string;

  @IsString()
  name_of_organ: string;

  @IsString()
  revocation_reason: string;

  @IsNumber()
  revocation_organ: number;

  @IsString()
  date_decision_cancellation: string;

  @IsString()
  date_receipt_annul: string;

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
    const converter = new ConvertTypes();

    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact23.title"),
        items: [
          { label: this.t("Facts.fact23.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact23.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact23.type_activity"), value: this.type_activity },
          { label: this.t("Facts.fact23.date_issue"), value: this.date_issue },
          { label: this.t("Facts.fact23.license_number"), value: this.license_number },
          { label: this.t("Facts.fact23.name_of_organ"), value: this.name_of_organ },
          { label: this.t("Facts.fact23.revocation_reason"), value: this.revocation_reason },
          {
            label: this.t("Facts.fact23.revocation_organ"),
            value: converter.getRevocationOrganConverter(this.revocation_organ),
          },
          {
            label: this.t("Facts.fact23.date_decision_cancellation"),
            value: this.date_decision_cancellation,
          },
          {
            label: this.t("Facts.fact23.date_receipt_annul"),
            value: this.date_receipt_annul,
          },
        ],
      },
    };
  }
}
