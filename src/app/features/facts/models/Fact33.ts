import { IsNumber, IsString } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";

export class Fact33 extends FactBase {
  @IsString()
  date_solution: string;

  @IsNumber()
  organ: number;

  @IsNumber()
  procedure: number;

  @IsString()
  date_begin: string;

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
        title: this.t("Facts.fact33.title"),
        items: [
          { label: this.t("Facts.fact33.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact33.factTitleTitle"), value: this.fact_title },
          {
            label: this.t("Facts.fact33.dateSolutionTitle"),
            value: this.date_solution?.split("-").reverse().join("."),
          },
          { label: this.t("Facts.fact33.organTitle"), value: this.organ },
          { label: this.t("Facts.fact33.procedureTitle"), value: this.procedure },
          { label: this.t("Facts.fact33.dateBeginTitle"), value: this.date_begin?.split("-").reverse().join(".") },
        ],
      },
    };
  }
}
