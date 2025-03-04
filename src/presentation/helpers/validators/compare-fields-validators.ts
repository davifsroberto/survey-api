import { InvalidParamError } from '../../erros';
import { Validation } from '../../protocols/validation';

export class CompareFieldsValidation implements Validation {
  private readonly fieldName: string;
  private readonly fieldNameToCompare: string;

  constructor(fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName;
    this.fieldNameToCompare = fieldNameToCompare;
  }

  validate<T>(input: T): Error {
    if (input[this.fieldName] !== input[this.fieldNameToCompare]) {
      return new InvalidParamError(this.fieldNameToCompare);
    }

    return null as unknown as Error;
  }
}
