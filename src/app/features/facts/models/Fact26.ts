import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact26 extends FactBase {
  @IsNumber()
  organ: number;

  @IsString()
  date_decision: string;

  @IsNumber()
  paper_type: number;

  @IsNumber()
  paper_num: number;

  @IsString()
  nominal_paper_cost: string;

  @IsString()
  total_amount: string;

  @IsString()
  date_registration: string;

  @IsString()
  num_registration: string;

  @IsString()
  placement_method: string;

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
        title: this.t("Facts.fact26.title"),
        items: [
          { label: this.t("Facts.fact26.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact26.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact26.paper_type"), value: converter.getSecurityTypes(this.paper_type) },
          { label: this.t("Facts.fact26.paper_num"), value: this.paper_num },
          { label: this.t("Facts.fact26.nominal_paper_cost"), value: this.nominal_paper_cost },
          { label: this.t("Facts.fact26.total_amount"), value: this.total_amount },
          { label: this.t("Facts.fact26.organ"), value: converter.getOrganConverter(this.organ) },
          { label: this.t("Facts.fact26.date_decision"), value: this.date_decision },
          { label: this.t("Facts.fact26.date_registration"), value: this.date_registration },
          { label: this.t("Facts.fact26.num_registration"), value: this.num_registration },
          { label: this.t("Facts.fact26.placement_method"), value: this.placement_method },
        ],
      },
    };
  }
}
