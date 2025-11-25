import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FactBase } from "./base/FactBase";
import { Factscorresponding } from "./nested/Factscorresponding";
import { Factslistaffiliate } from "./nested/Factslistaffiliate";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionTable,
} from "@/app/features/facts/components/FactBuilder";

export class Fact36 extends FactBase {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Factscorresponding)
  factscorresponding: Factscorresponding[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Factslistaffiliate)
  factslistaffiliates: Factslistaffiliate[];

  @IsString()
  date_vnesn: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getSectionInformationOnMaterialFact2,
        this.getFactShareSupervisoryBoard,
        this.getFactListofmember,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact36.title"),
        items: [
          { label: this.t("Facts.fact36.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact36.factTitleTitle"), value: this.fact_title },
        ],
      },
    };
  }
  get getSectionInformationOnMaterialFact2(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact36.title"),
        items: [
          { label: this.t("Facts.fact36.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact36.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact36.dateVnesnTitle"), value: this.date_vnesn?.split("-").reverse().join(".") },
        ],
      },
    };
  }

  get getFactShareSupervisoryBoard(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factscorresponding.getColumns, data: this.factscorresponding } },
    };
  }

  get getFactListofmember(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factslistaffiliate.getColumns, data: this.factslistaffiliates } },
    };
  }
}
