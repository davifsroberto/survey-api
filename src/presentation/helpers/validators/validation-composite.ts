import { Validation } from '../../protocols/validation';

export class ValidationComposite implements Validation {
  constructor(private readonly validations: Validation[]) {}

  validate<T>(input: T): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input);

      if (error) return error;
    }

    return null as unknown as Error;
  }
}
