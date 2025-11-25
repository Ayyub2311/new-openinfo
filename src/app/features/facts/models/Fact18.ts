import { IsString, IsArray, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FactBase } from "./base/FactBase";
import { Factsinformationlist } from "./nested/Factsinformationlist";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionTable,
} from "@/app/features/facts/components/FactBuilder";
import { Factnameoftheasset } from "@/app/features/facts/models/nested/Factnameoftheasset";

export class Fact18 extends FactBase {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Factsinformationlist)
  factsinformationlist: Factsinformationlist[];

  @IsString()
  value_of_assets: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getFactscaseelectionendofquarter,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact18.title"),
        items: [
          { label: this.t("Facts.fact18.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact18.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact18.valueOfAssetsTitle"), value: this.value_of_assets },
        ],
      },
    };
  }

  get getFactscaseelectionendofquarter(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factnameoftheasset.getColumns, data: this.factsinformationlist } },
    };
  }
}
