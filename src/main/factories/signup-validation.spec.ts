import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validators';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';
import { makeSignUpValidation } from './signup-validation';

jest.mock('../../presentation/helpers/validators/validation-composite');

describe('SingnUp Validation Factory', () => {
  it('Should call ValidationComposite with all validations', () => {
    makeSignUpValidation();

    const fields = ['name', 'email', 'password', 'passwordConfirmation'];

    const validations: Validation[] = fields.map(
      (field) => new RequiredFieldValidation(field),
    );

    validations.push(
      new CompareFieldsValidator('password', 'passwordConfirmation'),
    );

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
