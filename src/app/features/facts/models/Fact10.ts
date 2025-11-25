import { IsString, IsArray } from "class-validator";
import { FactBase } from "./base/FactBase";
import { Factsinformationchange } from "./nested/Factsinformationchange";
import { FactBuilderProps, FactBuilderSectionTable } from "../components/FactBuilder";
import { Factslistbranch } from "./nested";

export class Fact10 extends FactBase {
  @IsArray()
  factslistofbranches: Factslistbranch[];

  @IsArray()
  factsinformationchanges: Factsinformationchange[];

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
        this.getFactsinformationchangesSection,
        this.getFactslistofbranchesSection,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getFactsinformationchangesSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact10.factsInformationChangesTitle"),
        tableProps: { columns: Factsinformationchange.getColumns, data: this.factsinformationchanges },
      },
    };
  }

  get getFactslistofbranchesSection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact10.factsListBranchTitle"),
        tableProps: { columns: Factslistbranch.getColumns, data: this.factslistofbranches },
      },
    };
  }
}
