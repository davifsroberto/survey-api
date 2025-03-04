import { InvalidParamError } from '../../erros';
import { EmailValidator } from '../../protocols/email-validator';
import { Validation } from '../../protocols/validation';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  validate<T>(input: T): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isEmailValid) return new InvalidParamError(this.fieldName);

    return null as unknown as Error;
  }
}
