import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact29 extends FactBase {
  @IsNumber()
  paper_type: number;

  @IsNumber()
  paper_num: number;

  @IsNumber()
  nominal_paper_cost: number;

  @IsString()
  date_registration: string;

  @IsString()
  num_registration: string;

  @IsNumber()
  who_declared_invalid: number;

  @IsString()
  suspension_reason: string;

  @IsString()
  date_recognition: string;

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
        title: this.t("Facts.fact29.title"),
        items: [
          { label: this.t("Facts.fact29.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact29.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact29.paper_type"), value: converter.getSecurityTypes(this.paper_type) },
          { label: this.t("Facts.fact29.paper_num"), value: this.paper_num },
          { label: this.t("Facts.fact29.nominal_paper_cost"), value: this.nominal_paper_cost },
          { label: this.t("Facts.fact29.date_registration"), value: this.date_registration },
          { label: this.t("Facts.fact29.num_registration"), value: this.num_registration },
          {
            label: this.t("Facts.fact29.who_declared_invalid"),
            value: converter.getReorganizationMethod(this.who_declared_invalid),
          },
          { label: this.t("Facts.fact29.suspension_reason"), value: this.suspension_reason },
          { label: this.t("Facts.fact29.date_recognition"), value: this.date_recognition },
        ],
      },
    };
  }
}
