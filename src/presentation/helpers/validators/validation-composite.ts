import { Validation } from '../../protocols/validation';

export class ValidationComposite implements Validation {
  private readonly validations: Validation[];

  constructor(validations: Validation[]) {
    this.validations = validations;
  }

  validate<T>(input: T): Error {
    for (const validation of this.validations) {
      const error = validation.validate(input);

      if (error) return error;
    }

    return null as unknown as Error;
  }
}
