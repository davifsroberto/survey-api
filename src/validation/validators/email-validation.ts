import { InvalidParamError } from '../../presentation/erros';
import { EmailValidator } from '../potocols/email-validator';
import { Validation } from '../../presentation/protocols';

export class EmailValidation implements Validation {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator,
  ) {}

  validate<T>(input: T): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isEmailValid) return new InvalidParamError(this.fieldName);

    return null as unknown as Error;
  }
}
