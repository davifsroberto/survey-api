import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
} from './signup-protocols';
import { MissingParamError, ServerError } from '../../erros';
import { SignUpController } from './signup';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
}

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add(_account: AddAccountModel): Promise<AccountModel> {
      return new Promise((resolve) => resolve(makeFakeAccount()));
    }
  }

  return new AddAccountStub();
};

const makeValidation = (): Validation => {
  class ValidationStub implements Validation {
    validate<T>(_input: T): Error {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let error: any;

      return error;
    }
  }

  return new ValidationStub();
};

const makeSut = (): SutTypes => {
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(addAccountStub, validationStub);

  return {
    sut,
    addAccountStub,
    validationStub,
  };
};

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@domain.com',
  password: 'valid_password',
});

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@domain.com',
    password: 'any_password',
    passwordConfirmation: 'any_password',
  },
});

describe('SignUp Controller', () => {
  const { sut, addAccountStub } = makeSut();
  const addSpy = jest.spyOn(addAccountStub, 'add');

  sut.handle(makeFakeRequest());

  expect(addSpy).toHaveBeenCalledWith({
    name: 'any_name',
    email: 'any_email@domain.com',
    password: 'any_password',
  });
});

it('Should return 500 if AddAccount throws', async () => {
  const { sut, addAccountStub } = makeSut();

  jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
    return new Promise((_, reject) => reject(new Error()));
  });

  const httpResponse = await sut.handle(makeFakeRequest());

  expect(httpResponse).toEqual(serverError(new ServerError()));
});

it('Should return 200 if valid data is provided', async () => {
  const { sut } = makeSut();
  const httpResponse = await sut.handle(makeFakeRequest());

  expect(httpResponse).toEqual(ok(makeFakeAccount()));
});

it('Should call Validation with correct value', async () => {
  const { sut, validationStub } = makeSut();
  const validateSpy = jest.spyOn(validationStub, 'validate');
  const httpRequest = makeFakeRequest();

  await sut.handle(httpRequest);

  expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
});

it('Should return 400 if Validation returns an error', async () => {
  const { sut, validationStub } = makeSut();

  jest
    .spyOn(validationStub, 'validate')
    .mockReturnValueOnce(new MissingParamError('any_field'));

  const httpResponse = await sut.handle(makeFakeRequest());

  expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')));
});
