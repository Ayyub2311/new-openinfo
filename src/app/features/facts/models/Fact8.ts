import { IsString, IsArray } from "class-validator";
import { FactBase } from "./base/FactBase";
import { Factscaseelection } from "./nested/Factscaseelection";
import { Factsmembershipexecutive } from "./nested/Factsmembershipexecutive";
import { Factsterminationpower } from "./nested/Factsterminationpower";
import { FactBuilderProps, FactBuilderSectionTable } from "../components/FactBuilder";
import { TranslationKeys } from "next-intl";

export class Fact8 extends FactBase {
  @IsString()
  protocol_meeting_pdf: string;

  @IsArray()
  factscaseelection: Factscaseelection[];

  @IsArray()
  factsmembershipexecutive: Factsmembershipexecutive[];

  @IsArray()
  factsterminationpowers: Factsterminationpower[];

  @IsString()
  meeting_emintet: string;

  @IsString()
  date_apply: string;

  @IsString()
  date_protocol: string;

  @IsString()
  protocol_meeting: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getFactsterminationpowers,
        this.getFactscaseelection,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getFactsterminationpowers(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact8.terminationPowersTitle" as TranslationKeys),
        tableProps: { columns: Factsterminationpower.getColumns, data: this.factsterminationpowers },
      },
    };
  }

  get getFactscaseelection(): FactBuilderSectionTable {
    return {
      component: "table",
      props: {
        title: this.t("Facts.fact8.caseElectionTitle" as TranslationKeys),
        tableProps: { columns: Factscaseelection.getColumns, data: this.factscaseelection },
      },
    };
  }
}
