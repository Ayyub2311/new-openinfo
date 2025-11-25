import { IsString, IsNumber } from "class-validator";

export class FactsDecisionsWording {
  @IsNumber()
  id: number;

  @IsString()
  num: string;

  @IsString()
  decisions_wording: string;

  @IsNumber()
  main: number;
}
