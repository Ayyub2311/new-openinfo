import { FetchService } from "@/app/shared/lib/api/fetch.service";
import { EssentialFact, EssentialFactRequest } from "../types/essential-fact.types";

export default class EssentialFactsService {
  static async getFacts(params: EssentialFactRequest): Promise<EssentialFact[]> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    return FetchService.fetch<EssentialFact[]>(`/products?${queryParams}`);
  }

  static async getFactById(id: string): Promise<EssentialFact> {
    return FetchService.fetch<EssentialFact>(`/products/${id}`);
  }
}
