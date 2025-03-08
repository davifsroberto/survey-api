import {
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../validation/validators';
import { EmailValidator } from '../../../../validation/potocols/email-validator';
import { Validation } from '../../../../presentation/protocols/validation';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(_email: string): boolean {
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
