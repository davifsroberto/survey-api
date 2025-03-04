import { MissingParamError } from '../../erros';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field');
  };

  it('Shold return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({ invalidField: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
