import { IsString, IsNumber } from "class-validator";

export class Factsmembershipexecutive {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  work_place: string;

  @IsString()
  position: string;

  @IsNumber()
  num_aksiya: number;

  @IsString()
  type_aksiya: string;

  @IsString()
  other_work_place: string;

  @IsString()
  other_position: string;

  @IsNumber()
  main: number;
}
