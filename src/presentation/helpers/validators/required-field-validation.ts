import { MissingParamError } from '../../erros';
import { Validation } from '../../protocols/validation';

export class RequiredFieldValidation implements Validation {
  private readonly fieldName: string;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName);

    return null as unknown as Error;
  }
}
