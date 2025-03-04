import { MissingParamError } from '../../erros';
import { RequiredFieldValidation } from './required-field-validation';

describe('RequiredField Validation', () => {
  const makeSut = (): RequiredFieldValidation => {
    return new RequiredFieldValidation('field');
  };

  it('Shold return a MissingParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({});

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Shold return null if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeNull();
  });
});
