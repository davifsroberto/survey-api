import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { Validation } from '../../../presentation/protocols/validation';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../../presentation/helpers/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      email;

      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SingnUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const fields = ['name', 'email', 'password', 'passwordConfirmation'];
    const validations: Validation[] = fields.map(
      (field) => new RequiredFieldValidation(field),
    );

    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation'),
    );
    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
