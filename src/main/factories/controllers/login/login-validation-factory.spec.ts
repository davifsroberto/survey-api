import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { EmailValidator } from '../../../../validation/potocols/email-validator';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
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
