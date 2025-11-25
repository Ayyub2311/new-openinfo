import { IsArray, IsString, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { FactBase } from "./base/FactBase";
import { Factsshareinauthorized } from "./nested/Factsshareinauthorized";
import {
  FactBuilderProps,
  FactBuilderSectionDescriptionList,
  FactBuilderSectionTable,
} from "@/app/features/facts/components/FactBuilder";
import { Factslistofmember } from "@/app/features/facts/models/nested/Factslistofmember";

export class Fact34 extends FactBase {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Factslistofmember)
  factslistofmembers: Factslistofmember[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Factsshareinauthorized)
  factsshareinauthorized: Factsshareinauthorized[];

  @IsString()
  meeting_emintet: string;

  @IsString()
  doc_emintet: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        this.getSectionInformationOnMaterialFact,
        this.getFactShareSupervisoryBoard,
        this.getSectionInformationOnMaterialFact2,
        this.getFactListofmember,
        super.getSectionOrganizationLeadership,
      ],
    };
  }

  get getSectionInformationOnMaterialFact(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("Facts.fact34.title"),
        items: [
          { label: this.t("Facts.fact34.factNumberTitle"), value: this.fact_number },
          { label: this.t("Facts.fact34.factTitleTitle"), value: this.fact_title },
          { label: this.t("Facts.fact34.meetingEmintetTitle"), value: this.meeting_emintet },
        ],
      },
    };
  }

  get getSectionInformationOnMaterialFact2(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: { items: [{ label: this.t("Facts.fact34.docEmintetTitle"), value: this.doc_emintet }] },
    };
  }

  get getFactShareSupervisoryBoard(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factsshareinauthorized.getColumns, data: this.factsshareinauthorized } },
    };
  }

  get getFactListofmember(): FactBuilderSectionTable {
    return {
      component: "table",
      props: { tableProps: { columns: Factslistofmember.getColumns, data: this.factslistofmembers } },
    };
  }
}
