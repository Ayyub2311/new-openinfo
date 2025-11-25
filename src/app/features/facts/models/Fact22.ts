import { IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";

export class Fact22 extends FactBase {
  @IsString()
  type_activity: string;

  @IsString()
  name_of_organ: string;

  @IsString()
  date_decision: string;

  @IsString()
  date_licensing: string;

  @IsString()
  number_licensing: string;

  @IsString()
  date_receipt: string;

  @IsString()
  validity_license: string;

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
        title: this.t("Facts.fact22.title"),
        items: [
          { label: this.t("Facts.fact22.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact22.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact22.type_activity"), value: this.type_activity },
          { label: this.t("Facts.fact22.name_of_organ"), value: this.name_of_organ },
          { label: this.t("Facts.fact22.date_decision"), value: this.date_decision },
          { label: this.t("Facts.fact22.date_licensing"), value: this.date_licensing },
          { label: this.t("Facts.fact22.number_licensing"), value: this.number_licensing },
          { label: this.t("Facts.fact22.date_receipt"), value: this.date_receipt },
          { label: this.t("Facts.fact22.validity_license"), value: this.validity_license },
        ],
      },
    };
  }
}
