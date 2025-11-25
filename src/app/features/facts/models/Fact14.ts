import { IsString, IsNumber } from "class-validator";
import { FactBase } from "./base/FactBase";
import { FactBuilderProps } from "../components/FactBuilder";

export class Fact14 extends FactBase {
  @IsString()
  date_of_filing: string;

  @IsString()
  date_of_adoption: string;

  @IsString()
  date_of_receipt: string;

  @IsString()
  person_filed: string;

  @IsString()
  subject_matter: string;

  @IsNumber()
  claim_amount: number;

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
