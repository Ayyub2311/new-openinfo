import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps } from "../components/FactBuilder";

export class Fact13 extends FactBase {
  @IsString()
  authority_imposing: string;

  @IsString()
  date_seizure: string;

  @IsString()
  date_seizure_info: string;

  @IsNumber()
  name_of_property: number;

  @IsNumber()
  carrying_value: number;

  @IsString()
  bank_name: string;

  @IsNumber()
  current_account: number;

  @IsNumber()
  mfo: number;

  @IsString()
  date_protocol: string;

  @IsString()
  date_effective: string;

  get getSections(): FactBuilderProps {
    return {
      sections: [
        super.getSectionNameOfTheIssuer,
        super.getSectionContactDetails,
        super.getSectionOrganizationLeadership,
      ],
    };
  }
}
