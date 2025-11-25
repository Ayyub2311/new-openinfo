import { IsNumber, IsString } from "class-validator";

export class DetailInfo {
  @IsNumber()
  id: number;

  @IsString()
  logo_file: string;

  @IsString()
  short_info_ru: string;

  @IsString()
  short_info_uz: string;

  @IsString()
  short_info_en: string;

  @IsString()
  director_name: string;

  @IsString()
  review: string;

  @IsString()
  phone_number: string;

  @IsString()
  updated_at: string;

  @IsString()
  created_at: string;

  @IsNumber()
  organization: number;
}
