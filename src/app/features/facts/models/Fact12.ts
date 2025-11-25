import { IsString, IsArray } from "class-validator";
import { Factslistsubsidiarie } from "./nested/Factslistsubsidiarie";
import { Factsinformationofabout } from "./nested/Factsinformationofabout";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps, FactBuilderSectionTable } from "../components/FactBuilder";

export class Fact12 extends FactBase {
  @IsArray()
  factslistsubsidiarie: Factslistsubsidiarie[];

  @IsArray()
  factsinformationofabout: Factsinformationofabout[];

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
        title: this.t("Facts.fact12.factsInformationAboutTitle"),
        tableProps: { columns: Factsinformationofabout.getColumns, data: this.factsinformationofabout },
      },
    };
  }

  get getFactslistsubsidiarie(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact12.factsListSubsidiarieTitle"),
        tableProps: { columns: Factslistsubsidiarie.getColumns, data: this.factslistsubsidiarie },
      },
    };
  }
}
