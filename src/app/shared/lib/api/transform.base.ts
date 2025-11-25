import { validate } from "class-validator";
import { plainToClass } from "class-transformer";

export abstract class BaseTransformer {
  static async validateAndTransform<T extends object>(dto: new () => T, data: Record<string, unknown>) {
    const instance = plainToClass(dto, data);
    const errors = await validate(instance);

    const knownProps = Object.getOwnPropertyNames(instance);
    const unknownFields = Object.keys(data).filter(key => !knownProps.includes(key));

    return {
      data: instance,
      unknownFields,
      errors: errors.map(error => Object.values(error.constraints || {}).join(", ")),
    };
  }
}
