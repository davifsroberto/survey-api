import { MissingParamError } from '../../presentation/erros';
import { Validation } from '../../presentation/protocols';

export class RequiredFieldValidation implements Validation {
  constructor(private readonly fieldName: string) {}

  validate<T>(input: T): Error {
    if (!input[this.fieldName]) return new MissingParamError(this.fieldName);

    return null as unknown as Error;
  }
}
