import { FactBase } from "./base/FactBase";
import { Fact1 } from "./Fact1";
import { Fact2 } from "./Fact2";
import { Fact3 } from "./Fact3";
import { Fact4 } from "./Fact4";
import { Fact5 } from "./Fact5";
import { Fact6 } from "./Fact6";
import { Fact7 } from "./Fact7";
import { Fact8 } from "./Fact8";
import { Fact9 } from "./Fact9";
import { Fact10 } from "./Fact10";
import { Fact11 } from "./Fact11";
import { Fact12 } from "./Fact12";
import { Fact13 } from "./Fact13";
import { Fact14 } from "./Fact14";
import { Fact15 } from "./Fact15";
import { Fact16 } from "./Fact16";
import { Fact17 } from "./Fact17";
import { Fact18 } from "./Fact18";
import { Fact19 } from "./Fact19";
import { Fact20 } from "./Fact20";
import { Fact21 } from "./Fact21";
import { Fact22 } from "./Fact22";
import { Fact23 } from "./Fact23";
import { Fact24 } from "./Fact24";
import { Fact25 } from "./Fact25";
import { Fact26 } from "./Fact26";
import { Fact27 } from "./Fact27";
import { Fact28 } from "./Fact28";
import { Fact29 } from "./Fact29";
import { Fact30 } from "./Fact30";
import { Fact31 } from "./Fact31";
import { Fact32 } from "./Fact32";
import { Fact33 } from "./Fact33";
import { Fact34 } from "./Fact34";
import { Fact35 } from "./Fact35";
import { Fact36 } from "./Fact36";
import { Fact37 } from "./Fact37";
import { Fact38 } from "./Fact38";
import { Fact39 } from "./Fact39";
import { Fact40 } from "./Fact40";
import { Fact41 } from "./Fact41";
import { Fact42 } from "./Fact42";
import { Fact43 } from "./Fact43";
import { Fact44 } from "./Fact44";
import { Fact45 } from "./Fact45";

export class FactFactory {
  private static factMap: { [key: number]: typeof FactBase } = {
    1: Fact1,
    2: Fact2,
    3: Fact3,
    4: Fact4,
    5: Fact5,
    6: Fact6,
    7: Fact7,
    8: Fact8,
    9: Fact9,
    10: Fact10,
    11: Fact11,
    12: Fact12,
    13: Fact13,
    14: Fact14,
    15: Fact15,
    16: Fact16,
    17: Fact17,
    18: Fact18,
    19: Fact19,
    20: Fact20,
    21: Fact21,
    22: Fact22,
    23: Fact23,
    24: Fact24,
    25: Fact25,
    26: Fact26,
    27: Fact27,
    28: Fact28,
    29: Fact29,
    30: Fact30,
    31: Fact31,
    32: Fact32,
    33: Fact33,
    34: Fact34,
    35: Fact35,
    36: Fact36,
    37: Fact37,
    38: Fact38,
    39: Fact39,
    40: Fact40,
    41: Fact41,
    42: Fact42,
    43: Fact43,
    44: Fact44,
    45: Fact45,
  };

  static createFact(data: { fact_number: number } & Record<string, unknown>): FactBase {
    const FactClass = this.factMap[data.fact_number];

    if (!FactClass) {
      throw new Error(`Unknown fact number: ${data.fact_number}`);
    }

    return FactClass.create(data);
  }

  static isValidFactNumber(factNumber: number): boolean {
    return factNumber in this.factMap;
  }
}
