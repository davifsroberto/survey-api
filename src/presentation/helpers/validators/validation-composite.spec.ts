import { MissingParamError } from '../../erros';
import { Validation } from '../../protocols/validation';
import { ValidationComposite } from './validation-composite';

interface SutTypes {
  sut: ValidationComposite;
  validationStubs: Validation[];
}

const makeVaslidation = (): Validation => {
  class ValidationStub implements Validation {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    validate(input: any): Error {
      input;

      return null as unknown as Error;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const validationStubs = [makeVaslidation(), makeVaslidation()];
  const sut = new ValidationComposite(validationStubs);

  return {
    sut,
    validationStubs,
  };
};

describe('Validation Composite', () => {
  it('Should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('Should return the first error if more than one validation fails', () => {
    const { sut, validationStubs } = makeSut();

    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());

    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new Error());
  });

  it('Should not return if validation success', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'any_value' });

    expect(error).toBeFalsy();
  });
});
