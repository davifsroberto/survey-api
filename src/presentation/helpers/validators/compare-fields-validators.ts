import { InvalidParamError } from '../../erros';
import { Validation } from './validation';

export class CompareFieldsValidator implements Validation {
  private readonly fieldName: string;
  private readonly fieldNameToCompare: string;

  constructor(fieldName: string, fieldNameToCompare: string) {
    this.fieldName = fieldName;
    this.fieldNameToCompare = fieldNameToCompare;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error {
    if (input[this.fieldName] !== input.fieldNameToCompare) {
      return new InvalidParamError(this.fieldNameToCompare);
    }

    return null as unknown as Error;
  }
}
