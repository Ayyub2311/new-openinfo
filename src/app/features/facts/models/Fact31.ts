import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "../components/FactBuilder";
import { ConvertTypes } from "./base/ConvertTypes";

export class Fact31 extends FactBase {
  @IsString()
  description_issuers_obligations: string;

  @IsNumber()
  organ: number;

  @IsString()
  date_solution: string;

  @IsString()
  date_begin: string;

  @IsString()
  date_end: string;

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
        title: this.t("Facts.fact31.title"),
        items: [
          { label: this.t("Facts.fact31.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact31.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact31.organ"), value: converter.getOrganConverter(this.organ) },
          {
            label: this.t("Facts.fact31.description_issuers_obligations"),
            value: this.description_issuers_obligations,
          },
          { label: this.t("Facts.fact31.date_solution"), value: this.date_solution },
          { label: this.t("Facts.fact31.dateSolution"), value: this.date_solution },
          { label: this.t("Facts.fact31.date_begin"), value: this.date_begin },
          { label: this.t("Facts.fact31.date_end"), value: this.date_end },
        ],
      },
    };
  }
}
