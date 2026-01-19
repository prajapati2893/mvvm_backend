import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'isOneOf', async: false })
export class IsOneOfConstraint implements ValidatorConstraintInterface {
  validate(_value: unknown, args: ValidationArguments): boolean {
    const relatedPropertyNames = args.constraints[0] as string[];
    const object = args.object as Record<string, unknown>;

    // Count how many of the related properties are defined (not null/undefined)
    const definedCount = relatedPropertyNames.filter((propertyName: string) => {
      const val = object[propertyName];
      return val !== null && val !== undefined;
    }).length;

    // Exactly one should be defined
    return definedCount === 1;
  }

  defaultMessage(args: ValidationArguments): string {
    const relatedPropertyNames = args.constraints[0] as string[];
    return `Exactly one of [${relatedPropertyNames.join(', ')}] must be provided`;
  }
}

export function IsOneOf(
  properties: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [properties],
      validator: IsOneOfConstraint,
    });
  };
}
