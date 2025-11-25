import { ConvertTypes } from "@/app/features/facts/models/base/ConvertTypes";
import { Organization } from "@/app/features/facts/models/base/Organization";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

export class EmissionOrganizationInfo extends ConvertTypes {
  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;
}
