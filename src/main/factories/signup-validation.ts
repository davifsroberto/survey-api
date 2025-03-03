import { CompareFieldsValidator } from '../../presentation/helpers/validators/compare-fields-validators';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { Validation } from '../../presentation/helpers/validators/validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = (): ValidationComposite => {
  const fields = ['name', 'email', 'password', 'passwordConfirmation'];
  const validations: Validation[] = fields.map(
    (field) => new RequiredFieldValidation(field),
  );

  validations.push(
    new CompareFieldsValidator('password', 'passwordConfirmation'),
  );

  return new ValidationComposite(validations);
};
