import { Validation } from '../../presentation/protocols/validation';
import { InvalidParamError } from '../../presentation/erros';

export class CompareFieldsValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldNameToCompare: string,
  ) {}

  validate<T>(input: T): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }

    return null as unknown as Error;
  }
}
