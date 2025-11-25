import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact28 extends FactBase {
  @IsNumber()
  paper_type: number;

  @IsString()
  paper_num: string;

  @IsString()
  nominal_paper_cost: string;

  @IsNumber()
  total_amount: number;

  @IsString()
  date_registration: string;

  @IsString()
  num_registration: string;

  @IsString()
  suspension_reason: string;

  @IsString()
  date_recognition_of_fail: string;

  @IsString()
  date_solutions: string;

  @IsString()
  procedure_repayment: string;

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
        title: this.t("Facts.fact28.title"),
        items: [
          { label: this.t("Facts.fact28.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact28.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact28.paper_type"), value: converter.getSecurityTypes(this.paper_type) },
          { label: this.t("Facts.fact28.paper_num"), value: this.paper_num },
          { label: this.t("Facts.fact28.nominal_paper_cost"), value: this.nominal_paper_cost },
          { label: this.t("Facts.fact28.total_amount"), value: this.total_amount },
          { label: this.t("Facts.fact28.date_registration"), value: this.date_registration },
          { label: this.t("Facts.fact28.num_registration"), value: this.num_registration },
          { label: this.t("Facts.fact28.suspension_reason"), value: this.suspension_reason },
          { label: this.t("Facts.fact28.date_recognition_of_fail"), value: this.date_recognition_of_fail },
          { label: this.t("Facts.fact28.date_solutions"), value: this.date_solutions },
          { label: this.t("Facts.fact28.procedure_repayment"), value: this.procedure_repayment },
        ],
      },
    };
  }
}
