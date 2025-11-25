import { IsString, IsArray } from "class-validator";
import { FactBase } from "./base/FactBase";
import { Factsinformationabout } from "./nested/Factsinformationabout";
import { Factslistsubsidiarie } from "./nested/Factslistsubsidiarie";
import { FactBuilderProps, FactBuilderSectionTable } from "../components/FactBuilder";
import { TranslationKeys } from "next-intl";

export class Fact11 extends FactBase {
  @IsArray()
  factslistsubsiadiaries: Factslistsubsidiarie[];

  @IsArray()
  factsinformationabout: Factsinformationabout[];

  @IsString()
  meeting_emintet: string;

  @IsString()
  date_apply: string;

  @IsString()
  date_protocol: string;

  @IsString()
  date_effective: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getFactsinformationabout,
        this.getFactslistsubsidiarie,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getFactsinformationabout(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact11.factsInformationAboutTitle" as TranslationKeys),
        tableProps: { columns: Factsinformationabout.getColumns, data: this.factsinformationabout },
      },
    };
  }

  get getFactslistsubsidiarie(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factslistsubsidiarie.getColumns, data: this.factslistsubsiadiaries } },
    };
  }
}
