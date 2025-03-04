import { ok, unauthorized } from '../../helpers/http/http-helper';
import { Validation } from '../signup/signup-protocols';
import { LoginController } from './login';
import {
  Authentication,
  AuthenticationModel,
  HttpRequest,
} from './login-protocols';

interface SutTypes {
  sut: LoginController;
  authenticationStub: Authentication;
  validationStub: Validation;
}

const makeFakeRequest = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password',
  },
});

const Authentication = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(_authentication: AuthenticationModel): Promise<string> {
      return 'any_token';
    }
  }

  return new AuthenticationStub();
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
  const authenticationStub = Authentication();
  const validationStub = makeValidation();
  const sut = new LoginController(validationStub, authenticationStub);

  return {
    sut,
    authenticationStub,
    validationStub,
  };
};

describe('Login Controller', () => {
  it('Shold call authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');
    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password',
    });
  });

  it('Shold return 401 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(
        new Promise((resolve) => resolve(null as unknown as string)),
      );

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });

  it('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise((_, reject) => reject(new Error())));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse.statusCode).toBe(500);
  });

  it('Should return 200 if valid credentials are provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });
});
