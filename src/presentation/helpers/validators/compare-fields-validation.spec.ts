import { InvalidParamError } from '../../erros';
import { CompareFieldsValidation } from './compare-fields-validators';

describe('CompareFields Validation', () => {
  const makeSut = (): CompareFieldsValidation => {
    return new CompareFieldsValidation('field', 'fieldToCompare');
  };

  it('Shold return a InvalidParamError if validation fails', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'wrong_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('Shold return null if validation success', () => {
    const sut = makeSut();
    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeNull();
  });
});
