import { InvalidParamError } from '../../erros';
import { EmailValidator } from '../../protocols/email-validator';
import { Validation } from './validation';

export class EmailValidation implements Validation {
  private readonly fieldName: string;
  private readonly emailValidator: EmailValidator;

  constructor(fieldName: string, emailValidator: EmailValidator) {
    this.fieldName = fieldName;
    this.emailValidator = emailValidator;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(input: any): Error {
    const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);

    if (!isEmailValid) return new InvalidParamError(this.fieldName);

    return null as unknown as Error;
  }
}
