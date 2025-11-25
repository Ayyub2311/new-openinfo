import { IsString, IsEmail, IsNumber } from "class-validator";
import { Expose, Transform } from "class-transformer";

export class EssentialFactModel {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  @Transform(({ value }) => value.trim())
  name: string;

  @Expose()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}
