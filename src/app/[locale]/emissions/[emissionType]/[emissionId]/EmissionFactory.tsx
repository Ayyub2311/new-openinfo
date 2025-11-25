import { Emission } from "./emissions/Emission";
import { EmissionBase } from "./emissions/EmissionBase";

export class EmissionFactory {
  private static factMap: { [key: string]: typeof EmissionBase } = {
    emissions: Emission,
  };

  static createFact(data: { content_type_name: string } & Record<string, unknown>): EmissionBase {
    const EmissionClass = this.factMap[data.content_type_name];

    if (!EmissionClass) {
      throw new Error(`Unknown fact number: ${data.content_type_name}`);
    }

    return EmissionClass.create(data);
  }

  static isValidFactNumber(factNumber: number): boolean {
    return factNumber in this.factMap;
  }
}
