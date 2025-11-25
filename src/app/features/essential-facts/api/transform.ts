import { BaseTransformer } from "@/app/shared/lib/api/transform.base";
import { EssentialFactModel } from "../models/essential-fact.model";
import { ApiResponse } from "@/app/shared/types/api.types";

export class UserTransformer extends BaseTransformer {
  static async transformResponse(data: Record<string, unknown>): Promise<ApiResponse<EssentialFactModel>> {
    try {
      const { data: validatedData, unknownFields, errors } = await this.validateAndTransform(EssentialFactModel, data);

      if (errors.length > 0) {
        throw new Error(`Validation failed: ${errors.join(", ")}`);
      }

      return {
        success: true,
        data: validatedData as EssentialFactModel,
        metadata: {
          unknownFields,
          transformedAt: new Date(),
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        metadata: {
          transformedAt: new Date(),
        },
      };
    }
  }
}
