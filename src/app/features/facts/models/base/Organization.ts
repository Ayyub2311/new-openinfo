import { Type } from "class-transformer";
import { IsBoolean, IsEmail, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from "class-validator";
import { DetailInfo } from "./DetailInfo";

export class Organization {
  @IsNumber()
  id: number;

  @ValidateNested()
  @Type(() => DetailInfo)
  detailinfo: DetailInfo;

  @IsNumber()
  inn: number;

  @IsString()
  full_name_text: string;

  @IsString()
  short_name_text: string;

  @IsString()
  exchange_ticket_name: string;

  @IsString()
  location: string;

  @IsString()
  address: string;

  @IsEmail()
  email: string;

  @IsUrl()
  web_site: string;

  @IsBoolean()
  status: boolean;

  @IsOptional()
  serving_bank: any;

  @IsOptional()
  account_number: any;

  @IsOptional()
  mfo: any;

  @IsOptional()
  gov_reg_number: any;

  @IsOptional()
  kfs: any;

  @IsOptional()
  okpo: any;

  @IsOptional()
  okonx: any;

  @IsOptional()
  soato: any;

  @IsString()
  on_maps: string;

  @IsString()
  region: string;

  @IsBoolean()
  is_listing: boolean;

  @IsNumber()
  name_suffix: number;

  @IsNumber()
  responsible_person: number;
}
