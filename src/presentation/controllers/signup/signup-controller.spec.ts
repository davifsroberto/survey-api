import {
  AccountModel,
  AddAccount,
  AddAccountModel,
  HttpRequest,
  Validation,
  Authentication as makeAuthentication,
  AuthenticationModel,
} from './signup-controller-protocols';
import { MissingParamError, ServerError } from '../../erros';
import { SignUpController } from './signup-controller';
import { badRequest, ok, serverError } from '../../helpers/http/http-helper';

interface SutTypes {
  sut: SignUpController;
  addAccountStub: AddAccount;
  validationStub: Validation;
  authenticationStub: makeAuthentication;
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

const makeAuthentication = (): makeAuthentication => {
  class AuthenticationStub implements makeAuthentication {
    async auth(_authentication: AuthenticationModel): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
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

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthentication();
  const addAccountStub = makeAddAccount();
  const validationStub = makeValidation();
  const sut = new SignUpController(
    addAccountStub,
    validationStub,
    authenticationStub,
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

describe('SignUp Controller', () => {
  const { sut, addAccountStub } = makeSut();
  const addSpy = jest.spyOn(addAccountStub, 'add');

  sut.handle(makeFakeRequest());

  expect(addSpy).toHaveBeenCalledWith({
    name: 'any_name',
    email: 'any_email@domain.com',
    password: 'any_password',
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

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any_field')),
    );
  });

  it('Shold call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@domain.com',
      password: 'any_password',
    });
  });
});
