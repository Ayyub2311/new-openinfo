import { FactBuilderProps, FactBuilderSectionDescriptionList } from "@/app/features/facts/components/FactBuilder";
import { EmissionBase } from "./EmissionBase";
import { IsNumber, IsString } from "class-validator";

interface ObjectCondition {
  id: number;
  is_highlight: boolean;
  is_title: boolean;
  main_emission: number;
  title: string;
  title_id: number;
  value: string;
}

export class Emission extends EmissionBase {
  @IsNumber()
  id: number;

  @IsString()
  status: string;

  object_condition: ObjectCondition[];

  get getSections(): FactBuilderProps {
    return {
      sections: [super.getSectionNameOfTheIssuer, super.getSectionContactDetails, this.getSectionObjectDetection],
    };
  }

  get getSectionObjectDetection(): FactBuilderSectionDescriptionList {
    return {
      component: "description-list",
      props: {
        title: this.t("emission.title_object_detection"),
        items: [
          ...this.object_condition.map(obj => ({
            label: obj.title,
            value: obj.value,
          })),
        ],
      },
    };
  }
}
