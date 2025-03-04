import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../presentation/helpers/validators';
import { EmailValidator } from '../../../presentation/protocols/email-validator';
import { Validation } from '../../../presentation/protocols/validation';
import { makeLoginValidation } from './login-validation';

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

describe('Login Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();

    const fields = ['email', 'password'];
    const validations: Validation[] = fields.map(
      (field) => new RequiredFieldValidation(field),
    );

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
