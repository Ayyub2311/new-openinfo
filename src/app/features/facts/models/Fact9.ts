import { IsString, IsArray } from "class-validator";
import { FactBase } from "./base/FactBase";
import { Factsinformationchange } from "./nested/Factsinformationchange";
import { Factslistbranch } from "./nested/Factslistbranch";
import { FactBuilderProps, FactBuilderSectionTable } from "../components/FactBuilder";
import { TranslationKeys } from "next-intl";

export class Fact9 extends FactBase {
  @IsArray()
  factsinformationchanges: Factsinformationchange[];

  @IsArray()
  factslistbranch: Factslistbranch[];

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
        this.getFactsinformationchanges,
        this.getFactslistbranch,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getFactsinformationchanges(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact9.factsInformationChangesTitle" as TranslationKeys),
        tableProps: { columns: Factsinformationchange.getColumns, data: this.factsinformationchanges },
      },
    };
  }

  get getFactslistbranch(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact9.factsListBranchTitle" as TranslationKeys),
        tableProps: { columns: Factslistbranch.getColumns, data: this.factslistbranch },
      },
    };
  }
}
