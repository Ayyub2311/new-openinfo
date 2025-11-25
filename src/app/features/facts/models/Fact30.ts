import { IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FactBase } from "./base/FactBase";
import { Factspercentofshare } from "./nested/Factspercentofshare";
import { Factslistoflegal } from "./nested/Factslistoflegal";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionTable,
} from "../components/FactBuilder";

export class Fact30 extends FactBase {
  @ValidateNested({ each: true })
  @Type(() => Factslistoflegal)
  factsListOfLegal: Factslistoflegal[];

  @ValidateNested({ each: true })
  @Type(() => Factspercentofshare)
  factsPercentOfShares: Factspercentofshare[];

  @IsString()
  meeting_emintet: string;

  @IsString()
  date_apply: string;

  @IsString()
  date_protocol: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getSectionFactsPercentOfShare,
        this.getSectionFactsListOfLegal,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact30.title"),
        items: [
          { label: this.t("Facts.fact30.fact_number"), value: this.fact_number },
          { label: this.t("Facts.fact30.fact_title"), value: this.fact_title },
          { label: this.t("Facts.fact30.meeting_emittent"), value: this.meeting_emintet },
          { label: this.t("Facts.fact30.date_apply"), value: this.date_apply },
          { label: this.t("Facts.fact30.date_protocol"), value: this.date_protocol },
        ],
      },
    };
  }

  get getSectionFactsListOfLegal(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact30.legal_entities_title"),
        tableProps: {
          columns: Factslistoflegal.getColumns,
          data: this.factsListOfLegal || [],
        },
      },
    };
  }

  get getSectionFactsPercentOfShare(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact30.changes_in_ownership_title"),
        tableProps: {
          columns: Factspercentofshare.getColumns,
          data: this.factsPercentOfShares || [],
        },
      },
    };
  }
}
