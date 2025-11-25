import { Type } from "class-transformer";
import { IsEmail, IsOptional, IsString, ValidateNested } from "class-validator";
import { Organization } from "./Organization";
import { ConvertTypes } from "./ConvertTypes";

export class OrganizationInfo extends ConvertTypes {
  @ValidateNested()
  @Type(() => Organization)
  organization: Organization;

  @IsString()
  organization_name: string;

  @IsString()
  organization_short_name_text: string;

  @IsString()
  organization_inn: string;

  @IsString()
  @IsOptional()
  org_ticket_number: string | null;

  @IsString()
  org_location: string;

  @IsString()
  org_address: string;

  @IsEmail()
  org_email: string;

  @IsString()
  @IsOptional()
  org_website: string | null;
}
